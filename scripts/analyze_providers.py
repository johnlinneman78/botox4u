
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_top_cities():
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # We want to select city and count them. 
    # Since Supabase REST API doesn't support GROUP BY easily in a single request without a view,
    # we'll fetch all cities and aggregate locally (or fetch chunks).
    # Alternatively, we can use the 'select' with simple aggregation if supported, but fetching is safer for 500 records.
    
    url = f"{SUPABASE_URL}/rest/v1/providers?select=city,state"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.text}")
        return

    data = response.json()
    city_counts = {}
    for p in data:
        key = f"{p['city']}, {p['state']}"
        city_counts[key] = city_counts.get(key, 0) + 1
    
    sorted_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)
    
    print("\nTop Cities by Provider Count:")
    for city, count in sorted_cities[:10]:
        print(f"{city}: {count} providers")

if __name__ == "__main__":
    get_top_cities()
