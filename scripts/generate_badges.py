
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing credentials")
        return
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Fetch top 10 providers in each of the top 20 cities
    cities = [
        "New York", "Los Angeles", "Miami", "Chicago", "Dallas", "Houston", 
        "Scottsdale", "San Francisco", "Portland", "Atlanta", "Denver", 
        "Phoenix", "San Diego", "Nashville", "Austin", "Las Vegas", 
        "Charlotte", "Seattle", "Boston", "Tampa"
    ]
    
    badges_issued = []
    
    for city in cities:
        print(f"Awarding badges for {city}...")
        res = supabase.table("providers").select("*").eq("city", city).order("score", desc=True).limit(10).execute()
        
        for i, provider in enumerate(res.data):
            badge = {
                "provider_id": provider["id"],
                "provider_name": provider["name"],
                "award": f"Top {i+1} in {city}",
                "year": 2024,
                "badge_url": f"https://www.botox-4u.com/badges/2024-{provider['slug']}.png",
                "embed_code": f'<a href="https://www.botox-4u.com/provider/{provider["slug"]}"><img src="https://www.botox-4u.com/api/badge/{provider["id"]}" alt="Top Rated in {city}" /></a>'
            }
            badges_issued.append(badge)
            
    # Save to a report
    with open("reports/badges_issued_2024.json", "w") as f:
        json.dump(badges_issued, f, indent=4)
        
    print(f"Generated {len(badges_issued)} badge awards. Report saved to reports/badges_issued_2024.json")

if __name__ == "__main__":
    if not os.path.exists("reports"):
        os.makedirs("reports")
    main()
