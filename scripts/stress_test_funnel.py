
import os
import requests
import uuid
from dotenv import load_dotenv
from datetime import datetime

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def submit_test_lead(name, email, city, state, treatment, budget, timeframe, provider_slug=None):
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    provider_id = None
    if provider_slug:
        # Get provider ID
        r = requests.get(f"{SUPABASE_URL}/rest/v1/providers?slug=eq.{provider_slug}&select=id", headers=headers)
        if r.status_code == 200 and r.json():
            provider_id = r.json()[0]['id']

    lead_data = {
        "full_name": name,
        "email": email,
        "phone": "5550109999",
        "city": city,
        "state": state,
        "treatment_type": treatment,
        "budget_range": budget,
        "timeframe": timeframe,
        "message": f"Stress test lead for {treatment} in {city}.",
        "provider_id": provider_id,
        "status": "new"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/leads"
    response = requests.post(url, headers=headers, json=lead_data)
    
    if response.status_code == 201:
        print(f"✅ Success: Lead for '{name}' created in {city}.")
    else:
        print(f"❌ Failed: {response.text}")

if __name__ == "__main__":
    print("🚀 Starting Funnel Stress Test...")
    
    # 1. Scottsdale City-Wide Lead
    submit_test_lead("Test Scottsdale City", "scottsdale-gen@example.com", "Scottsdale", "AZ", "forehead-botox", "300-500", "asap")
    
    # 2. Dallas Targeted Lead
    submit_test_lead("Test Dallas Targeted", "dallas-pro@example.com", "Dallas", "TX", "masseter-botox", "500-1000", "this-week", "modern-medical")
    
    # 3. Specialty Quote (Lip Flip)
    submit_test_lead("Test Lip Flip Specialty", "lip-flip@example.com", "Scottsdale", "AZ", "lip-flip", "under-300", "this-month")

    print("\n🏁 Funnel Stress Test Complete.")
