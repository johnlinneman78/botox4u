
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_leads_columns():
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Try a simple select. If it's truly empty, we can't see columns via keys.
    # But we can try to insert a minimal row and then select.
    
    dummy_lead = {
        "full_name": "Check Columns",
        "email": "check@example.com",
    }
    
    url = f"{SUPABASE_URL}/rest/v1/leads"
    requests.post(url, headers=headers, json=dummy_lead)
    
    response = requests.get(f"{url}?limit=1", headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data:
            print(f"Columns in leads: {list(data[0].keys())}")
            # cleanup
            requests.delete(f"{url}?email=eq.check@example.com", headers=headers)
        else:
            print("Leads table is still empty.")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    get_leads_columns()
