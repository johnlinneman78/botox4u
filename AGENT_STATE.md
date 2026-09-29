# AGENT STATE — VerifiedAesthetics (served at injectorindex.com)
**Read this file first. Update it at the end of every session.**
Last rewritten: 2026-09-28, after a security and data-integrity review. Earlier
versions of this file had the wrong live URL and deploy method.

---

## PROJECT IDENTITY
- **Brand name**: VerifiedAesthetics
- **Live site**: https://injectorindex.com (apex is canonical; `metadataBase` and `NICHE.baseUrl` use it)
- **verifiedaesthetics.com**: a GoDaddy "Launching Soon" placeholder. Do NOT link to it. The domain move is a separate future project.
- **Vercel project**: `injectorindex` (the only one)
- **GitHub**: `johnlinneman78/botox4u`, branch `main`
- **Deploys are manual**: `npx vercel --prod`. Pushing to GitHub does not deploy.
- **Score branding**: Clarity Score™

## HARD RULES (these exist because each one was broken before)
1. **Never put a key, token or password in a tracked file**, including docs and one-off scripts. Read them from `.env.local` / Vercel env vars. A Supabase service_role key, a Resend key and a Notion token were committed to this public repo and had to be rotated.
2. **Never insert a provider that wasn't found in a real source.** Every new provider row needs a `google_place_id` or a confirmed NPI match. Never generate names, addresses, ratings, review counts, prices, photos or coordinates. Scripts that did this were deleted on 2026-09-28 and `supabase/cleanup/2026-09-28_quarantine_unverified_providers.sql` moves the rows they created out of `providers`.
3. **Never claim verification that hasn't happened.** "Verified", "NPI-verified" and license claims appear only for rows where the check was actually done. No hardcoded "500+ verified" style stats.
4. **Payment never changes ranking or score.** Paid tiers are visual only. Don't sort by `listing_tier`.
5. **Don't swallow errors into empty results.** Log them and fail visibly (see the provider sitemap, which returned an empty list for months because it selected a column that doesn't exist).
6. Build (`npx tsc --noEmit` and `npx next build`) before committing.

## CURRENT STATUS (2026-09-28)
- Branch `security-and-trust-fixes` holds the fixes described in `docs/FIXES_2026-09-28.md`. Manual steps there (key rotation, env vars, SQL quarantine) must be done by John.
- Known open work: `/methodology` describes four signals that don't match `lib/scoring.ts`; one of them has to change. NPI enrichment has confirmed very few providers.

## DESIGN SYSTEM (Implemented & Live)
- **Theme**: Warm linen spa editorial (luxury, NOT clinical/tech)
- **Background**: `#FAF8F5` (Warm Linen)
- **Surface**: `#F2EDE4` (Soft Champagne)
- **Primary text**: `#3D2B1F` (Warm Espresso)
- **Accent**: `#C9A96E` (Champagne Gold)
- **Secondary accent**: `#8A9E8D` (Dusty Sage)
- **Display font**: Cormorant Garamond (300, 400, 500, 600)
- **Body font**: DM Sans (400, 500, 700)
- **Radii**: 8/12/16/20/40px (small to pill)
- **Full spec**: See design system tokens in `app/globals.css`

---


## TECH STACK
- Next.js 16 (App Router), React 18, Tailwind v4
- Supabase (Postgres + auth). Public reads: `lib/supabase/public.ts` (anon key, no cookies)
- Stripe, Resend, Vercel
- Branding config: `config/niche.js`

## DECISIONS MADE
*Permanent record of strategic decisions so agent never re-debates them.*

| Decision | Chosen Option | Reason |
|----------|--------------|--------|
| Review display | Aggregate only + Google Maps link | Google ToS compliant |
| Hero image source | og:image from provider website | Legal, provider-controlled |
| 3-Provider Density | Show "Verifying" block if < 3 verified | Quality bar |
| Score branding | Clarity Score™ (not TrueScore™) | Brand evolution Mar 2026 |
| Design aesthetic | Warm linen spa editorial | Target audience: women 28-45 researching aesthetics |
| Deploy method | Manual `npx vercel --prod` | Confirmed Jul 2026; git push does not deploy |

---

