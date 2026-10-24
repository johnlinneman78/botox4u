# InjectorIndex storefront fixes — build report

Branch: `storefront-fixes-2026-10-23` (from main @ 74f79b9)
Status: code complete, builds clean, **NOT deployed, NOT merged to main.**
Source list: `~/workspace/your_files/injectorindex-storefront-fix-list-2026-10-23.md`

## Build / verification method

- `npx tsc --noEmit`: clean.
- `npm run build`: passes (exit 0). Route table confirms all changed routes build, including `ƒ /claim/[slug]/verify`.
- Ran the production build locally (`next start`) and verified in a real Chromium at 390px phone width (screenshots below), including scripted browser checks: homepage search carry-over click-through, exit-intent positive/negative cases.
- Local data caveat: the local build runs with placeholder Supabase keys (no real credentials were used), so provider counts render as 0 and result grids are empty. Layout, copy, URLs, and behavior are fully rendered; counts will populate with production data.

## Item 1 — Duplicate search form on /find-providers: REMOVED + carry-over fixed

Files changed:
- `app/find-providers/page.tsx` — removed the `ProviderFilters` form and the `GeolocationSorter` from the results page; removed the now-unused imports.
- `components/providers/ProviderFilters.tsx` — **deleted** (its only consumer was the results page).
- `components/providers/GeolocationSorter.tsx` — **deleted** (this invisible component auto-called `navigator.geolocation` on every results-page landing without a city/query — that was the location-permission prompt John hit after tapping the homepage search arrow).
- `app/injectors/[state]/[city]/page.tsx` — removed a dead `GeolocationSorter` import (usage there had already been removed in an earlier change; the orphaned import broke typecheck once the file was deleted).
- `components/home/HomeClient.tsx` — the hero search selects were uncontrolled and the arrow was a bare link to `/find-providers`, so selections were dropped. Both selects are now state-controlled and the button builds the results URL from them.

Verified in browser (the walkthrough's exact selections): pick Portland + Sculptra → button href becomes `/find-providers?city=Portland&state=OR&q=sculptra` → click lands on the results page with H1 "Explore Sculptra Providers" and header "Found 0 providers listed for Portland, OR" (0 = local placeholder data). No geolocation prompt is requested anywhere in the flow; the only remaining geolocation path was inside the deleted components. Note: `lib/actions/geo.ts` (`setGeoSession`) is now unreferenced by the results page and was left in place; middleware still reads the `user_geo` cookie for legacy coordinate URLs.

## Item 2 — Value statement + CTAs: ADDED (unedited draft copy, pending owner review)

**Flag: all copy below is the unedited draft from the fix list, placed as-is, pending John's review.** Two standing-rule adjustments were made to punctuation only: the draft's em dashes were replaced (hero: comma; button: hyphen; providers-page line: comma) because site copy carries a no-em-dash rule. No words were changed.

Files changed:
- `components/home/HomeClient.tsx`
  - Hero subhead replaced with: "Real prices. Confirmed credentials. InjectorIndex publishes what clinics actually charge for Botox, filler, and laser, and confirms every provider's credentials against the national NPI registry. You choose on facts. Good clinics get found for the right reasons."
  - The hero search button is now the labeled customer CTA: "See real prices near you" (it is also the working search button from Item 1).
  - Provider banner added at the top of the homepage "For Injectors & Clinics" section (dark card): "Your next patient is comparing prices right now. Claim your listing, publish your real prices, and stand on your confirmed credentials." Button: "Claim your listing - free" → links to `/claim`.
- `app/for-providers/page.tsx`
  - Added under the hero paragraph: "InjectorIndex connects credential-confirmed clinics with customers who book on transparent pricing, not ads."

Wording rule held: no "NPI certified" anywhere; the copy says credentials are "confirmed against the national NPI registry."

## Item 3 — Results header reworded

File changed: `app/find-providers/page.tsx`

Exact string implemented: `Found {count} providers listed for {City, ST}` (or `"{query}"` / `"All Locations"` when no city is set). Rendered locally as: **"Found 0 providers listed for Portland, OR"**. The blanket word "verified" is gone from the header; per-card credential state (already on the cards) carries the detail.

Not changed, flagged: the same page's `<title>` metadata still says "Clarity Score™ Verified", and the SEO text at the bottom of the page still contains "verified pricing and credentials, empowering you…" — both are outside the fix-list item (the header), and "empowering" is on the banned-word list. Recommend a follow-up copy pass on page metadata + SEO sections site-wide; other pre-existing instances sit in files touched here (e.g. homepage "Compare Verified Data" step card, /for-providers "verified credentials" body text).

## Item 4 — Quiz popup restricted to true exit intent

File changed: `components/ui/ExitIntentModal.tsx`

Root cause: the modal was not exit-intent at all — it fired on a flat 60-second timer, which is why it appeared during ordinary navigation (John tapping "For Providers" around the 60-second mark).

Fix: timer removed. The modal now fires once per session only when the pointer leaves the document through the top edge (`mouseout` with `relatedTarget === null` and `clientY <= 8`) — the browser-level signal for heading to the tab bar / closing the tab. Dismissal behavior (session storage) unchanged.

Verified in browser at 390px: (a) opening the menu and tapping "For Providers" → modal does NOT appear; (b) an in-page mouseout (relatedTarget set) → does NOT appear; (c) a true-exit mouseout (relatedTarget null, clientY 0) → modal DOES appear (see `screenshots/exit-intent-modal-390.png`). Honest limitation: touch devices have no pointer-exit signal, so the quiz will effectively never fire on phones/tablets; that is inherent to true exit intent and preferable to interrupting navigation.

## Item 5 — Stripe product rename

Skipped per instructions (dashboard task, not code).

## Item 6 — Results-page layout overlap / scroll ghosting

**Could not reproduce locally; no fix applied.** At 390px the results page top renders clean: the H1 sits fully below the fixed navbar with no clipping (`screenshots/find-providers-390.png`). Two relevant facts: (1) the element the recording showed under the header was the filter card, which Item 1 removes entirely, so that specific overlap cannot recur; (2) the navbar applies backdrop blur in both scroll states (pre-existing design in `components/layout/Navbar.tsx`, untouched), which can read as "ghosting" while content scrolls under it. If the overlap reappears in production after this branch ships, it needs a fresh recording against the new page — the page it was recorded on no longer exists in this form.

## CLAIM FLOW — the money path's front door (added mid-build from the production re-test)

### Defect 1: /claim clinic search returns "No clinic found" for real clinics

**Root cause (in code):** `ProviderLookup` always searches with a text query, and `getProvidersWithSearch` builds its OR filter with a condition on a `badges` column:

```ts
orConditions.push(`badges.cs.{"${q}"}`)
```

`badges` is the only filter column in that function that appears nowhere in the providers select list used across the app; it is defined only in a standalone script (`supabase/enrichment_schema.sql`), is absent from the Oct 22 production schema patch, and was not among the production columns the money-path verification confirmed. When PostgREST rejects a request over a filter column (missing column, or a JSONB column handed an invalid containment operand), the function takes its error branch and returns `[]` **before** its broad-search fallback can run — so every claim search, for every clinic name, came back empty and the lookup showed "No clinic found". The production re-test matches this exactly: all 1,032 providers exist unclaimed, yet no name matched.

Fix: `lib/actions/providers.ts` — removed the `badges` condition (with an explanatory comment). Clinic search is fully covered by the remaining name/city/state/business-type/description/credentials matching plus the treatment-slug and services conditions. The fix is safe under both possibilities: if production lacks the column, the error is gone; if it has the column, nothing the lookup needs is lost.

Local verification: typecheck + production build pass. The search cannot be exercised end-to-end locally (no production database access from this workspace; placeholder keys), but the failure mode is removed by construction — the generated request no longer references any column outside the function's own select list. One residual note: the URL-interpolated conditions would still break on a query containing a double quote; clinic names with quotes are an edge case left as-is.

### Defect 2: /claim/\<slug\>/verify returns the site 404 for real slugs

**Diagnosis — it is the verify page's data path, not a missing route and not providers RLS:**

- **Not the route:** `app/claim/[slug]/verify/page.tsx` exists in commit 74f79b9, and this build's route table lists `ƒ /claim/[slug]/verify`. Middleware's matcher covers only `/provider/*`, `/admin/*`, and `/find-providers` — it never touches `/claim`.
- **Not providers RLS:** no migration in the repo puts a policy on the `providers` table (the "Providers can view their own account" policy is on `provider_accounts`), and anonymous reads of provider rows demonstrably work in production — the directory pages and the claim landing page both read them.
- **The actual difference:** the landing page resolves through `getProviderBySlug` (`lib/actions/providers`), which uses the app's factory client (`createRouteHandlerClient` fed an already-awaited cookie store). The verify page — and only the claim steps after the landing page — fetched through `lib/supabase/server`'s `createClient()`: `createServerComponentClient` from `@supabase/auth-helpers-nextjs` 0.10 handed the **raw async** `cookies()` from `next/headers`. That package predates async cookies (Next 15+); this app runs Next 16.3.6. Its query came back with no row for real slugs, and the page's `if (!provider) notFound()` turned that into the site 404 for every clinic — matching the re-test, where the landing page resolved the same slug fine.

**Fix:** verify, edit, and success pages now fetch through `getProviderBySlug(slug)` — the identical path as the working landing page (edit and success shared the defective client and would have 404'd the same way one step later; same one-line change, flagged here for review):

- `app/claim/[slug]/verify/page.tsx`
- `app/claim/[slug]/edit/page.tsx`
- `app/claim/[slug]/success/page.tsx`

`lib/supabase/server.ts` is now unreferenced; left in place (harmless) rather than deleted, in case anything outside this repo's app tree imports it.

Local verification: production build passes with the route in the table; locally, `/claim/peachy-west-soho-new-york-ny` and `/claim/peachy-west-soho-new-york-ny/verify` now return **identical** status (both 404 locally only because no database is connected behind placeholder keys — they succeed or fail together through the same function now, which is the property production was missing). The verify form could not be screenshot locally for the same reason (no data); the /claim search page screenshot is included instead.

## Screenshots (390px, local production build)

- `screenshots/homepage-390.png` — hero: new subhead, wired selects, "See real prices near you" button.
- `screenshots/homepage-provider-banner-390.png` — the new provider banner card + "Claim your listing - free" button.
- `screenshots/find-providers-390.png` — results page via `/find-providers?city=Portland&state=OR&q=sculptra`: no form, H1 "Explore Sculptra Providers", header "Found 0 providers listed for Portland, OR" (0 = placeholder data locally).
- `screenshots/for-providers-390.png` — hero with the new InjectorIndex line under the intro paragraph.
- `screenshots/claim-390.png` — /claim page with the clinic search box.
- `screenshots/exit-intent-modal-390.png` — the quiz modal after a true-exit mouseout (positive control for Item 4).

## Files changed (summary)

Storefront:
- `components/home/HomeClient.tsx` (hero copy, wired search + CTA, provider banner)
- `app/find-providers/page.tsx` (form + sorter removed, header reworded)
- `app/for-providers/page.tsx` (providers line added)
- `components/ui/ExitIntentModal.tsx` (true exit intent only)
- `components/providers/ProviderFilters.tsx` (deleted)
- `components/providers/GeolocationSorter.tsx` (deleted)
- `app/injectors/[state]/[city]/page.tsx` (dead import removed)

Claim flow:
- `lib/actions/providers.ts` (badges filter condition removed)
- `app/claim/[slug]/verify/page.tsx`, `app/claim/[slug]/edit/page.tsx`, `app/claim/[slug]/success/page.tsx` (fetch via getProviderBySlug)

Nothing touching ranking, scoring, or payment was modified.

## Signup-first claim path — live test Oct 23, 2026 ~9:35-9:45 PM PDT (commit f512201)

Test: /claim search "Peachy" -> click Peachy West SoHo -> "CREATE ACCOUNT TO CLAIM" -> /provider/signup?id=616e88be-02a4-46db-90b4-d9e0fa31347e&plan=free -> submitted form (test email urielpro78+signuptest@gmail.com).

Result: FAILED, silent. An auth user was created (unconfirmed, email_confirmed_at NULL), but the providers row changed in ZERO of 68 columns (user_id NULL, claimed false, crm_status lead, email NULL), no provider_accounts row was created, and the user was bounced to /provider/login, whose Beta Notice says self-service logins are still rolling out and to check an invitation email. No error or confirmation message was shown.

Cause (code, app/provider/signup/page.tsx): the claim update runs through the browser Supabase client with no session (email unconfirmed), the update's returned error is never checked, and the flow pushes to /provider/dashboard, which bounces the sessionless user to login. Same silent-write failure class fixed in the verify-first flow in round 3 (service-role write + zero-row check). Design note: even if the update had landed, the code sets claimed=true instantly with no review or NPI check, which contradicts the claim_review model adopted in round 3.

Cleanup: test auth user deleted; providers row verified zero-diff against the 68-column baseline. Production pristine.

## Signup-first claim path — ROUND 4 re-test (live, Oct 23, 2026)
- Deploy: commit 33484c0 live Oct 23, 2026 9:54:00 PM PDT, deployment DNFwqPPKkbniENnfhXz1z6jV1Cxv, Ready (26s build). Test ran only after Ready.
- Fix: signup claim/listing writes moved server side (recordSignupClaim / createSignupProvider, service role, zero-row check); a signup claim lands in claim_review with the account linked, claimed/verified stay false; a failed write surfaces an error; success shows an honest in-review panel instead of a dashboard push that bounced sessionless users to login.
- RESULT: PASS. Submit stayed on the signup URL and showed "Account Created — Claim In Review / Your claim has been recorded and is in review. Nothing is marked claimed or verified until the review is complete..." No login bounce, no error banner.
- Database diff vs 68-column baseline: exactly 4 columns changed, all by design — user_id set to the new auth user, email = test email, crm_status lead -> claim_review, outreach_status not_sent -> claimed. claimed false, verified false, tier free unchanged. provider_accounts row created. Test email urielpro78+signuptest2@gmail.com.
- Cleanup verified: providers row restored, provider_accounts row deleted, auth user deleted — zero diff vs baseline, zero test rows.
- Remaining copy nits (not blockers): signup subtext/button still say "claim your listing" / "CREATE ACCOUNT & CLAIM" (ahead of the review the success panel now describes accurately); claim-search card uses pressure copy ("Action Required", "Top 15% in New York").
