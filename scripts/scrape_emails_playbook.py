
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from supabase import create_client
import os
from dotenv import load_dotenv

# Load production env
load_dotenv('.env.prod')

# Config
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
RATE_LIMIT = 1  # seconds between requests
EMAIL_CONFIDENCE_THRESHOLD = 0.7

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase environment variables.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Email regex
EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
)

# Generic emails to deprioritize
GENERIC_PREFIXES = [
    'info', 'contact', 'hello', 'admin', 'support',
    'noreply', 'no-reply', 'marketing', 'office'
]

def get_confidence(email, domain):
    """Score email confidence 0-1"""
    local = email.split('@')[0].lower()
    try:
        email_domain = email.split('@')[1].lower()
    except IndexError:
        return 0
    
    score = 0.5  # baseline
    
    # Same domain as website = higher confidence
    if domain in email_domain:
        score += 0.3
    
    # Generic prefix = lower confidence
    if any(local.startswith(p) for p in GENERIC_PREFIXES):
        score -= 0.2
    
    # Personal name pattern = higher confidence (e.g. john.doe@)
    if re.match(r'^[a-z]+\.[a-z]+$', local):
        score += 0.2
        
    # Filter out common false positives
    if any(ext in email for ext in ['.png', '.jpg', '.jpeg', '.svg', '.gif', 'sentry.io']):
        return 0
    
    return min(max(score, 0), 1.0)

def scrape_page_emails(url, domain):
    """Extract emails from a single page"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        }
        print(f"    Fetching {url}...")
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code != 200:
            return [], []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        emails = set()
        
        # 1. Find mailto links
        for link in soup.find_all('a', href=True):
            if 'mailto:' in link['href']:
                email = link['href'].replace('mailto:', '').split('?')[0].strip()
                if EMAIL_PATTERN.match(email):
                    emails.add(email)
        
        # 2. Find emails in text
        text_emails = EMAIL_PATTERN.findall(response.text)
        emails.update(text_emails)
        
        # 3. Find Social Links (to help future discovery)
        social_links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if any(p in href.lower() for p in ['facebook.com', 'instagram.com', 'linkedin.com']):
                social_links.append(href)

        # Filter and score
        valid_emails = []
        for email in emails:
            email = email.lower().strip()
            confidence = get_confidence(email, domain)
            if confidence > 0:
                valid_emails.append({
                    'email': email,
                    'confidence': confidence
                })
        
        return valid_emails, list(set(social_links))
        
    except Exception as e:
        print(f"    Error scraping {url}: {e}")
        return [], []

def scrape_provider_email(provider):
    """Full scraping pipeline for one provider"""
    website = provider.get('website', '')
    if not website:
        return None
    
    # Clean website
    if not website.startswith('http'):
        website = 'https://' + website.replace(' ', '')
    
    domain = urlparse(website).netloc.replace('www.', '')
    
    all_emails = []
    found_socials = set()
    
    # Priority paths from playbook
    paths = [
        '',           # homepage
        '/contact',
        '/contact-us',
        '/about',
        '/about-us',
        '/our-team'
    ]
    
    for path in paths:
        target_url = website.rstrip('/') + path
        emails, socials = scrape_page_emails(target_url, domain)
        all_emails.extend(emails)
        found_socials.update(socials)
        
        # If we have a very high confidence match, we can stop
        if any(e['confidence'] >= 0.8 for e in emails):
            break
        
        time.sleep(RATE_LIMIT)
    
    if not all_emails:
        return {
            'social_links': list(found_socials),
            'email_status': 'no_email'
        }
    
    # Sort by confidence
    all_emails.sort(key=lambda x: x['confidence'], reverse=True)
    
    # Unique emails
    seen = set()
    unique_emails = []
    for e in all_emails:
        if e['email'] not in seen:
            unique_emails.append(e)
            seen.add(e['email'])
    
    primary = unique_emails[0]
    secondary = [e['email'] for e in unique_emails[1:4]]
    
    return {
        'email_primary': primary['email'],
        'email_secondary': secondary,
        'email_confidence': primary['confidence'],
        'email_status': 'valid' if primary['confidence'] >= 0.7 else 'pending',
        'social_links': list(found_socials)
    }

def run_batch(limit=20):
    """Run scraping on providers missing primary emails"""
    # Fetch providers who are live. We'll filter for those without playbook emails locally.
    res = supabase.table('providers')\
        .select('id, name, website, city, outreach_status, enriched_attrs')\
        .neq('outreach_status', 'unsubscribed')\
        .limit(200)\
        .execute()
    
    providers = res.data
    # Filter for those who don't have the new playbook email in enriched_attrs
    to_scrape = []
    for p in providers:
        if not p.get('enriched_attrs', {}).get('email_playbook', {}).get('primary'):
            to_scrape.append(p)
    
    to_scrape = to_scrape[:limit]
    print(f"Scraping emails for {len(to_scrape)} providers...")
    
    success = 0
    
    for p in to_scrape:
        print(f"\nProcessing: {p['name']} ({p['city']}) - {p['website']}")
        
        result = scrape_provider_email(p)
        
        if result:
            update_data = {
                'email_scrape_date': 'now()',
                'email_status': result.get('email_status', 'no_email')
            }
            
            # Pack everything into enriched_attrs to avoid missing column errors
            current_attrs = p.get('enriched_attrs') or {}
            current_attrs.update({
                'email_playbook': {
                    'primary': result.get('email_primary'),
                    'secondary': result.get('email_secondary'),
                    'confidence': result.get('email_confidence'),
                    'scrape_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'social_links': result.get('social_links', [])
                }
            })
            update_data['enriched_attrs'] = current_attrs

            # Also try to update direct columns if they might exist
            try:
                if result.get('email_primary'):
                    update_data.update({
                        'email_primary': result['email_primary'],
                        'email_secondary': result['email_secondary'],
                        'email_confidence': result['email_confidence']
                    })
                    success += 1
                    print(f"  ✓ Found: {result['email_primary']} (confidence: {result['email_confidence']})")
                else:
                    print(f"  ✗ No email found")
                
                supabase.table('providers').update(update_data).eq('id', p['id']).execute()
            except Exception as e:
                # If direct columns fail, just update enriched_attrs
                print(f"  (!) Notice: Could not update direct columns, saving to enriched_attrs only.")
                fallback_data = {
                    'enriched_attrs': current_attrs,
                    'outreach_status': 'pending' if result.get('email_primary') else 'no_email'
                }
                supabase.table('providers').update(fallback_data).eq('id', p['id']).execute()
                if result.get('email_primary'): success += 1
            
    print(f"\nBatch complete. Successfully found {success} emails.")

if __name__ == '__main__':
    import sys
    limit = 20
    if len(sys.argv) > 1:
        limit = int(sys.argv[1])
    run_batch(limit=limit)
