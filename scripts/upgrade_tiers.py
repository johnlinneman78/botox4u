import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Upgrade some to Premium
    premiums = [
        "Adam & Eve Medical Aesthetics",
        "Look Lab Med Spa",
        "YAKER Hair Restoration + Med Spa",
        "Glowlight Med Spa",
        "Mitchell Plastic Surgery"
    ]
    
    # Upgrade some to Featured
    featureds = [
        "Blume Skin & Body",
        "Plano Plastic Spa",
        "Touch of Beauty Medispa",
        "SoCal Aesthetic Surgery"
    ]
    
    for name in premiums:
        supabase.table("providers").update({"listing_tier": "premium"}).eq("name", name).execute()
        print(f"⭐ {name} upgraded to Premium")
        
    for name in featureds:
        supabase.table("providers").update({"listing_tier": "featured"}).eq("name", name).execute()
        print(f"🌟 {name} upgraded to Featured")

if __name__ == "__main__":
    main()
