# Technical Findings & Architecture Notes

## Routing Insights
### Dynamic Route Conflicts
Found that having parallel dynamic folders like `[slug]` and `[state]` under `/botox/` caused non-deterministic matching in Next.js, leading to 404s for hierarchical URLs.
**Solution**: Replaced with a unified catch-all folder `[...slug]` which parses the route manually.

## Data Schema
### Pricing Logic
Pricing is now strictly displayed only for `verified` and `featured` listing tiers.
- Free tier = "Not Listed"
- Verified/Featured = Real unit price.

## Environment Management
The daily sync script requires specific production keys.
- **Path**: `scripts/daily_notion_sync.js`
- **Config**: Loads from `.env.prod`.
- **Primary Dependency**: `RESEND_API_KEY` for daily briefing emails.
