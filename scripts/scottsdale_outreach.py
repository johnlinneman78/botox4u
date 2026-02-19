
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_scottsdale_list():
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/providers?city=eq.Scottsdale&state=eq.AZ&select=name,listing_tier,price_per_unit,enriched_attrs,slug&order=listing_tier.desc"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.text}")
        return

    data = response.json()
    print("\n🚀 Scottsdale Outreach List (Top Producers):")
    for p in data[:10]:
        tier = p.get('listing_tier', 'free')
        price = p.get('price_per_unit', 'N/A')
        attrs = p.get('enriched_attrs', {})
        special = attrs.get('new_patient_special', 'None')
        status = attrs.get('top_account_status', 'Regular')
        
        print(f"- {p['name']} | Tier: {tier} | Price: ${price} | Status: {status} | Special: {special}")
        print(f"  URL: https://botox-4u.com/provider/{p['slug']}")

if __name__ == "__main__":
    get_scottsdale_list()
