
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def check_leads():
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/leads?select=id,full_name,email,city,treatment_type,created_at&order=created_at.desc&limit=5"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.text}")
        return

    data = response.json()
    print("\nLatest Leads:")
    for l in data:
        print(f"- {l['full_name']} ({l['email']}) | {l['city']} | {l['treatment_type']} | {l['created_at']}")

if __name__ == "__main__":
    check_leads()
