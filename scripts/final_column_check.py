
import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_columns(table):
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    # Fetch 1 row to get keys
    url = f"{SUPABASE_URL}/rest/v1/{table}?limit=1"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data:
            return list(data[0].keys())
    return []

if __name__ == "__main__":
    print(f"Providers: {get_columns('providers')}")
    # Insert dummy into leads to get columns
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    requests.post(f"{SUPABASE_URL}/rest/v1/leads", headers=headers, json={"full_name": "Check", "email": "c@c.com"})
    print(f"Leads: {get_columns('leads')}")
    requests.delete(f"{SUPABASE_URL}/rest/v1/leads?email=eq.c@c.com", headers=headers)
