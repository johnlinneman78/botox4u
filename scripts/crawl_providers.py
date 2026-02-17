import asyncio
import os
import json
import re
from typing import List, Optional
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

# Supabase Setup
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role for writes

# Define the data structure for enrichment
class ProviderEnrichment(BaseModel):
    # Pricing Transparency
    price_per_unit_botox: Optional[float] = Field(None, description="Price per unit of Botox if stated.")
    price_per_unit_dysport: Optional[float] = Field(None, description="Price per unit of Dysport if stated.")
    membership_program: bool = Field(default=False, description="Does the site mention a membership or loyalty program?")
    new_patient_special: Optional[str] = Field(None, description="Details of first-time patient deals.")
    
    # Lead Gen Essentials
    phone_number: Optional[str] = Field(None, description="Primary contact phone number.")
    contact_url: Optional[str] = Field(None, description="Link to their booking or contact page.")
    online_booking_available: bool = Field(default=False, description="Can you book directly online?")
    
    # Choice Factors & Specialties
    injector_credentials: List[str] = Field(default_factory=list, description="MD, RN, PA, NP, etc.")
    offers_masseter_botox: bool = Field(default=False, description="Jaw slimming/TMJ focus.")
    offers_gummy_smile: bool = Field(default=False, description="Gummy smile specialists.")
    offers_lip_flip: bool = Field(default=False, description="Lip flip specialist mentions.")
    offers_hyperhidrosis: bool = Field(default=False, description="Underarm/sweat treatment.")
    
    # Authority Markers
    top_account_status: Optional[str] = Field(None, description="Allergan Black Diamond, Galderma Top 100, etc.")
    years_in_business: Optional[int] = Field(None, description="Operation length.")
    
    # Media
    image_url: Optional[str] = Field(None, description="Main hero image or representative photo.")
    logo_url: Optional[str] = Field(None, description="Clinic logo URL.")

async def enrich_provider_data(url: str, provider_id: Optional[str] = None):
    """
    Crawls a website and extracts specialized 'Price Transparency' data.
    """
    print(f"🚀 Enriching Data for: {url}")
    
    browser_config = BrowserConfig(headless=True, verbose=True)
    
    # We use LLM extraction if an API key is provided, otherwise we'll do regex/keyword fallback
    # For this demo, let's assume we want structured extraction.
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        # Note: In a production environment, you'd add LLMExtractionStrategy here
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=run_config)
        
        if result.success:
            content = result.markdown
            print(f"✅ Crawled {len(content)} characters.")
            
            # Enhanced Simulated Extraction
            enrichment = ProviderEnrichment(
                price_per_unit_botox=extract_price(content, "botox"),
                price_per_unit_dysport=extract_price(content, "dysport"),
                membership_program="membership" in content.lower() or "loyalty" in content.lower(),
                new_patient_special=extract_special(content),
                phone_number=extract_phone(content),
                contact_url=extract_contact_link(content, url),
                online_booking_available="book online" in content.lower() or "book now" in content.lower(),
                injector_credentials=list(set(re.findall(r"\b(MD|RN|PA|NP|LPN|DO)\b", content))),
                offers_masseter_botox="masseter" in content.lower() or "jaw slimming" in content.lower() or "tmj" in content.lower(),
                offers_gummy_smile="gummy smile" in content.lower(),
                offers_lip_flip="lip flip" in content.lower(),
                offers_hyperhidrosis="hyperhidrosis" in content.lower() or "sweat" in content.lower(),
                top_account_status=extract_status(content),
                image_url=extract_image(result.html, url)
            )
            
            print(f"✨ Extracted Data: {enrichment.model_dump_json(indent=2)}")
            
            # If we have a provider_id, update Supabase
            if provider_id and SUPABASE_URL and SUPABASE_KEY:
                try:
                    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
                    update_data = {
                        "verified": True,
                        "updated_at": "now()"
                    }
                    
                    # Try to include enriched_attrs, but handle if it doesn't exist
                    try:
                        update_data["enriched_attrs"] = enrichment.model_dump()
                    except:
                        pass

                    # Update top-level fields for better filtering
                    if enrichment.price_per_unit_botox:
                        update_data["price_per_unit"] = enrichment.price_per_unit_botox
                    if enrichment.phone_number:
                        update_data["phone"] = enrichment.phone_number
                    if enrichment.image_url:
                        update_data["image_url"] = enrichment.image_url
                        
                    try:
                        response = supabase.table("providers").update(update_data).eq("id", provider_id).execute()
                    except Exception as e:
                        if "enriched_attrs" in str(e):
                            print(f"⚠️ Column 'enriched_attrs' missing, retrying without it...")
                            del update_data["enriched_attrs"]
                            response = supabase.table("providers").update(update_data).eq("id", provider_id).execute()
                        else:
                            raise e
                    print(f"🗄️ Supabase Update Successful: {response.data}")
                except Exception as e:
                    print(f"❌ Supabase Error: {e}")
            
            return enrichment
        else:
            print(f"❌ Error: {result.error_message}")
            return None

def extract_price(text: str, toxin: str = "botox") -> Optional[float]:
    # Regex to find "$X / unit" or "$X per unit" near toxin name
    pattern = rf"{toxin}.*?\$(\d{{1,2}})(?:\.?\d{{2}})?\s*(?:/|per)\s*unit"
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    if not match:
        # Generic fallback
        match = re.search(r"\$(\d{1,2})(?:\.?\d{2})?\s*(?:/|per)\s*unit", text, re.IGNORECASE)
    
    if match:
        return float(match.group(1))
    return None

def extract_special(text: str) -> Optional[str]:
    deals = re.findall(r"(?:special|deal|offer|discount|promo):?\s*([^.\n]+)", text, re.IGNORECASE)
    return deals[0].strip() if deals else None

def extract_phone(text: str) -> Optional[str]:
    match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    return match.group(0) if match else None

def extract_contact_link(text: str, base_url: str) -> Optional[str]:
    # Find common contact paths
    matches = re.findall(r"/(?:contact|book|appointment|schedule)[^\"\']*", text, re.IGNORECASE)
    if matches:
        return base_url.rstrip("/") + matches[0]
    return None

def extract_status(text: str) -> Optional[str]:
    if "black diamond" in text.lower(): return "Top 1% (Black Diamond)"
    if "top 100" in text.lower(): return "Top 100 Nationally"
    if "diamond" in text.lower(): return "Diamond Status"
    return None

def extract_image(html: str, base_url: str) -> Optional[str]:
    # Look for og:image first
    match = re.search(r'<meta[^>]*property="og:image"[^>]*content="([^"]+)"', html)
    if not match:
        match = re.search(r'<meta[^>]*content="([^"]+)"[^>]*property="og:image"', html)
    
    if match:
        img_url = match.group(1)
        if img_url.startswith("/"):
            return base_url.rstrip("/") + img_url
        return img_url
    
    # Fallback: Find first large-ish image in a hero section or main
    img_matches = re.findall(r'<img[^>]*src="([^"]+)"', html)
    for img in img_matches:
        if "logo" not in img.lower() and ("hero" in img.lower() or "banner" in img.lower() or "office" in img.lower()):
            if img.startswith("/"):
                return base_url.rstrip("/") + img
            return img
            
    return None

async def enrich_all_providers():
    """
    Fetches all providers from Supabase and enriches those with websites.
    """
    print("🔍 Fetching providers from Supabase...")
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials.")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Get providers that have a website and haven't been verified/processed yet
    response = supabase.table("providers")\
        .select("id, website, name")\
        .not_.is_("website", "null")\
        .eq("verified", False)\
        .limit(50)\
        .execute()
    providers = response.data
    
    if not providers:
        print("✅ No new providers to enrich.")
        return

    print(f"📈 Found {len(providers)} providers to process.")
    
    # Process in small batches to avoid rate limits or memory issues
    batch_size = 3
    for i in range(0, len(providers), batch_size):
        batch = providers[i:i+batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1}...")
        
        tasks = []
        for p in batch:
            url = p.get("website")
            if url and url.startswith("http"):
                tasks.append(enrich_provider_data(url, p["id"]))
            else:
                print(f"⚠️ Skipping invalid URL for {p['name']}: {url}")
        
        if tasks:
            await asyncio.gather(*tasks)
            # Short sleep between batches
            await asyncio.sleep(2)

async def main():
    import sys
    # If a URL is passed, enrich that specific one
    if len(sys.argv) > 1:
        url = sys.argv[1]
        await enrich_provider_data(url)
    else:
        # Otherwise, run the full batch enrichment
        await enrich_all_providers()

if __name__ == "__main__":
    # Ensure HOME is set for playwright on Windows
    if 'HOME' not in os.environ:
        os.environ['HOME'] = os.environ.get('USERPROFILE', '')
    asyncio.run(main())
