import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

providers = [
    # Scottsdale, AZ
    {
        "name": "Sachi Aesthetics",
        "slug": "sachi-aesthetics-scottsdale",
        "city": "Scottsdale",
        "state": "AZ",
        "address": "Scottsdale, AZ",
        "website": "https://sachiaesthetics.com",
        "business_type": "Medspa",
        "listing_tier": "premium",
        "treatment_slugs": ["botox", "masseter-botox", "filler"]
    },
    {
        "name": "Modern Medical",
        "slug": "moderne-medical-scottsdale",
        "city": "Scottsdale",
        "state": "AZ",
        "address": "Scottsdale, AZ",
        "website": "https://modernemedical.com",
        "business_type": "Medspa",
        "listing_tier": "free",
        "treatment_slugs": ["botox", "dysport"]
    },
    # Plano, TX
    {
        "name": "SkinSpirit Plano",
        "slug": "skinspirit-plano",
        "city": "Plano",
        "state": "TX",
        "address": "Plano, TX",
        "website": "https://www.skinspirit.com",
        "business_type": "Medspa",
        "listing_tier": "premium",
        "treatment_slugs": ["botox", "masseter-botox", "lip-flip"]
    },
    {
        "name": "Injectco",
        "slug": "injectco-plano",
        "city": "Plano",
        "state": "TX",
        "address": "Plano, TX",
        "website": "https://injectco.com",
        "business_type": "Medspa",
        "listing_tier": "free",
        "treatment_slugs": ["botox", "migraine-botox"]
    },
    # Bellevue, WA
    {
        "name": "Naficy Rejuvenation Center",
        "slug": "naficy-bellevue",
        "city": "Bellevue",
        "state": "WA",
        "address": "Bellevue, WA",
        "website": "https://www.seattleface.com",
        "business_type": "Plastic Surgery",
        "listing_tier": "premium",
        "treatment_slugs": ["botox", "masseter-botox", "filler"]
    },
    {
        "name": "The Clinic Medspa",
        "slug": "the-clinic-medspa-bellevue",
        "city": "Bellevue",
        "state": "WA",
        "address": "Bellevue, WA",
        "website": "https://theclinicmedspa.com",
        "business_type": "Medspa",
        "listing_tier": "free",
        "treatment_slugs": ["botox", "kybella"]
    },
    # Boca Raton, FL
    {
        "name": "Boca Botox",
        "slug": "boca-botox-ennis",
        "city": "Boca Raton",
        "state": "FL",
        "address": "Boca Raton, FL",
        "website": "https://bocabotox.com",
        "business_type": "Medspa",
        "listing_tier": "premium",
        "treatment_slugs": ["botox", "masseter-botox"]
    },
    {
        "name": "ZenTox Aesthetics",
        "slug": "zentox-aesthetics-boca",
        "city": "Boca Raton",
        "state": "FL",
        "address": "Boca Raton, FL",
        "website": "https://zentoxaesthetics.com",
        "business_type": "Medspa",
        "listing_tier": "free",
        "treatment_slugs": ["botox", "filler"]
    },
    # Portland, OR
    {
        "name": "Skin by Lovely",
        "slug": "skin-by-lovely-portland",
        "city": "Portland",
        "state": "OR",
        "address": "Portland, OR",
        "website": "https://skinbylovely.com",
        "business_type": "Medspa",
        "listing_tier": "premium",
        "treatment_slugs": ["botox", "masseter-botox", "dysport"]
    },
    {
        "name": "Aura Aesthetics",
        "slug": "aura-aesthetics-portland",
        "city": "Portland",
        "state": "OR",
        "address": "Portland, OR",
        "website": "https://aurapdx.com",
        "business_type": "Medspa",
        "listing_tier": "free",
        "treatment_slugs": ["botox", "filler"]
    }
]

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials.")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    for p in providers:
        try:
            res = supabase.table("providers").upsert(p, on_conflict="slug").execute()
            print(f"✅ Added/Updated: {p['name']} ({p['city']})")
        except Exception as e:
            print(f"❌ Error adding {p['name']}: {e}")

if __name__ == "__main__":
    main()
