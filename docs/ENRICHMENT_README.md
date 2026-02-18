# Provider Data Enrichment Pipeline

This pipeline enriches provider profiles with real-world data from Google Places API and website scraping.

## Prerequisites

1. **Environment Variables**:
   Ensure `.env.local` has the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...    # Required for admin updates
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... # Must have Places API & Geocoding API enabled
   OPENAI_API_KEY=...               # Required for AI descriptions
   ```

2. **Database Schema**:
   Run the SQL in `supabase/enrichment_schema.sql` to add necessary columns.

## Running the Enrichment Script

The script `scripts/enrichProvider.ts` fetches data for providers that haven't been updated recently.

### Dry Run (Test Mode)
Logs the data that *would* be written to the database without making changes.
```bash
npx ts-node scripts/enrichProvider.ts --dry-run
```

### Production Run
Updates the database with enriched data.
```bash
npx ts-node scripts/enrichProvider.ts
```

## Logic Overview

1. **Google Places**:
   - Searches for provider by name + city.
   - Fetches Rating, Review Count, Photos.
   - select top 3 reviews (4+ stars, sorted by rating then recency).
   
2. **Images**:
   - Uses Google Place photos (hero + gallery).
   - Fallback 1: Scraped OG Image from website.
   - Fallback 2: Geometric placeholder (`/images/placeholders/clinic-geo-navy.jpg`).

3. **Description**:
   - Scrapes `meta description` and first `<p>` tag from website.
   - Uses GPT-4o to generate a verified 2-sentence summary (max 160 chars).

4. **Credentials**:
   - Scans text for keywords like "Board Certified", "Allergan Diamond", etc.

## Components

- `EnhancedProviderCard.tsx`: Displays the enriched profile.
- `ReviewCarousel.tsx`: Displays the reviews in a responsive carousel.
