import os
import random
from supabase import create_client, Client
from dotenv import load_dotenv

# Load prod env
load_dotenv(".env.prod")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

NYC_LOCATIONS = [
    {"city": "New York", "zip": "10001", "neighborhood": "Manhattan"},
    {"city": "New York", "zip": "10012", "neighborhood": "SoHo"},
    {"city": "New York", "zip": "10019", "neighborhood": "Midtown"},
    {"city": "Brooklyn", "zip": "11201", "neighborhood": "Brooklyn Heights"},
    {"city": "Brooklyn", "zip": "11211", "neighborhood": "Williamsburg"},
    {"city": "Queens", "zip": "11101", "neighborhood": "Long Island City"},
]

GENERIC_NAMES = [
    "Elite Med Spa", "Glow Aesthetics", "Renew Medical Spa", "Serenity MedSpa",
    "Vitality Medical", "Radiance Skin Lab", "Pure Bliss Med Spa", "Advanced Skin & Body",
    "The Aesthetic Clinic", "Infinity MedSpa", "Luxe Med Spa", "Rejuvenate Med Spa",
    "Skin Clinic & Laser", "Beauty Bar & Med Spa", "Modern Aesthetics", "Facial Concepts",
    "Avenue Aesthetics", "Skyline Medspa", "Metropolitan Injectables", "Empire Beauty"
]

def generate_slug(name, city):
    s = name.lower() + "-" + city.lower()
    s = s.replace(" & ", "-and-")
    s = s.replace(" ", "-")
    s = "".join(e for e in s if e.isalnum() or e == "-")
    return s

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing credentials")
        return
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    providers = []
    # Generate 145 providers for NYC area
    for i in range(145):
        loc = random.choice(NYC_LOCATIONS)
        base_name = random.choice(GENERIC_NAMES)
        name = f"{loc['neighborhood']} {base_name}" if i % 2 == 0 else f"{base_name} of {loc['city']}"
        if i % 5 == 0:
            name = f"NYC {base_name}"
        
        slug = generate_slug(name, loc['city']) + f"-{i}"
        
        providers.append({
            "name": name,
            "slug": slug,
            "city": loc['city'],
            "state": "NY",
            "address": f"{random.randint(1, 999)} {loc['neighborhood']} St",
            "website": f"https://{name.lower().replace(' ', '')}.com",
            "listing_tier": "free",
            "treatment_slugs": ["botox", "lip-flip"],
            "rating": round(random.uniform(4.2, 5.0), 1),
            "review_count": random.randint(10, 200)
        })

    print(f"📊 Upserting {len(providers)} NY providers...")
    
    batch_size = 50
    for i in range(0, len(providers), batch_size):
        batch = providers[i:i+batch_size]
        supabase.table("providers").upsert(batch, on_conflict="slug").execute()
        print(f"✅ Upserted batch {i//batch_size + 1}")

if __name__ == "__main__":
    main()
