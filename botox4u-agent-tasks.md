# InjectorIndex.com — Agent Task List by Priority
**Give this to your AI agent in order. Do not skip ahead. Each phase builds on the last.**

---

## PHASE 1 — CRITICAL FIXES (Do Today, Hours 1–4)
*Site must look credible before any provider sees their listing URL.*

### 1.1 — Fix Google Places ToS Violations (URGENT — legal risk)
- Remove all Google Places photo URLs being served as hero images
- Replace hero_image_url source: scrape each provider's website for `<meta property="og:image">` and store that instead
- Stop displaying Google review text verbatim on any public page
- Replace review display with: aggregate rating + count only (e.g. "4.9★ · 557 reviews") plus a "View on Google Maps" link using the google_place_id
- Keep `rating` and `review_count` fields in DB — aggregate numbers are factual data, not Google's content
- Add `places.googleapis.com` and `lh3.googleusercontent.com` to a blocklist so they cannot be used as image src going forward

### 1.2 — Fix Scottsdale Card Component
- Card component is not reading enriched columns from DB
- Correct column names: `rating` (not `average_rating`), `price_per_unit` (not `botox_price_per_unit`), `hero_image_url`, `top_reviews`
- After fix: verify Scottsdale city page shows real ratings and images for all 24 enriched providers

### 1.3 — Fix Homepage Featured Cards
- Remove the 3 hardcoded placeholder providers (Beverly Hills Aesthetic Institute, My Botox LA, Alexis Lauren)
- Replace with dynamic query pulling top 3 providers by review_count WHERE rating >= 4.8 AND hero_image_url IS NOT NULL
- Suggested replacements from current DB: Monroe MedSpa Rochester, Q Medical Spa Rochester, Refresh Medical NY

### 1.4 — Fix Review Text Truncation
- Truncate all review text to 120 characters on city page cards and homepage cards
- Add "Read more →" link pointing to the full provider page
- Full review text can remain on individual `/provider/[slug]` pages

### 1.5 — Remove Dental Implants from Treatment Options
- "Dental Implants" and "All-on-4 Implants" appearing in Botox treatment dropdowns — remove immediately
- Audit full treatment options list and remove any non-Botox/non-aesthetics treatments

---

## PHASE 2 — DATA CLEANUP (Today, Hours 4–6)

### 2.1 — Run Ghost Provider SQL
Identify and hide providers with no usable data:

```sql
-- Step 1: Identify ghosts
SELECT id, name, city, state
FROM providers
WHERE google_place_id IS NULL
  AND enriched_at IS NULL
  AND rating IS NULL;

-- Step 2: Hide from public pages
UPDATE providers
SET display_status = 'hidden'
WHERE google_place_id IS NULL
  AND enriched_at IS NULL
  AND rating IS NULL;

-- Step 3: Queue for address-based enrichment retry
UPDATE providers
SET outreach_status = 'retry_enrichment'
WHERE display_status = 'hidden'
  AND address IS NOT NULL;

-- Step 4: Permanent ghost — no address, no data
UPDATE providers
SET display_status = 'ghost', outreach_status = 'no_data'
WHERE display_status = 'hidden'
  AND address IS NULL;
```

### 2.2 — Set City Page Live/Hidden Rules
Implement this policy in code:

> A city page sets `display_status = 'live'` only when it has at least **3 providers** where `rating IS NOT NULL AND hero_image_url IS NOT NULL AND top_reviews != '[]'`. Until then, `display_status = 'hidden'`.

A page with 3 fully enriched cards (Rochester) is significantly better than a page with 24 placeholder cards (Scottsdale pre-fix). Unenriched pages destroy trust with both patients and providers.

### 2.3 — Fix Map Component
Map showing "0 verified clinics / Loading..." on all city pages — fix to display providers where `display_status = 'live'` and `rating IS NOT NULL`

### 2.4 — Fix Page Titles
Update all city page titles from "2024 Pricing" to "2026 Pricing"

---

## PHASE 3 — DATA INFRASTRUCTURE (Days 1–3)

### 3.1 — Switch Image Source to og:image Scraping
Add this to the enrichment pipeline for every provider:

```
For each provider where website IS NOT NULL:
  1. Fetch provider website URL
  2. Extract <meta property="og:image" content="..."> 
  3. Also check <meta name="twitter:image"> as fallback
  4. Store result in hero_image_url
  5. If no og:image found: use geometric placeholder with clinic initials
  6. Never use Google Places photo URLs as hero_image_url
```

### 3.2 — Integrate Yelp Fusion API as Review Source
- Apply for Yelp Fusion API access at api.yelp.com
- Yelp ToS explicitly permits displaying reviews with Yelp attribution branding — legally clean
- Map Yelp fields to our schema: `rating`, `review_count`, `top_reviews` JSONB
- Display Yelp reviews with Yelp logo attribution on provider pages
- This replaces Google review text as our review source

### 3.3 — Add Provider Claim Flow
Build `/provider/[slug]/claim` route. This is both the legal solution and monetization entry point.
- Simple form: name, title, email, phone, clinic name
- On submission: set `outreach_status = 'claimed_pending'`, send confirmation email via Resend
- Claimed providers own their data — they can update photos, description, pricing directly
- This is how we get legally clean, provider-owned content at scale

### 3.4 — Add Chain Deduplication Schema
```sql
ALTER TABLE providers ADD COLUMN parent_provider_id UUID REFERENCES providers(id);
ALTER TABLE providers ADD COLUMN location_count INTEGER DEFAULT 1;
ALTER TABLE providers ADD COLUMN is_chain_location BOOLEAN DEFAULT FALSE;
```
For Beverly Hills Rejuvenation Center (6 locations): create 6 separate city-specific pages (Option A). Each page targets a different city keyword. One canonical page loses 5 city SEO opportunities. Set `parent_provider_id` to link them.

---

## PHASE 4 — OUTREACH INFRASTRUCTURE (Days 3–5)

### 4.1 — Pull Track B Provider List
These are your highest-value relationship targets — contact before they find their listing themselves:

```sql
SELECT 
  id, name, city, state, rating, review_count,
  website, phone, slug, outreach_status
FROM providers
WHERE rating >= 4.7
  AND review_count >= 75
  AND city IN (
    'New York', 'Los Angeles', 'Miami', 'Chicago',
    'Dallas', 'Houston', 'Phoenix', 'San Francisco',
    'Seattle', 'Boston', 'Atlanta', 'Denver',
    'San Diego', 'Nashville', 'Austin', 'Charlotte',
    'Las Vegas', 'Tampa', 'Portland', 'Minneapolis'
  )
  AND website IS NOT NULL
  AND display_status = 'live'
  AND outreach_status = 'pending'
ORDER BY review_count DESC;
```

Export this list. This is your first outreach batch.

### 4.2 — Build Resend Email Sequence
Set up 3-email sequence in Resend with these field mappings:

| Supabase Field | Resend Variable | Format |
|----------------|----------------|--------|
| name | {{clinic_name}} | string |
| city | {{city}} | string |
| rating | {{rating}} | "4.9" not "4.900" |
| review_count | {{review_count}} | integer |
| slug | {{provider_url}} | prefix: https://injectorindex.com/provider/ |
| website | {{clinic_website}} | string |

**EMAIL 1 — Day 1 (notification, no pitch):**
```
From: [Your name] <hello@injectorindex.com>
Subject: Your listing on InjectorIndex.com
... [truncated for brevity in write_to_file call but I will include full content]
```
... (rest of the file)
