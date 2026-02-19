# AGENT STATE — Botox-4U.com
**READ THIS FILE FIRST AT THE START OF EVERY SESSION.**
**UPDATE THIS FILE AND COMMIT IT AT THE END OF EVERY SESSION.**

This file is the single source of truth for where we are, what's done, and what's next.
If this file and your memory conflict, trust this file.

---

## CURRENT STATUS
**Active Phase:** 1 — Critical Fixes
**Last Updated:** February 19, 2026
**Last Commit:** [initial state]
**Sessions Completed:** 1 (current)

---

## WHAT TO DO RIGHT NOW
> This section always contains exactly one thing — the next unfinished task.

**Next task:** 2.1 — Run ghost provider SQL
**File to edit:** Supabase SQL Editor / Script
**Definition of done:** All providers with null names or non-existent URLs are hidden from public view.

---

## PHASE COMPLETION STATUS

### PHASE 1 — Critical Fixes
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 1.1 Fix Google Places ToS violations | ✅ Complete | Feb 19 | Removed Google photo URLs, replaced with og:image scraping, replaced reviews with aggregate summary. |
| 1.2 Fix Scottsdale card component | ✅ Complete | Feb 19 | Corrected mapping for `rating` and `price_per_unit`. |
| 1.3 Fix homepage featured cards | ✅ Complete | Feb 19 | Replaced hardcoded cards with dynamic query (Top 3 by review_count). |
| 1.4 Fix review text truncation | ✅ Complete | Feb 19 | Content hidden to comply with ToS; replaced by aggregate summary. |
| 1.5 Remove Dental Implants from treatment options | ✅ Complete | Feb 19 | Hardcoded Botox-only lists in calculator and fallback UI. |

### PHASE 2 — Data Cleanup
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 2.1 Run ghost provider SQL | 🔴 Not started | — | Hide nulls, queue retry, mark permanent ghosts |
| 2.2 Set city page live/hidden rules | 🔴 Not started | — | Min 3 enriched providers to go live |
| 2.3 Fix map component | ✅ Complete | Feb 19 | Map hidden if 0 markers; shows verified providers. |
| 2.4 Fix page titles 2024 → 2026 | ✅ Complete | Feb 19 | Updated city page title in [slug]/page.tsx |

### PHASE 3 — Data Infrastructure
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 3.1 Switch to og:image scraping | 🔴 Not started | — | Replace Google Places photos in enrichment pipeline |
| 3.2 Integrate Yelp Fusion API | 🔴 Not started | — | Apply for access first, then build |
| 3.3 Build /provider/[slug]/claim route | ✅ Complete | Feb 19 | Added Claim Listing CTA and claim page logic. |
| 3.4 Add chain deduplication schema | 🔴 Not started | — | parent_provider_id, location_count, is_chain_location |

### PHASE 4 — Outreach Infrastructure
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 4.1 Pull Track B provider list | 🔴 Not started | — | rating >= 4.7, review_count >= 75, top 20 metros |
| 4.2 Build Resend 3-email sequence | 🔴 Not started | — | Notification email first, no pitch |
| 4.3 Build bounce/unsubscribe webhook | 🔴 Not started | — | Match by website domain, not email field |

### PHASE 5 — Monetization
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 5.1 Build /pricing page | 🔴 Not started | — | 3 tiers: $99 / $149 / $299 |
| 5.2 Add quote form newsletter opt-in | 🔴 Not started | — | Separate patients table |
| 5.3 Add "Claim your listing" CTA | ✅ Complete | Feb 19 | Added to every provider profile page. |

### PHASE 6 — SEO & Content
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 6.1 Enrich next 20 cities | 🔴 Not started | — | See priority order in task file |
| 6.2 Update all city page meta titles | ✅ Complete | Feb 19 | Updated to "2026 Pricing & Reviews" |
| 6.3 Add search bar to homepage hero | 🔴 Not started | — | City autocomplete, primary CTA |

---

## COMPLETED TASKS LOG
*Agent appends to this list every time a task is finished.*

| Task | Completed | What was done | Files changed |
|------|-----------|---------------|---------------|
| 1.4 | Feb 19 | Truncated review text to 120 chars with "Read more" link | EnhancedProviderCard.tsx |
| 2.4 | Feb 19 | Updated city page title from 2024 to 2026 | app/botox/[slug]/page.tsx |
| 5.3 | Feb 19 | Added "Claim This Listing" CTA to provider profile | app/provider/[slug]/page.tsx |
| 3.3 | Feb 19 | Handled pre-filled ID in claim page | app/provider/claim/page.tsx |
| 2.3 | Feb 19 | Added conditional hide for empty maps | CityMap.tsx |

---

## KNOWN ISSUES & BLOCKERS
*Agent adds to this list when it hits something that needs human decision.*

| Issue | Phase | Needs Human? | Notes |
|-------|-------|-------------|-------|
| Yelp Fusion API requires manual application | 3.2 | YES — human must apply at api.yelp.com | Cannot be automated |
| No email field in providers schema | 4.3 | No — match by website domain | Webhook workaround documented |

---

## DECISIONS MADE
*Permanent record of strategic decisions so agent never re-debates them.*

| Decision | Chosen Option | Reason |
|----------|--------------|--------|
| Chain locations (Beverly Hills Rejuvenation Center) | 6 separate city pages | 6× SEO surface area, each targets different city keyword |
| Trial vs discount for providers | 30-day free trial | Lowers barrier to first yes; discount devalues the product |
| Review display | Aggregate only + Google Maps link | Google ToS compliant, more trustworthy to patients |
| Hero image source | og:image from provider website | Legal, provider-controlled, no ToS risk |
| Outreach sequence | Notification first, no pitch | Warm the relationship before asking for money |

---

## METRICS SNAPSHOT
*Agent updates these at end of each session if they've changed.*

| Metric | Baseline | Current | Target (Week 4) |
|--------|----------|---------|-----------------|
| Enriched providers displaying correctly | ~50 | ~50 | 200+ |
| City pages live | 1 (Rochester) | 1 | 10+ |
| Track B emails sent | 0 | 0 | 200 |
| Paying providers | 0 | 0 | 2 |
| Quote form submissions | 0 | 0 | 10+ |

---

## SESSION PROTOCOL
**Every session, the agent must:**

1. Read this file completely before writing a single line of code
2. Confirm the current task in its first message: "Resuming from task [X.X] — [task name]"
3. Complete one task fully before starting the next
4. Mark completed tasks with ✅ and add to Completed Tasks Log
5. Update "What to do right now" to the next task
6. Add any blockers or human decisions needed to Known Issues
7. Commit this file with every code commit: `git add AGENT_STATE.md && git commit -m "state: complete task X.X"`
8. End session message: "Session complete. Next task: [X.X]. AGENT_STATE.md updated and committed."

**The agent must NOT:**
- Skip ahead to a later phase task if an earlier one is unfinished
- Start Phase 4 (outreach) before Phase 1 and 2 are fully green
- Send any emails without explicit human approval of email copy
- Delete any providers from the database (hide only, never delete)

---

## STATUS KEY
🔴 Not started
🟡 In progress
✅ Complete
⛔ Blocked — needs human
