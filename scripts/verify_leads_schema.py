
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def check_leads_schema():
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'params=single-object'
    }
    
    # We can't directly query information_schema via PostgREST unless there's an RPC or it's exposed.
    # We'll just try to insert a dummy lead with all columns. If it fails, we'll see which columns are missing.
    
    dummy_lead = {
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "city": "Scottsdale",
        "state": "AZ",
        "treatment_type": "botox",
        "budget_range": "300-500",
        "timeframe": "asap",
        "message": "Test message"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/leads"
    response = requests.post(url, headers=headers, json=dummy_lead)
    
    if response.status_code == 201:
        print("Success! All columns exist in leads table.")
        # Delete the dummy lead
        requests.delete(f"{url}?email=eq.test@example.com", headers=headers)
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    check_leads_schema()
