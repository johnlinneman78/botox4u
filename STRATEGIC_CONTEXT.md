# MISSION: The Independent Provider Index
**We are a data research platform, not a clinic. Our role is to index, verify, and compare—never to provide medical advice.**
**This file explains the WHY behind every decision. When you hit an edge case not covered in AGENT_STATE.md or the task list, use this file to reason through it.**

---

## 1. GOOGLE PLACES API — TOS VIOLATION (CRITICAL)

### What the violation is
Google Places API Terms of Service explicitly prohibit:
- Storing Google review text and displaying it on your own pages
- Serving Google Places photo URLs as your own content
- Using Places data to build a competing directory service

The site was doing all three. At 50 providers it's invisible to enforcement. At 5,000 providers it becomes a target for API key revocation — which would take down all enriched data overnight.

### What is legally safe to keep
- `rating` (aggregate number) — factual data, not Google's content
- `review_count` (aggregate number) — factual data
- `google_place_id` — an identifier, not content
- Displaying "4.9★ · 557 reviews" with a "View on Google Maps" link — clean

### What must be removed or replaced
| Violation | Replacement |
|-----------|------------|
| Google Places photo URLs as hero images | og:image scraped from provider's own website |
| Google review text displayed verbatim | Remove entirely — show aggregate rating + count only |
| Google Places photos served on public pages | Geometric placeholder with clinic initials as fallback |

### The replacement architecture
**Hero images:** For each provider where `website IS NOT NULL`, fetch the page and extract `<meta property="og:image">`. Store in `hero_image_url`. Fallback: `<meta name="twitter:image">`. Final fallback: geometric placeholder generated from clinic name initials.

**Reviews:** Replace `top_reviews` display with:
```
"4.9★ · 557 reviews"
[View reviews on Google →] (links to: https://maps.google.com/?cid={google_place_id})
```

**Long-term review source:** Integrate Yelp Fusion API. Yelp's ToS explicitly permits displaying reviews with Yelp branding attribution. This is the legally clean replacement for Google review text.

### The claim flow is the permanent solution
Once a provider claims their listing and uploads their own photos, description, and pricing — that data is provider-owned and there is zero ToS risk. The `/provider/[slug]/claim` route is both the legal solution and the monetization entry point. Priority task.

---

## 2. PROVIDER DISPLAY STANDARD

### Rochester is the template
Rochester NY has 3 providers displaying correctly with real photos, ratings, and review counts. Every city page should meet this standard before going live. This is non-negotiable.

### The minimum viable provider definition
A provider is considered "enriched and displayable" when ALL of the following are true:
```sql
rating IS NOT NULL
AND hero_image_url IS NOT NULL  
AND hero_image_url NOT LIKE '%googleapis.com%'  -- not a Google photo
AND hero_image_url NOT LIKE '%googleusercontent.com%'  -- not a Google photo
AND review_count IS NOT NULL
AND display_status != 'hidden'
AND display_status != 'ghost'
```

### The minimum viable city page definition
A city page sets `display_status = 'live'` only when it has **at least 3 providers** meeting the enriched definition above. A page with 24 placeholder cards is significantly worse than a page with 3 real cards. Unenriched pages destroy trust with both patients and providers before you've had a chance to make a first impression.

### Never show fake or zero data
- Never display "$0/unit" — hide the price field if null
- Never display "0.0 / 5.0" — hide the rating if null  
- Never display "No ratings" — hide the review section entirely
- Never display placeholder provider names on the homepage
- Show what's real. Label what's pending. Hide what's empty.

---

## 3. TWO-TRACK PROVIDER STRATEGY

### Why two tracks exist
Providers who discover their listing themselves and find it looks broken become hostile — they'll demand removal and you've burned the relationship permanently. Providers who are notified first, see their listing looks good, and receive a human email become warm leads. The difference in conversion is significant.

### Track B — Relationship First
**Who qualifies:**
```sql
rating >= 4.7
AND review_count >= 75  
AND city IN (top 20 metros)
AND website IS NOT NULL
AND display_status = 'live'
```

**What happens:** Notification email sent within 48 hours of their city page going live. Email is NOT a sales pitch — it is a courtesy notification that they've been listed, here's the URL, reply if anything looks wrong.

---

## 5. BRAND DIFFERENTIATORS & COMPETITIVE MOAT

### The "Clean Girl" Mission
Unlike **Alle** (Brand Rewards) or **RealSelf** (Volume-based directory), we are an **Impact-based Ranking Engine**. 
- **Mission:** To eliminate aesthetic anxiety through data transparency.
- **Differentiator 1: Semantic Curation.** We don't just count stars. We scan review text for "conservative," "subtle," and "restored." Providers who "over-inject" (verified by sentiment analysis) are deprioritized or flagged.
- **Differentiator 2: Zero Pay-to-Play.** You cannot buy a #1 spot. You can only buy "Lead Generation" flow AFTER you've met our quality standard.
- **Differentiator 3: Price Verification.** Alle tells you about points; we tell you the price-per-unit before you drive to the clinic.

### Competitive Strategy
- **VS RealSelf:** RealSelf is too big and cluttered with ads. We are the "Curated Boutiques" of Botox.
- **VS Alle:** Alle is a manufacturer tool. We are a patient advocate tool.
- **Our Moat:** The **Botox-4U Score (V2)**. It is a proprietary calculation involving NPI data, sentiment analysis, and localized pricing—things a generic directory can't easily replicate at scale without custom scraping logic.

---

## 6. OUTREACH RULES — NON-NEGOTIABLE
[Rest of content truncated]
