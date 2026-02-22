# Tech Stack — InjectorIndex.com

## Core
- Framework: Next.js
- Database: Supabase
- Hosting: Vercel
- Email: Resend.com
- IDE: Google Antigravity

## Supabase Schema — providers table
name, slug, city, state, address, phone, website,
rating, review_count, hero_image_url,
top_reviews (JSONB array), google_place_id,
price_per_unit, outreach_status, date_sent,
enriched_at, ai_description, badges (JSONB),
display_status, parent_provider_id, location_count,
is_chain_location, invited_by, invite_code,
invite_used, invite_count

## Supabase Schema — patients table
email, city, treatment_interest, newsletter_opt_in,
best_time_to_call, created_at

## Key File Locations
- Outreach email templates: lib/email/outreach.ts
- Admin dashboard: /admin/dashboard
- Pricing page: /pricing
- Provider claim route: /provider/[slug]/claim
- Resend webhook: /api/webhooks/resend
- Agent context files: repo root (7 .md files)
- Memory bank: /memory-bank/

## Track B Criteria
rating >= 4.7 AND review_count >= 75
AND city IN (top 20 metros)
AND website IS NOT NULL
AND display_status = 'live'

## Provider Display Standard (Rochester Rule)
A provider is displayable when:
rating IS NOT NULL
AND hero_image_url IS NOT NULL
AND hero_image_url NOT LIKE '%googleapis.com%'
AND review_count IS NOT NULL
AND display_status NOT IN ('hidden', 'ghost')

## City Page Goes Live When
3+ providers meet the display standard above
