
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_city_details(city_name):
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/providers?city=eq.{city_name}&select=name,slug,city,state,treatment_slugs"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.text}")
        return

    data = response.json()
    print(f"\nDetails for {city_name}:")
    for p in data:
        print(f"- {p['name']} ({p['slug']}) | Treatments: {p['treatment_slugs']}")

if __name__ == "__main__":
    get_city_details("Scottsdale")
    get_city_details("Dallas")
    get_city_details("Tampa")
