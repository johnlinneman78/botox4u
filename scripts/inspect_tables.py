
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_table_info(table_name):
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # We can query the information_schema via a RPC or just try to select and see what fails, 
    # but a better way is to use the PostgREST inspection if available or just a dummy select.
    # However, we can use the 'select=*' and check the keys of the first row (if any).
    
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=1"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            print(f"\nColumns in {table_name}:")
            print(list(data[0].keys()))
        else:
            print(f"\nNo data in {table_name} to inspect columns.")
    else:
        print(f"Error fetching {table_name}: {response.text}")

if __name__ == "__main__":
    get_table_info("providers")
    get_table_info("leads")
