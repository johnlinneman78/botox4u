import os
import random
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

CITIES = [
    {"city": "New York", "state": "NY", "count": 142},
    {"city": "Los Angeles", "state": "CA", "count": 128},
    {"city": "Miami", "state": "FL", "count": 112},
    {"city": "Chicago", "state": "IL", "count": 96},
    {"city": "Dallas", "state": "TX", "count": 92},
    {"city": "Houston", "state": "TX", "count": 88},
    {"city": "Scottsdale", "state": "AZ", "count": 84},
    {"city": "San Francisco", "state": "CA", "count": 76},
    {"city": "Portland", "state": "OR", "count": 45},
    {"city": "Atlanta", "state": "GA", "count": 72},
    {"city": "Denver", "state": "CO", "count": 68},
    {"city": "Phoenix", "state": "AZ", "count": 64},
    {"city": "San Diego", "state": "CA", "count": 62},
    {"city": "Nashville", "state": "TN", "count": 58},
    {"city": "Austin", "state": "TX", "count": 56},
    {"city": "Las Vegas", "state": "NV", "count": 54},
    {"city": "Charlotte", "state": "NC", "count": 52},
    {"city": "Seattle", "state": "WA", "count": 48},
    {"city": "Boston", "state": "MA", "count": 46},
    {"city": "Tampa", "state": "FL", "count": 44},
]

MODIFIERS = [
    "Aesthetics", "MedSpa", "Clinic", "Skin Lab", "Dermatology", "Beauty Bar", 
    "Plastic Surgery", "Rejuvenation", "Wellness Center", "Injectables",
    "Solutions", "Studios", "Specialists", "Medical Spa"
]

STREETS = ["Main St", "Broadway", "5th Ave", "Market St", "Ocean Dr", "Sunset Blvd", "Magnolia Ave", "Park Ave"]

def generate_provider(city, state, index):
    name_base = f"{city} {random.choice(MODIFIERS)} {index + 1}"
    slug = f"{name_base.lower().replace(' ', '-').replace('&', 'and')}"
    # Remove dots or other chars
    slug = "".join(e for e in slug if e.isalnum() or e == "-")
    
    # Score logic to make it look real
    score_total = random.randint(65, 98)
    rating = round(random.uniform(4.2, 5.0), 1)
    review_count = random.randint(12, 500)
    price = random.randint(12, 18)
    
    return {
        "name": name_base,
        "slug": slug,
        "city": city,
        "state": state,
        "business_type": "Medspa",
        "listing_tier": "free",
        "rating": rating,
        "review_count": review_count,
        "score": score_total,
        "price_per_unit": price,
        "address": f"{random.randint(100, 9999)} {random.choice(STREETS)}",
        "npi_verified": random.random() > 0.3,
        "treatment_slugs": ["botox"]
    }

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing credentials")
        return
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    all_providers = []
    for city_info in CITIES:
        print(f"Generating {city_info['count']} providers for {city_info['city']}...")
        for i in range(city_info['count']):
            all_providers.append(generate_provider(city_info['city'], city_info['state'], i))
    
    print(f"Total Providers to Upsert: {len(all_providers)}")
    
    batch_size = 100
    for i in range(0, len(all_providers), batch_size):
        batch = all_providers[i:i+batch_size]
        try:
            supabase.table("providers").upsert(batch, on_conflict="slug").execute()
            print(f"Upserted batch {i//batch_size + 1}")
        except Exception as e:
            print(f"Error in batch {i//batch_size + 1}: {e}")

if __name__ == "__main__":
    main()
