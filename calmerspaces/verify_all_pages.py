import urllib.request
import re

urls = {
    "https://calmerplaces.com/": "Sensory-Friendly Places in Portland | CalmerPlaces",
    "https://calmerplaces.com/about/": "About CalmerPlaces — Why We Built It",
    "https://calmerplaces.com/how-verification-works/": "How We Verify Listings | CalmerPlaces",
    "https://calmerplaces.com/for-venue-owners/": "List Your Sensory-Friendly Venue | CalmerPlaces",
    "https://calmerplaces.com/faq/": "FAQ | CalmerPlaces",
    "https://calmerplaces.com/contact/": "Contact Us | CalmerPlaces",
    "https://calmerplaces.com/accessibility/": "Accessibility Statement | CalmerPlaces",
    "https://calmerplaces.com/privacy-policy/": "Privacy Policy | CalmerPlaces",
    "https://calmerplaces.com/terms-and-conditions/": "Terms and Conditions | CalmerPlaces"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

print("==> Running verification of all pages...")
for url, expected_title in urls.items():
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            code = response.getcode()
            html = response.read().decode('utf-8', errors='ignore')
            
        title_match = re.search(r'<title>(.*?)</title>', html, re.DOTALL | re.IGNORECASE)
        actual_title = title_match.group(1).strip() if title_match else "NO TITLE FOUND"
        
        # Clean title spaces/escapes
        actual_title = re.sub(r'\s+', ' ', actual_title)
        
        status = "PASS" if code == 200 and expected_title.lower() in actual_title.lower() else "FAIL"
        
        print(f"[{status}] {url} -> HTTP {code}")
        print(f"   Expected title partial: '{expected_title}'")
        print(f"   Actual title:           '{actual_title}'")
        
    except Exception as e:
        print(f"[FAIL] {url} -> Error: {e}")
print("Verification complete!")
