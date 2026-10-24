# Template-price audit — InjectorIndex (phase 1 companion deliverable)

**Date:** October 24, 2026
**Branch:** price-report-widget
**Status:** PROPOSED ONLY. Nothing in this document is merged or applied.
Copy changes listed here need their own approval and their own commit.

## Headline finding: the database holds no per-clinic prices at all

A read-only check of all 1,032 provider rows (Oct 24, 2026) found:

- `price_per_unit`: ZERO non-null values.
- `min_treatment_price`: ZERO non-null values.
- `botox_price_per_unit`: the column does not exist.

So the price column is not "unverified provenance" — it is empty. Every
per-unit price the site displays today comes from template numbers,
fallbacks, or config ranges — not from clinic data. That makes this
cleanup confirmed necessary, not precautionary, and it means the widget
(phase 1) and clinic claims (phase 2) are the ONLY path to real prices.
Benchmarks stay context only. Scraping stays off the table.

## How the fake numbers get onto pages (root cause)

When no clinic price exists, the code invents one instead of saying so:

- `lib/actions/providers.ts:437,441` — city average falls back to
  `NICHE.priceRange.min + 4` (config min is 10, so 14) when no prices exist.
- `lib/audit-scoring.ts:91` — city average falls back to min + 5 (15).
- Page literals — `stats?.avgCost || 15` (treatments pages, PriceMeter)
  and `stats?.avgCost || 14` (city pages) render a number even when stats
  are empty.
- `config/niche.js:46` — `priceRange: { min: 10, max: 25 }`, the config
  range those fallbacks derive from. A config range is not market data.

Fix the machinery, not just the words: when no real price exists, pages
must say "Price not published" (with the price-report CTA) instead of
rendering a fallback number.

## Group A — live false precision (fix before any price guide goes live)

### A1. Treatment pages — "verified data" + $15 fallback
- `app/treatments/[treatment]/[state]/[slug]/page.tsx:145` — AtAGlance
  summary: "Based on verified data from N clinics in {city}, here is
  what you can expect for pricing…"
- Same page: `Avg Cost` = `stats?.avgCost || 15`, and PriceMeter
  `avgCost={stats?.avgCost || 15}`. JSON-LD (line 83): "the average cost
  … is approximately $X per unit" from the same fallback.
- Proposed: drop "verified data" everywhere on this page. When no real
  stats exist, show "Price not published — ask for a per-unit quote"
  plus the price-report CTA. No fallback number, ever.

### A2. City pages — $14 fallback dressed as analysis
- `app/injectors/[state]/[city]/page.tsx:323` — "with an average Botox
  price of ${stats?.avgCost || 14} per unit" plus a whole paragraph of
  above/below-national-average narrative derived from that fallback.
- Same page line 170 — the summary sentence only renders when
  `stats?.avgCost` exists, which is the honest pattern; keep that pattern.
- Proposed: delete the $14-fallback sentence and its narrative until
  real aggregates exist. Keep the provider count (real) and credentials.

### A3. Provider pages — invented range + "local average"
- `app/provider/[slug]/page.tsx:114,183` — "Botox in {city} typically
  costs $12-$16 per unit…" and "{name} is assessed at a price index of
  {price or 'the local average'}".
- Proposed: replace with "Prices vary by clinic — ask for a per-unit
  quote." Delete "the local average" until aggregates exist.

### A4. Homepage hero — "Verified Market Rates"
- `components/home/Hero.tsx:158` — stat "$12–25 Per Unit Pricing" with
  note "Verified Market Rates".
- `components/Hero.tsx:87` — stat "$12–25 Unit Pricing".
- Proposed: remove the "Verified Market Rates" note. Replace the range
  with "Prices vary — see what people actually paid" once the pool
  exists, or drop the stat until then. (Confirm which Hero is live; both
  are listed so neither survives unexamined.)

### A5. Pulse page — fake index stats + testimonial
- `app/pulse/page.tsx:36` — "$14.22 Global Avg / Unit", plus "32 Cities
  Tracked", "2,324 Verified Providers", "100% Independent Data", under a
  "Live Market Intel" badge.
- Same page line 230 — testimonial quote: "I thought $22/unit was
  normal… After seeing the Pulse data, I realized I was overpaying by
  $400 per visit."
- Proposed: remove the stats row and the testimonial until real data
  exists. A disclaimer on a fake stat is still a fake stat — removal is
  preferred over relabeling here.

### A6. Claim edit form — invented "typical" price
- `app/claim/[slug]/edit/EditForm.tsx:103` — "Typical price in {city}:
  $11 - $14 / unit."
- Proposed: delete. Replace with "Clinics set their own prices — enter
  what you charge per unit." (This form is where phase-2 claimed prices
  will come from; it must not anchor clinics to a made-up range.)

### A7. About page — capability claim the site cannot do yet
- `app/about/page.tsx:130` — "We collect real per-unit pricing and
  compare each provider against their local market average."
- Proposed: "We're building a crowdsourced price pool — real prices from
  real people." Truthful about what exists today.

### A8. Treatment explorer — ranges presented as expectations
- `components/ui/TreatmentExplorer.tsx:10,16` — "Expect $10–$18/unit
  depending on your city", "Expect $500–$900/syringe."
- Proposed: label "Illustrative ranges, not clinic prices" or remove the
  numbers until the pool exists.

### A9. TopScoringCard fallback — "City Avg" that is not an average
- `components/providers/TopScoringCard.tsx:202` — fallback text
  "Estimated: $12–$16/unit (City Avg)" when a clinic has no price.
- Proposed: replace with "Price not published" plus the price-report
  CTA. This is exactly the owner's "Price not published" spot.

### A10. City price table — one range claiming verification
- `lib/city-botox-prices.ts:17` — Portland "$12–$17", source "Observed
  clinic published prices, Oct 2026 SEO research", under a header
  comment claiming a city joins "ONLY when its range has been checked."
- Proposed: produce the underlying observations or relabel as
  "Illustrative range from Oct 2026 research — not live clinic prices."
  Do not add more cities on this basis.

### A11. Calculator — estimates with fake-precision extras
- `app/calculator/CalculatorClient.tsx:65-225` — per-city tier tables
  (budget/mid/premium per toxin), plus `providerCount` and
  `benchmarkDelta` per city. The page already footnotes "Estimates only.
  Final pricing requires an in-person consultation" (line 516).
- Proposed: keep as planning estimates, but add a top-of-page line:
  "These are planning estimates, not prices any clinic charges." Verify
  or drop the providerCount/benchmarkDelta precision (counts and deltas
  presented as data need a source).

## Group B — illustrative examples (keep, label clearly)

- `app/botox-buyers-guide/page.tsx:301-340` — "Hot Girl Math" panels:
  $10/unit bargain clinic vs $18/unit expert, $500/$3,000+/$360/$0.
  These read as scenarios, not market claims. Proposed: add an
  "Example — not market data" label to the section.
- `app/guide/safety-guide/page.tsx:55` — "If the price is below
  $9/unit, it may indicate diluted product." A safety-guidance
  threshold, not a market price. Keep as guidance; never cite it as a
  market statistic.
- `lib/emails/day0.ts:42, day2.ts:35, day3.ts:31-43` — drip-email math
  examples ($14/unit × 25 units = $350; touch-ups $50–$150; Allē
  ~$60/visit). Hypothetical arithmetic. Keep the hypothetical framing;
  do not present any of it as a market average.
- `app/provider/[slug]/intelligence-brief/page.tsx:189` — "$18" table
  cell. Context not verified in this audit: if it is an example, label
  it; if it claims to be data, move it to Group A.

## Group C — dormant today (column empty, renders nothing — guard it)

These displays only render when a price value exists, so today they show
nothing, "—", or "Consult for pricing". They become live the moment any
price lands, so the rule must be set before phase 2:

- `components/providers/EnhancedProviderCard.tsx:230-232` — "From
  $X/unit" when a price exists.
- `components/providers/ProviderProfileClient.tsx:339-340,540-576` —
  "Price Index" row ("Pricing on inquiry" when empty) and "From $X/unit"
  service rows.
- `components/providers/TopScoringCard.tsx:200-205` — price or the
  Group A9 fallback.
- `components/home/InjectorMatchQuiz.tsx:225` — price or "—".
- `app/injectors/[state]/[city]/page.tsx:53` — meta description "from
  $avgPrice" only when a first provider price exists; today the no-price
  description renders. Keep that behavior; never render a fallback here.
- `components/ui/MorphingHeadline.tsx:12` — code comment: "In Portland,
  clinics publish Botox at $12–$17 a unit." Non-rendering, but fix the
  comment so nobody copies it as fact.

Rule for when values start landing (phase 2 claims): display only
clinic-published values, labeled "published by clinic" with a date.
Never blend report data into a clinic price without the phase-4
aggregation rules (distributions/medians, sample sizes, dates,
month/year only, minimum-report threshold set with real data).

## Group D — not clinic prices (excluded from cleanup)

Subscription and tier prices are real product prices, not treatment
prices: `app/api-access/page.tsx` ($0/$29/$99), `app/docs/page.tsx`
($0/$29), claim tiers ($49/$99 in SuccessView). The `max_price` API
field docs describe a filter, not a price claim. No change proposed.

## Appendix 1 — every dollar figure in lib/blog-data.ts (324 lines)

Blog posts are the largest single source of hard-coded prices. The lines
below are the complete grep output (`grep -n -E '\$[0-9]'`), unedited.
Fix approach for the whole file (not line by line): strip "verified
data" / "average" claims (43 lines in the file match verified/average
wording), convert city averages to labeled illustrative ranges or delete
them, and add a disclosure to pricing posts that figures are examples
until the price pool exists. Do not present any of these as current
clinic prices.

```
lib/blog-data.ts:16:        metaDescription: 'Average Botox costs $10–$20 per unit in 2026, but prices vary wildly by city. See real patient-reported pricing data, what affects cost, and how to avoid overpaying.',
lib/blog-data.ts:20:You Googled "how much does Botox cost" and got seventeen different answers ranging from $200 to $1,200 per session. That's not helpful. Here's what's actually going on.
lib/blog-data.ts:28:Botox typically costs between **$10 and $20 per unit** nationally in 2026, with most patients paying **$12–$16 per unit** in major metropolitan areas. Most treatments require 20–60 units depending on the area being treated.
lib/blog-data.ts:30:The national average in 2026 falls between **$10 and $20 per unit**, with most patients paying **$12–$16 per unit** in major metropolitan areas.
lib/blog-data.ts:36:| Forehead lines | 10–30 units | $120–$480 |
lib/blog-data.ts:37:| Frown lines (between brows) | 15–25 units | $180–$400 |
lib/blog-data.ts:38:| Crow's feet (both sides) | 12–24 units | $144–$384 |
lib/blog-data.ts:39:| Lip flip | 4–8 units | $48–$128 |
lib/blog-data.ts:40:| Full face (forehead + frown + crow's feet) | 40–60 units | $480–$960 |
lib/blog-data.ts:52:| San Francisco, CA | $19 | 54 |
lib/blog-data.ts:53:| New York, NY | $18 | 142 |
lib/blog-data.ts:54:| Miami, FL | $16 | 95 |
lib/blog-data.ts:55:| Portland, OR | $14 | 90 |
lib/blog-data.ts:56:| Los Angeles, CA | $14 | 128 |
lib/blog-data.ts:57:| Scottsdale, AZ | $13 | 64 |
lib/blog-data.ts:58:| Chicago, IL | $12 | 82 |
lib/blog-data.ts:59:| Dallas, TX | $11 | 76 |
lib/blog-data.ts:60:| Houston, TX | $11 | 89 |
lib/blog-data.ts:62:*Note: Portland average ($14) and range ($11–$18) are based on current verified data from 90 local clinics.*
lib/blog-data.ts:68:**Per-unit pricing:** You pay a set rate for each unit of Botox injected. If the rate is $14/unit and you get 30 units, you pay $420. You know exactly what you're getting and what it costs. This is the transparent model.
lib/blog-data.ts:70:**Per-area pricing:** The clinic charges a flat fee for treating an "area" — say $350 for the forehead. Sounds simple, but you don't know how many units are included. Some clinics use fewer units to keep their margins high, which means your results may not last as long or look as good.
lib/blog-data.ts:90:Botox offered at extreme discounts (under $8 per unit) is a significant red flag for counterfeit product, diluted units, or unlicensed practitioners.
lib/blog-data.ts:94:This doesn't mean affordable Botox is bad. Plenty of excellent injectors charge $11–$13/unit in markets where that's the competitive rate. But if a price seems dramatically below the local average, verify the provider's credentials. Check their NPI (National Provider Identifier) status, read patient reviews, and make sure they're using FDA-approved product.
lib/blog-data.ts:104:**Compare to your city average.** If you're in Portland and someone quotes you $22/unit, you're paying 57% above average. That doesn't mean it's wrong — but you should understand what you're paying a premium for.
lib/blog-data.ts:113:                answer: 'At the national average of $12–$16/unit, 20 units costs $240–$320. In high-cost cities like San Francisco or New York, expect $340–$400 for 20 units.'
lib/blog-data.ts:125:                answer: "Most patients get Botox every 3–4 months. At the national average, that's roughly $960–$2,560 per year depending on how many units you need and your city's pricing."
lib/blog-data.ts:129:                answer: 'Provider credentials, clinic overhead, product brand, injection technique, and business model (membership vs. à la carte) all affect pricing. The same 30 units can cost $330 at one clinic and $540 at another a mile away.'
lib/blog-data.ts:172:**Beware of extreme discounts.** If Botox is priced dramatically below the local average (under $8/unit in most markets), ask why. It may be legitimate — but it may indicate diluted or counterfeit product. At Verified Aesthetics, we publish city-average pricing so you know what "normal" looks like in your area.
lib/blog-data.ts:208:But does it actually work? And is it worth spending $1,000–$2,500 a year in your 20s or 30s on a treatment you might not visibly need yet?
lib/blog-data.ts:244:| Traditional Botox (full face) | $480–$960 | $1,440–$3,840 |
lib/blog-data.ts:245:| Preventative Botox (targeted areas) | $200–$450 | $600–$1,800 |
lib/blog-data.ts:247:*In Portland, preventative treatments typically use 10-15 units, costing between $140 and $210 per session based on the local $14 average.*
lib/blog-data.ts:303:| Botox | $12–$20 | 10–20 units | $120–$400 |
lib/blog-data.ts:304:| Dysport | $4–$8 per unit | 25–50 units | $100–$400 |
lib/blog-data.ts:305:| Xeomin | $10–$18 | 10–20 units | $100–$360 |
lib/blog-data.ts:306:| Jeuveau | $10–$18 | 10–20 units | $100–$360 |
lib/blog-data.ts:307:| Letybo | $10–$16 | 10–20 units | $100–$320 |
lib/blog-data.ts:515:Pearl District PN pricing ranges from $550–$850 per session, with most protocols requiring 3 sessions spaced 3–4 weeks apart. Total investment: $1,650–$2,550 for a full course. That's competitive with a single syringe of premium HA filler that needs replacing every 9–12 months.
lib/blog-data.ts:523:PN sessions in Alberta Arts run $500–$750 per session. Slightly lower than Pearl District because overhead is lower, but the quality of injectors is comparable. Several Alberta providers combine PNs with microneedling or exosome therapy for what they call "regenerative layering" — a protocol that accelerates collagen production by 40% compared to PNs alone.
lib/blog-data.ts:531:Pricing on NW 23rd is the highest in Portland for PNs: $700–$900 per session. The premium reflects physician-level oversight and typically more conservative dosing protocols. If you want the most medically rigorous PN experience in Portland, NW 23rd is where to look.
lib/blog-data.ts:537:Southeast Portland's Division Street corridor is the newest entrant to the PN market. Two medspas launched PN services in late 2025, and early pricing is aggressive: $450–$650 per session.
lib/blog-data.ts:558:                answer: 'Portland PN pricing ranges from $450–$900 per session depending on the neighborhood. Pearl District averages $550–$850, Alberta Arts $500–$750, NW 23rd $700–$900, and Division/Clinton $450–$650. Most protocols require 3 sessions.'
lib/blog-data.ts:589:The math is simple. If you're a busy professional spending $600–$900 per Botox session every 3–4 months, that's $1,800–$3,600 per year. Daxxify costs more per session — typically $700–$1,100 in Portland — but you only go twice a year. Annual cost: $1,400–$2,200.
lib/blog-data.ts:597:Pearl District: $13–$16 per unit. Typical full-face treatment: $520–$800.
lib/blog-data.ts:599:Alberta Arts: $11–$14 per unit. Typical full-face: $440–$700.
lib/blog-data.ts:601:NW 23rd: $14–$18 per unit. Typical full-face: $560–$900. Premium reflects physician-led practices.
lib/blog-data.ts:603:Lake Oswego / West Portland: $12–$15 per unit. Typical full-face: $480–$750.
lib/blog-data.ts:622:                answer: 'Portland Daxxify pricing ranges from $11–$18 per unit depending on the provider and neighborhood. A typical full-face treatment (40–50 units) runs $440–$900. Because Daxxify lasts 6–9 months, the annual cost is often 20–40% less than Botox.'
lib/blog-data.ts:665:Key Portland metrics: 90+ providers indexed, average per-unit neurotoxin cost $14, PN adoption rate 38% of providers, top Clarity Score™ 9.4 (Pearl District).
lib/blog-data.ts:675:Key Seattle metrics: 72+ providers indexed, average per-unit cost $16, PN adoption rate 29% and rising, top Clarity Score™ 9.1.
lib/blog-data.ts:683:SF also has the highest average per-unit pricing in our network at $19, but patients here view the cost through a "total longevity investment" lens rather than a "per-treatment" lens.
lib/blog-data.ts:685:Key SF metrics: 54+ providers indexed, average per-unit cost $19, PN adoption rate 33%, Exosome adoption rate 28% (highest in the country), top Clarity Score™ 9.2.
lib/blog-data.ts:706:                answer: 'Individual regenerative medicine sessions (PNs at $550–$900) cost more than a standard Botox session ($360–$600). However, many patients find the annual cost is comparable or lower because treatments like Polynucleotides and Daxxify last longer and require fewer visits per year.'
lib/blog-data.ts:739:Portland exosome pricing: $350–$650 per session as an add-on to microneedling or PNs, $500–$750 as a standalone treatment.
lib/blog-data.ts:741:Seattle exosome pricing: $400–$700 per session as an add-on, $550–$850 standalone.
lib/blog-data.ts:743:Most protocols involve 3–4 sessions for optimal results. Total investment: $1,050–$3,000 depending on protocol and location.
lib/blog-data.ts:751:Providers who offer regenerative layering in Portland charge $800–$1,400 per combined session. Expensive per visit, but patients report needing fewer total sessions compared to standalone treatments.
lib/blog-data.ts:766:                answer: 'Portland exosome sessions range from $350–$750 depending on whether it\'s an add-on to another treatment or standalone. Most protocols require 3–4 sessions for optimal results, putting the total investment at $1,050–$3,000.'
lib/blog-data.ts:793:Capitol Hill PN pricing: $500–$800 per session. Daxxify: $12–$15/unit. Exosomes: $400–$650 add-on.
lib/blog-data.ts:801:SLU providers tend to be physician-led practices with deep expertise in regenerative medicine. Pricing reflects this: PNs run $650–$900, Daxxify $14–$18/unit, and combination protocols $1,000–$1,500 per session.
lib/blog-data.ts:809:Bellevue PN pricing: $700–$950 per session — the highest in the greater Seattle area. But the providers here typically offer the most comprehensive regenerative protocols, including PN + exosome + advanced volumizing combination treatments that can run $1,500–$2,200 per session.
lib/blog-data.ts:817:Pricing in Wallingford/Fremont is moderate: PNs $500–$700, Daxxify $11–$14/unit. The lower pricing reflects the neighborhood's practical, values-driven patient base — people who want regenerative medicine to be accessible, not luxurious.
lib/blog-data.ts:823:Seattle's average per-unit neurotoxin pricing ($16) is 14% higher than Portland's ($14), reflecting higher cost of living and higher average provider credentials. But when you factor in Daxxify's longer duration, the annual cost difference narrows significantly.
lib/blog-data.ts:834:                answer: 'Seattle PN pricing ranges from $500–$950 per session depending on neighborhood. Capitol Hill: $500–$800. SLU: $650–$900. Bellevue: $700–$950. Most protocols require 3 sessions for optimal results.'
lib/blog-data.ts:967:Pricing in the UES remains the highest in the country, with PN sessions ranging from $800–$1,200 per session. But for the demographic here, the medical oversight and clinical precision are worth the premium.
lib/blog-data.ts:975:SoHo pricing is more competitive than the UES, with Daxxify units ranging from $14–$18.
lib/blog-data.ts:981:Clinics in the Flatiron District and Tribeca are reporting that layering these modalities produces skin quality improvements that previously required invasive surgery. The investment is significant — often $3,000–$5,000 for a full course — but the results are the definition of the Neo-Romantic sublime: undetectable, natural, and biologically younger skin.
lib/blog-data.ts:988:                answer: 'In NYC, PN sessions typically range from $600–$1,200. Upper East Side providers average $800–$1,200, while more boutique studios in SoHo or Brooklyn range from $600–$900.'
lib/blog-data.ts:1220:                answer: 'Yes — expect Rejuran and Plinest to run $450–$700 per session; Juvelook is often slightly higher at $500–$800 due to the hybrid formulation.'
lib/blog-data.ts:1289:        metaDescription: "Botox pricing in 2026 ranges from $9 to $25+ per unit. Here's exactly why the variance exists, what fair pricing actually looks like in your market, and how to avoid getting overcharged.",
lib/blog-data.ts:1293:You asked three different providers in your city for a Botox quote. One quoted $9/unit, one quoted $17/unit, and one quoted $25/unit. You have no idea which is reasonable and which is a rip-off.
lib/blog-data.ts:1296:The provider's cost for a 100-unit vial is approximately $550–$650. Everything above that is margin, driven by:
lib/blog-data.ts:1298:- **Provider type**: High-volume med spas ($10–$13) vs. Boutique doctor-led practices ($14–$18) vs. Concierge practices ($20–$25+).
lib/blog-data.ts:1306:- $15/unit x 50 units = $750
lib/blog-data.ts:1307:- $10/unit x 80 units = $800
lib/blog-data.ts:1322:- **New York City**: $16–$19 ($12–$28 range)
lib/blog-data.ts:1323:- **Los Angeles**: $15–$18 ($11–$26 range)
lib/blog-data.ts:1324:- **Miami**: $14–$18 ($10–$25 range)
lib/blog-data.ts:1325:- **Portland**: $13–$17 ($9–$22 range)
lib/blog-data.ts:1326:- **Scottsdale**: $13–$16 ($10–$20 range)
lib/blog-data.ts:1371:**Average Botox price:** $16-$20 per unit
lib/blog-data.ts:1392:**Upper East Side (60s-80s, Lexington to Park):** The historic center of NYC cosmetic medicine. The highest concentration of board-certified dermatologists and plastic surgeons in the city. Many UES providers are department chairs, published researchers, or Allergan national trainers. Premium pricing ($20-$25/unit) but premium expertise. Best for patients who want the deepest credentials available.
lib/blog-data.ts:1394:**Midtown East / Murray Hill:** Strong mix of established dermatology practices and modern medspas. More accessible pricing than UES ($15-$19/unit) with comparable credentials. Good for professionals who want lunchtime appointments near the office.
lib/blog-data.ts:1396:**Flatiron / Union Square:** NYC's most competitive medspa zone for the 25-40 demographic. Dense cluster of independent medspas with strong branding, social media presence, and trend-forward treatment menus. This is where you'll find the earliest NYC adopters of polynucleotides and micro-dose protocols. Pricing: $14-$18/unit.
lib/blog-data.ts:1398:**SoHo / Tribeca:** Boutique practices in premium retail corridors. The patient base here values discretion and aesthetic curation. Fewer providers but higher average quality. Expect curated treatment menus and personalized protocols. Pricing: $16-$20/unit.
lib/blog-data.ts:1400:**Chelsea / West Village:** Growing aesthetic market with a mix of established practices and newer entrants. Strong LGBTQ+-inclusive practices with experience in gender-affirming aesthetics. Pricing: $14-$18/unit.
lib/blog-data.ts:1404:**Financial District / Lower Manhattan:** Emerging market targeting downtown professionals. Newer practices with competitive pricing ($12-$16/unit). Less established than Midtown or UES, but growing quickly.
lib/blog-data.ts:1453:        metaDescription: 'Portland\'s top medspas and Botox injectors ranked by Clarity Score™ clinical data. See rankings for 90+ providers, real pricing ($11–$18/unit), and why Portland has the highest Clinical Quality Ratio in the U.S.',
lib/blog-data.ts:1466:**Average Botox price:** $14 per unit ($11–$18 range)
lib/blog-data.ts:1501:**Pearl District / NW Portland:** Higher-end practices, walkable from downtown. Expect premium pricing ($15-$18/unit). Boutique practices with curated treatment menus.
lib/blog-data.ts:1505:**Beaverton / Tigard:** More affordable options ($10-$14/unit). Chain medspas and value-oriented independent clinics. Good option if you know exactly what you want and don't need extensive consultation.
lib/blog-data.ts:1515:**Pricing:** Portland is 10-15% cheaper on average. Seattle's average per-unit Botox price runs $14-$17 vs. Portland's $13-$15.
lib/blog-data.ts:1552:| **Portland, OR** | **$14** | **90+** | **54% (Highest in U.S.)** |
lib/blog-data.ts:1553:| Seattle, WA | $16 | 72+ | 38% |
lib/blog-data.ts:1554:| San Francisco, CA | $19 | 54+ | 33% |
lib/blog-data.ts:1555:| Los Angeles, CA | $14 | 128+ | 31% |
lib/blog-data.ts:1556:| New York, NY | $18 | 142+ | 28% |
lib/blog-data.ts:1557:| Miami, FL | $16 | 95+ | 22% |
lib/blog-data.ts:1571:                answer: 'Portland Botox averages $14 per unit in 2026, with a range of $11–$18 per unit. A typical full-face treatment (forehead + frown lines + crow\'s feet) costs $440–$1,080 depending on your provider and the number of units needed.'
lib/blog-data.ts:1579:                answer: 'Pearl District and NW Portland have the highest-scoring providers at $13–$18/unit. SE Portland and Division Street offer the best value at $11–$14/unit. Lake Oswego and West Linn provide premium physician-led care in a suburban setting.'
lib/blog-data.ts:1594:        metaDescription: 'Chicago Botox averages $12-$16/unit and Seattle $14-$17/unit in 2026. See real pricing by neighborhood and provider type for both markets.',
lib/blog-data.ts:1601:**Average per-unit cost:** $12-$16
lib/blog-data.ts:1603:**Full range:** $9-$20 per unit
lib/blog-data.ts:1606:- Chain medspas and volume clinics: $9-$12/unit
lib/blog-data.ts:1607:- Independent medspas: $12-$15/unit
lib/blog-data.ts:1608:- Dermatology practices: $14-$18/unit
lib/blog-data.ts:1609:- Plastic surgery offices: $16-$20/unit
lib/blog-data.ts:1612:- Full face (forehead + 11s + crow's feet): $480-$1,024
lib/blog-data.ts:1613:- First-timer average: $450-$750
lib/blog-data.ts:1617:**Gold Coast / Magnificent Mile:** $15-$20/unit. Chicago's prestige aesthetic corridor. Premium plastic surgery practices and established dermatology offices. Strong credential base — many providers affiliated with Northwestern Medicine.
lib/blog-data.ts:1619:**Lincoln Park / Lakeview:** $12-$16/unit. Competitive market targeting the 28-45 demographic. Good balance of quality and value. Dense concentration of independent medspas.
lib/blog-data.ts:1621:**River North / West Loop:** $13-$17/unit. Professional district with modern medspa presence. Growing market with newer practices investing in current-generation treatment menus. Convenient for downtown workers.
lib/blog-data.ts:1623:**Bucktown / Wicker Park:** $11-$14/unit. Younger, trend-conscious market. Boutique practices with natural-results philosophy. More likely to find polynucleotides and micro-dose Botox protocols here.
lib/blog-data.ts:1625:**North Shore suburbs (Winnetka, Highland Park, Lake Forest):** $14-$18/unit. Affluent suburban practices with loyal patient bases and experienced providers. Lower patient turnover than city practices.
lib/blog-data.ts:1627:**Oak Brook / Hinsdale / Naperville (Western suburbs):** $10-$14/unit. Strong value zone with well-credentialed providers at below-city pricing. Several excellent dermatology practices serve the western suburbs.
lib/blog-data.ts:1641:**Average per-unit cost:** $14-$17
lib/blog-data.ts:1643:**Full range:** $10-$20 per unit
lib/blog-data.ts:1646:- Chain medspas and volume clinics: $10-$13/unit
lib/blog-data.ts:1647:- Independent medspas: $13-$16/unit
lib/blog-data.ts:1648:- Dermatology practices: $15-$18/unit
lib/blog-data.ts:1649:- Plastic surgery offices: $17-$20/unit
lib/blog-data.ts:1652:- Full face (forehead + 11s + crow's feet): $560-$1,088
lib/blog-data.ts:1653:- First-timer average: $500-$850
lib/blog-data.ts:1657:**Capitol Hill / First Hill:** $14-$18/unit. Seattle's most established aesthetic corridor. Mix of dermatology practices affiliated with UW Medicine and Swedish Medical Center, plus independent medspas. Strong credential base.
lib/blog-data.ts:1659:**South Lake Union / Fremont:** $13-$16/unit. Tech-worker demographic. Modern medspas with efficient, appointment-focused models. Growing market.
lib/blog-data.ts:1661:**Queen Anne / Magnolia:** $14-$17/unit. Residential practices with long-term patient relationships. Less churn than Capitol Hill.
lib/blog-data.ts:1663:**Bellevue / Kirkland (Eastside):** $14-$19/unit. The Eastside's aesthetic market rivals Seattle proper. Bellevue in particular has a dense cluster of premium practices serving the tech-industry demographic. Some of the metro's highest-credentialed providers have relocated to Bellevue for the patient base and lower overhead.
lib/blog-data.ts:1665:**University District / Northgate:** $10-$13/unit. Most affordable zone in the Seattle metro. Newer practices targeting younger patients and first-timers. Good entry point for preventative Botox.
lib/blog-data.ts:1667:**Tacoma / Federal Way:** $9-$12/unit. South Sound offers the lowest pricing in the metro at 25-35% below Seattle proper. Growing market with improving provider quality.
lib/blog-data.ts:1685:| New York City | $16-$22 | $640-$1,400 |
lib/blog-data.ts:1686:| Los Angeles | $15-$20 | $600-$1,152 |
lib/blog-data.ts:1687:| Miami | $14-$19 | $560-$1,088 |
lib/blog-data.ts:1688:| Scottsdale | $13-$18 | $520-$1,024 |
lib/blog-data.ts:1689:| **Seattle** | **$14-$17** | **$560-$1,088** |
lib/blog-data.ts:1690:| Portland | $13-$15 | $520-$960 |
lib/blog-data.ts:1691:| **Chicago** | **$12-$16** | **$480-$1,024** |
lib/blog-data.ts:1692:| Dallas | $10-$14 | $400-$896 |
lib/blog-data.ts:1693:| Houston | $9-$13 | $360-$832 |
lib/blog-data.ts:1713:        metaDescription: 'Dallas Botox averages $10-$14/unit and Houston $9-$13/unit in 2026 — among the lowest in the US. See real pricing by neighborhood, provider type, and how Texas compares nationally.',
lib/blog-data.ts:1722:**Average per-unit cost:** $10-$14
lib/blog-data.ts:1724:**Full range:** $8-$18 per unit
lib/blog-data.ts:1727:- Chain medspas and volume clinics: $8-$11/unit
lib/blog-data.ts:1728:- Independent medspas: $10-$14/unit
lib/blog-data.ts:1729:- Dermatology practices: $13-$16/unit
lib/blog-data.ts:1730:- Plastic surgery offices: $14-$18/unit
lib/blog-data.ts:1733:- Forehead + 11s + crow's feet (40-64 units): $400-$896
lib/blog-data.ts:1734:- Full face first-timer average: $400-$700
lib/blog-data.ts:1738:**Highland Park / University Park:** $13-$18/unit. Dallas's prestige corridor. Board-certified plastic surgeons and established dermatology practices. Premium pricing but the deepest credentials in the metro.
lib/blog-data.ts:1740:**Uptown / Knox-Henderson:** $11-$15/unit. Young professional demographic. Competitive medspa market with strong independent practices. Good balance of quality and value.
lib/blog-data.ts:1742:**Preston Hollow / North Dallas:** $12-$16/unit. Established suburban practices serving the affluent North Dallas residential base. Long-term patient relationships and consistent results.
lib/blog-data.ts:1744:**Frisco / Plano / McKinney:** $9-$13/unit. Fast-growing North Texas suburbs with rapidly expanding medspa markets. Some of the best value in the metro — several providers here have strong credentials at prices 20-30% below Highland Park.
lib/blog-data.ts:1746:**Fort Worth / Mid-Cities:** $8-$12/unit. Most affordable zone in DFW. Growing provider market. Quality varies more at the lower price points, so verify credentials carefully.
lib/blog-data.ts:1752:**Average per-unit cost:** $9-$13
lib/blog-data.ts:1754:**Full range:** $7-$17 per unit
lib/blog-data.ts:1757:- Chain medspas and volume clinics: $7-$10/unit
lib/blog-data.ts:1758:- Independent medspas: $9-$13/unit
lib/blog-data.ts:1759:- Dermatology practices: $12-$15/unit
lib/blog-data.ts:1760:- Plastic surgery offices: $13-$17/unit
lib/blog-data.ts:1763:- Forehead + 11s + crow's feet (40-64 units): $360-$832
lib/blog-data.ts:1764:- Full face first-timer average: $350-$650
lib/blog-data.ts:1770:**River Oaks / Upper Kirby:** $12-$17/unit. Houston's premium aesthetic district. Established plastic surgery practices and high-end medspas. The credential depth rivals Dallas's Highland Park at slightly lower prices.
lib/blog-data.ts:1772:**The Heights / Montrose:** $10-$14/unit. Houston's trendy inner-loop neighborhoods with a growing aesthetic market. Independent practices with modern branding and trend-forward treatment menus.
lib/blog-data.ts:1774:**Galleria / Uptown:** $10-$14/unit. Commercial district with strong medspa presence. Convenient for professionals. Mid-range pricing with good provider variety.
lib/blog-data.ts:1776:**Memorial / Energy Corridor:** $9-$13/unit. Suburban West Houston. Established practices with moderate pricing. Good value for West Houston residents.
lib/blog-data.ts:1778:**Sugar Land / Katy / The Woodlands:** $7-$11/unit. Houston's outer suburbs offer the lowest pricing in any major US metro. At sub-$10/unit, verify the provider's credentials, supervision structure, and product sourcing carefully.
lib/blog-data.ts:1780:**Medical Center area:** $10-$15/unit. Proximity to the Texas Medical Center means access to providers affiliated with Baylor, UT Health, and Methodist. Academic-adjacent credentials at moderate pricing.
lib/blog-data.ts:1786:**Lower overhead.** Office space in Houston costs a fraction of Manhattan or Beverly Hills. A provider pays $15-$25/sqft in Houston v. $80-$150/sqft on Park Avenue. That savings passes directly to patients.
lib/blog-data.ts:1800:| New York City | $16-$22 | $640-$1,400 |
lib/blog-data.ts:1801:| Los Angeles | $15-$20 | $600-$1,152 |
lib/blog-data.ts:1802:| Miami | $14-$19 | $560-$1,088 |
lib/blog-data.ts:1803:| Scottsdale | $13-$18 | $520-$1,024 |
lib/blog-data.ts:1804:| Seattle | $14-$17 | $560-$1,088 |
lib/blog-data.ts:1805:| Portland | $13-$15 | $520-$960 |
lib/blog-data.ts:1806:| Chicago | $12-$16 | $480-$1,024 |
lib/blog-data.ts:1807:| **Dallas** | **$10-$14** | **$400-$896** |
lib/blog-data.ts:1808:| **Houston** | **$9-$13** | **$360-$832** |
lib/blog-data.ts:1814:This is the question Texas patients should be asking. The answer: price alone doesn't determine safety or quality. A board-certified dermatologist in Houston charging $12/unit is using the same FDA-approved Botox as a Park Avenue dermatologist charging $22/unit. The product is identical.
lib/blog-data.ts:1817:- **Injector experience and training.** A $7/unit provider with 6 months of experience is a different proposition than a $12/unit provider with 10 years.
lib/blog-data.ts:1820:- **Consultation quality.** At $8/unit in a volume clinic, you're likely getting 5 minutes of face time. At $14/unit in a private practice, you're getting 15-20 minutes. The consultation is where your treatment plan gets customized to your anatomy. It matters.
lib/blog-data.ts:1826:**Prioritize credentials over discounts.** In a market this affordable, the difference between a $9/unit and $13/unit provider is $160-$256 over a full-face treatment. That's not worth compromising on quality. Choose the better provider.
lib/blog-data.ts:1846:        metaDescription: 'LA Botox costs $15-$20 per unit in 2026. See real pricing data from indexed providers across Beverly Hills, WeHo, Santa Monica, and the Valley — plus what you\'re actually paying for.',
lib/blog-data.ts:1849:        content: `Los Angeles is the aesthetic capital of the United States. More cosmetic procedures are performed in the LA metro than any other city, and the provider market reflects that — hundreds of options ranging from Beverly Hills plastic surgeons charging $25/unit to Valley medspas at $10/unit.
lib/blog-data.ts:1855:**Average per-unit cost:** $15-$18
lib/blog-data.ts:1857:**Full range across LA providers:** $10-$25+ per unit
lib/blog-data.ts:1860:- Chain medspas and volume clinics (Valley, DTLA): $10-$13/unit
lib/blog-data.ts:1861:- Independent medspas (WeHo, Silver Lake, Pasadena): $14-$17/unit
lib/blog-data.ts:1862:- Dermatology practices (Santa Monica, Brentwood): $16-$20/unit
lib/blog-data.ts:1863:- Plastic surgery offices (Beverly Hills, Bel Air): $20-$25+/unit
lib/blog-data.ts:1869:**Forehead lines:** 10-30 units → $150-$540
lib/blog-data.ts:1870:**Glabellar lines (11s):** 15-25 units → $225-$450
lib/blog-data.ts:1871:**Crow's feet (both sides):** 12-24 units → $180-$432
lib/blog-data.ts:1872:**Full face (forehead + 11s + crow's feet):** 40-64 units → $600-$1,152
lib/blog-data.ts:1873:**Lip flip:** 4-6 units → $60-$108
lib/blog-data.ts:1874:**Masseter/jawline:** 40-60 units → $600-$1,080
lib/blog-data.ts:1876:Most first-time LA patients spend $550-$950 for a standard full-face treatment.
lib/blog-data.ts:1882:**Beverly Hills / Century City:** $20-$25+/unit. The global epicenter of cosmetic medicine. Providers here treat celebrities, public figures, and patients who fly in specifically for their expertise. You're paying for world-class credentials, discretion, and precision. Many Beverly Hills providers are Allergan trainers, published researchers, or former department chairs. The premium is real — but so is the expertise.
lib/blog-data.ts:1884:**West Hollywood / Melrose:** $15-$19/unit. LA's most competitive aesthetic corridor. Dense concentration of medspas targeting the entertainment-adjacent demographic. Trend-forward practices that adopt new products early. Strong Daxxify and polynucleotide availability. WeHo providers compete aggressively on quality because the patient base is discerning and talks.
lib/blog-data.ts:1886:**Santa Monica / Brentwood:** $16-$20/unit. Westside practices with strong credentials and a patient base that skews older and more conservative in aesthetic preferences. Emphasis on natural results. Less turnover than WeHo — these are established practices with long patient relationships.
lib/blog-data.ts:1888:**Studio City / Sherman Oaks / Encino (The Valley):** $11-$15/unit. Best value in the LA metro without leaving the city. Growing number of excellent independent practices. Valley pricing is 25-40% below Beverly Hills for comparable credentials. The stigma that "Valley medspas are inferior" is outdated — several Valley practices now have Clarity Scores™ that compete with Westside clinics.
lib/blog-data.ts:1890:**DTLA / Arts District:** $12-$16/unit. Emerging market with newer practices. Small but growing. Good value for downtown residents, though the options are more limited than other LA zones.
lib/blog-data.ts:1892:**Pasadena / Glendale:** $13-$17/unit. Established suburban practices with loyal patient bases. Less trendy than WeHo, more accessible than Beverly Hills. Solid middle-ground option.
lib/blog-data.ts:1894:**South Bay (Manhattan Beach, Hermosa, Redondo):** $14-$18/unit. Beach community practices with a relaxed, wellness-oriented approach. Good option if you're South Bay-based — the commute to Beverly Hills isn't worth the prestige tax for most people.
lib/blog-data.ts:1896:**Orange County (Irvine, Newport Beach):** $14-$19/unit. Technically not LA, but many LA patients consider it. Newport Beach in particular has a mature aesthetic market that rivals Beverly Hills in credential depth at somewhat lower pricing.
lib/blog-data.ts:1912:| New York City | $16-$22 | $640-$1,400 |
lib/blog-data.ts:1913:| **Los Angeles** | **$15-$20** | **$600-$1,152** |
lib/blog-data.ts:1914:| Miami | $14-$19 | $560-$1,088 |
lib/blog-data.ts:1915:| Scottsdale | $13-$18 | $520-$1,152 |
lib/blog-data.ts:1916:| Seattle | $14-$17 | $560-$1,088 |
lib/blog-data.ts:1917:| Portland | $13-$15 | $520-$960 |
lib/blog-data.ts:1918:| Chicago | $12-$16 | $480-$1,024 |
lib/blog-data.ts:1919:| Dallas | $10-$14 | $400-$896 |
lib/blog-data.ts:1920:| Houston | $9-$13 | $360-$832 |
lib/blog-data.ts:1930:**Memberships make sense in LA.** Given the higher per-unit pricing, LA medspa memberships ($150-$300/month) often deliver the best per-unit value for regular patients. Calculate the annual cost vs. pay-per-visit before deciding.
lib/blog-data.ts:1948:        metaDescription: 'Miami Botox costs $14-$19 per unit in 2026. See real pricing from indexed providers across Miami Beach, Coral Gables, Brickell, and Wynwood — plus how to avoid tourist pricing.',
lib/blog-data.ts:1957:**Average per-unit cost:** $14-$17
lib/blog-data.ts:1959:**Full range across Miami providers:** $10-$22 per unit
lib/blog-data.ts:1962:- High-volume medspas and chains (South Beach, Doral): $10-$13/unit
lib/blog-data.ts:1963:- Independent medspas (Wynwood, Brickell, Midtown): $13-$16/unit
lib/blog-data.ts:1964:- Dermatology practices (Coral Gables, Coconut Grove): $15-$19/unit
lib/blog-data.ts:1965:- Plastic surgery offices (Coral Gables, Aventura): $17-$22/unit
lib/blog-data.ts:1971:**Forehead lines:** 10-30 units → $140-$510
lib/blog-data.ts:1972:**Glabellar lines (11s):** 15-25 units → $210-$425
lib/blog-data.ts:1973:**Crow's feet (both sides):** 12-24 units → $168-$408
lib/blog-data.ts:1974:**Full face (forehead + 11s + crow's feet):** 40-64 units → $560-$1,088
lib/blog-data.ts:1975:**Lip flip:** 4-6 units → $56-$102
lib/blog-data.ts:1976:**Masseter/jawline:** 40-60 units → $560-$1,020
lib/blog-data.ts:1978:Most Miami patients spend $500-$900 per session for a standard full-face treatment.
lib/blog-data.ts:1984:**South Beach / Miami Beach:** $12-$16/unit. Massive provider density. Lots of walk-in clinics targeting tourists and the social scene. Prices are competitive because of heavy competition, but quality varies wildly. Some South Beach clinics are excellent; others are volume mills with undertrained injectors. Check credentials carefully in this zone.
lib/blog-data.ts:1986:**Brickell / Downtown:** $14-$17/unit. Miami's professional district. Growing cluster of modern medspas targeting the young professional demographic. Good balance of quality and pricing. Many practices here opened in the last 3-5 years and invested in current-generation products and training.
lib/blog-data.ts:1988:**Coral Gables:** $16-$20/unit. Miami's prestige aesthetic corridor. Established plastic surgery practices and dermatology offices with decades of experience. Higher pricing reflects premium credentials and a patient base that prioritizes results over deals. If you want the deepest expertise in South Florida, Coral Gables is where to look.
lib/blog-data.ts:1990:**Wynwood / Design District:** $13-$16/unit. Miami's trendiest neighborhood for aesthetics. Boutique practices with curated branding, younger patient demographics, and an emphasis on natural-looking results. More likely to find newer treatments like polynucleotides and Daxxify here.
lib/blog-data.ts:1992:**Aventura / North Miami Beach:** $13-$17/unit. Established suburban practices with loyal patient bases. Less tourist-driven, which often means more consistent quality and pricing. Good option for residents who want a long-term provider relationship.
lib/blog-data.ts:1994:**Doral / Kendall / West Miami:** $10-$14/unit. Most affordable zone in the Miami metro. Higher proportion of chain medspas. Can be excellent value — but the provider quality range is wider at these prices, so verify credentials and experience.
lib/blog-data.ts:2002:**Walk-in / tourist pricing:** Often quoted "per area" instead of per-unit, making comparison impossible. A "forehead area" quoted at $350 might be 20 units ($17.50/unit) or 15 units ($23.33/unit) — you won't know unless you ask.
lib/blog-data.ts:2012:| New York City | $16-$22 | $640-$1,400 |
lib/blog-data.ts:2013:| Los Angeles | $15-$20 | $600-$1,280 |
lib/blog-data.ts:2014:| **Miami** | **$14-$19** | **$560-$1,088** |
lib/blog-data.ts:2015:| Scottsdale | $13-$18 | $520-$1,152 |
lib/blog-data.ts:2016:| Seattle | $14-$17 | $560-$1,088 |
lib/blog-data.ts:2017:| Portland | $13-$15 | $520-$960 |
lib/blog-data.ts:2018:| Chicago | $12-$16 | $480-$1,024 |
lib/blog-data.ts:2019:| Dallas | $10-$14 | $400-$896 |
lib/blog-data.ts:2020:| Houston | $9-$13 | $360-$832 |
lib/blog-data.ts:2058:        metaDescription: 'NYC Botox costs $16-$22 per unit in 2026. See real pricing data from 140+ indexed Manhattan providers, what affects your cost, and how NYC compares to other cities.',
lib/blog-data.ts:2067:**Average per-unit cost:** $16-$20
lib/blog-data.ts:2069:**Full range across NYC providers:** $12-$25+ per unit
lib/blog-data.ts:2072:- Chain medspas and volume clinics (Midtown, FiDi): $12-$15/unit
lib/blog-data.ts:2073:- Independent medspas (Chelsea, Flatiron, Tribeca): $15-$19/unit
lib/blog-data.ts:2074:- Dermatology practices (UES, UWS): $18-$22/unit
lib/blog-data.ts:2075:- Plastic surgery offices (Park Avenue, UES): $20-$25+/unit
lib/blog-data.ts:2081:**Forehead lines:** 10-30 units → $160-$600
lib/blog-data.ts:2082:**Glabellar lines (11s):** 15-25 units → $240-$500
lib/blog-data.ts:2083:**Crow's feet (both sides):** 12-24 units → $192-$480
lib/blog-data.ts:2084:**Full face (forehead + 11s + crow's feet):** 40-64 units → $640-$1,280
lib/blog-data.ts:2085:**Lip flip:** 4-6 units → $64-$120
lib/blog-data.ts:2086:**Masseter/jawline:** 40-60 units → $640-$1,200
lib/blog-data.ts:2088:Most first-time NYC patients spend $600-$1,000 for a full-face treatment combining forehead, 11s, and crow's feet.
lib/blog-data.ts:2094:**Upper East Side / Park Avenue:** $20-$25+/unit. This is where Manhattan's top-tier plastic surgeons and dermatologists practice. You're paying for elite credentials, private consultation rooms, and decades of experience. Many of these physicians are published researchers or department chairs. If budget isn't the primary concern, UES has the deepest bench of expertise in the country.
lib/blog-data.ts:2096:**Midtown / Flatiron / Chelsea:** $15-$19/unit. The sweet spot for most patients. Strong independent medspas and dermatology practices with excellent credentials at more moderate pricing. High competition keeps prices reasonable.
lib/blog-data.ts:2098:**SoHo / Tribeca / West Village:** $16-$20/unit. Boutique practices with a curated aesthetic. These clinics tend to attract younger patients and emphasize natural results. Higher proportion of providers offering newer products like Daxxify and polynucleotides.
lib/blog-data.ts:2100:**Financial District / Lower Manhattan:** $12-$16/unit. Growing market with newer practices competing on price for the downtown professional crowd. Good value, but verify credentials carefully — newer practices may have less experienced injectors.
lib/blog-data.ts:2102:**Brooklyn (Williamsburg, Park Slope, DUMBO):** $13-$17/unit. Brooklyn's aesthetic market has matured significantly. Several excellent practices now rival Manhattan quality at 15-25% lower prices. Worth considering if you're Brooklyn-based.
lib/blog-data.ts:2104:**Outer boroughs and NJ border:** $10-$14/unit. Lowest pricing in the metro area. Can be excellent value if you find a well-credentialed provider, but the variance in quality is wider at this price point.
lib/blog-data.ts:2110:| **New York City** | **$16-$22** | **$640-$1,400** |
lib/blog-data.ts:2111:| Los Angeles | $15-$20 | $600-$1,280 |
lib/blog-data.ts:2112:| Miami | $14-$19 | $560-$1,216 |
lib/blog-data.ts:2113:| Scottsdale | $13-$18 | $520-$1,152 |
lib/blog-data.ts:2114:| Seattle | $14-$17 | $560-$1,088 |
lib/blog-data.ts:2115:| Portland | $13-$15 | $520-$960 |
lib/blog-data.ts:2116:| Chicago | $12-$16 | $480-$1,024 |
lib/blog-data.ts:2117:| Dallas | $10-$14 | $400-$896 |
lib/blog-data.ts:2118:| Houston | $9-$13 | $360-$832 |
lib/blog-data.ts:2138:**Look at membership programs.** Many NYC medspas offer monthly memberships ($150-$250/month) that include discounted units. If you're getting Botox 3-4 times per year, the math often favors membership.
lib/blog-data.ts:2142:**Don't chase the cheapest option.** In NYC specifically, the $10/unit Groupon clinic and the $22/unit Park Avenue dermatologist are not providing the same service. Expertise and precision matter with injections. Pay for quality, then optimize value within the quality tier you're comfortable with.
lib/blog-data.ts:2160:        metaDescription: 'Portland Botox costs $12-$16 per unit in 2026. See real pricing data from 20+ indexed providers, what affects your cost, and how Portland compares to other cities.',
lib/blog-data.ts:2167:**Average per-unit cost:** $13-$15
lib/blog-data.ts:2169:**Full range across Portland providers:** $10-$18 per unit
lib/blog-data.ts:2172:- Chain medspas and volume clinics: $10-$12/unit
lib/blog-data.ts:2173:- Independent medspas: $12-$15/unit
lib/blog-data.ts:2174:- Dermatology practices: $14-$17/unit
lib/blog-data.ts:2175:- Plastic surgery offices: $15-$18/unit
lib/blog-data.ts:2183:**Forehead lines:** 10-30 units → $130-$450
lib/blog-data.ts:2184:**Glabellar lines (11s between the eyes):** 15-25 units → $195-$375
lib/blog-data.ts:2185:**Crow's feet (both sides):** 12-24 units → $156-$360
lib/blog-data.ts:2186:**Full face (forehead + 11s + crow's feet):** 40-64 units → $520-$960
lib/blog-data.ts:2187:**Lip flip:** 4-6 units → $52-$90
lib/blog-data.ts:2188:**Masseter/jawline:** 40-60 units → $520-$900
lib/blog-data.ts:2190:Most first-time patients in Portland spend $400-$700 for forehead, 11s, and crow's feet combined.
lib/blog-data.ts:2198:| New York City | $16-$22 | $640-$1,400 |
lib/blog-data.ts:2199:| Los Angeles | $15-$20 | $600-$1,280 |
lib/blog-data.ts:2200:| Miami | $14-$19 | $560-$1,216 |
lib/blog-data.ts:2201:| Scottsdale | $13-$18 | $520-$1,152 |
lib/blog-data.ts:2202:| Seattle | $14-$17 | $560-$1,088 |
lib/blog-data.ts:2203:| **Portland** | **$13-$15** | **$520-$960** |
lib/blog-data.ts:2204:| Chicago | $12-$16 | $480-$1,024 |
lib/blog-data.ts:2205:| Dallas | $10-$14 | $400-$896 |
lib/blog-data.ts:2206:| Houston | $9-$13 | $360-$832 |
lib/blog-data.ts:2226:        metaDescription: 'We ranked 95+ Miami Botox providers using Clarity Score™ data. See the top injectors in Brickell, South Beach, and Coral Gables with real pricing ($12–$22/unit) and clinical quality scores.',
lib/blog-data.ts:2236:- **Average Botox price:** $16/unit (above the $14 national average)
lib/blog-data.ts:2237:- **Price range:** $12–$22/unit
lib/blog-data.ts:2259:**Brickell pricing:** $16–$22/unit. The premium reflects physician oversight and prime location overhead. Providers here often maintain the highest Clarity Scores™ in the Miami metro due to their credential depth and conservative, results-focused approach.
lib/blog-data.ts:2265:**South Beach pricing:** $14–$20/unit. High variance in quality. Use Clarity Score™ to filter marketing from merit.
lib/blog-data.ts:2271:**Coral Gables pricing:** $15–$20/unit. Highest average provider tenure in Miami.
lib/blog-data.ts:2277:**Wynwood pricing:** $12–$16/unit. Good value, but verify credentials carefully — newer clinics may have less-experienced injectors.
lib/blog-data.ts:2283:**Doral/Kendall pricing:** $12–$16/unit. Often the best value in the Miami metro for patients willing to drive.
lib/blog-data.ts:2289:| Forehead lines | 10–30 units | $120–$660 |
lib/blog-data.ts:2290:| Frown lines (11s) | 15–25 units | $180–$550 |
lib/blog-data.ts:2291:| Crow's feet (both sides) | 12–24 units | $144–$528 |
lib/blog-data.ts:2292:| Lip flip | 4–6 units | $48–$132 |
lib/blog-data.ts:2293:| Full face | 40–60 units | $480–$1,320 |
lib/blog-data.ts:2294:| Masseter/jawline | 40–60 units | $480–$1,320 |
lib/blog-data.ts:2296:Most Miami patients spend $500–$900 for a standard three-area treatment.
lib/blog-data.ts:2302:| New York, NY | $18 | 142+ | Highest density, premium pricing |
lib/blog-data.ts:2303:| San Francisco, CA | $19 | 54+ | Highest per-unit cost nationally |
lib/blog-data.ts:2304:| **Miami, FL** | **$16** | **95+** | **High competition, marketing-heavy** |
lib/blog-data.ts:2305:| Los Angeles, CA | $14 | 128+ | Extreme medspa saturation |
lib/blog-data.ts:2306:| Scottsdale, AZ | $13 | 64+ | Premium destination, below-avg pricing |
lib/blog-data.ts:2307:| Portland, OR | $14 | 90+ | Highest clinical quality ratio (54%) |
lib/blog-data.ts:2308:| Chicago, IL | $12 | 82+ | Moderate market, value pricing |
lib/blog-data.ts:2314:1. **Extreme discount pricing** (under $10/unit) — May indicate diluted product or unlicensed practitioners. The CDC has linked botulism cases to unlicensed injectors in Florida.
lib/blog-data.ts:2342:                answer: 'Miami Botox averages $16 per unit in 2026, with a range of $12–$22 per unit across the metro area. A typical full-face treatment costs $480–$1,320. Brickell and South Beach tend to be the most expensive neighborhoods; Doral and Kendall offer the best value.'
lib/blog-data.ts:2350:                answer: 'Brickell has the highest average Clarity Scores™ for Botox providers in Miami, with physician-led practices targeting the financial district\'s professional clientele ($16–$22/unit). Coral Gables offers established dermatology practices with 10+ years of experience ($15–$20/unit). Doral and Kendall offer the best value ($12–$16/unit).'
lib/blog-data.ts:2354:                answer: 'Yes, Miami ranks above the national average at $16/unit (national average: $14). It\'s comparable to Seattle but less expensive than New York ($18) and San Francisco ($19). The western suburbs (Doral, Kendall) offer pricing closer to the national average at $12–$16/unit.'
lib/blog-data.ts:2358:                answer: 'Verify their NPI number at npiregistry.cms.hhs.gov, avoid providers offering extreme discounts (under $10/unit), look for Clarity Scores™ above 70 on VerifiedAesthetics, and read review language for mentions of "natural results" and "transparent pricing." Avoid providers with "Featured" badges on other platforms — those are paid placements, not quality indicators.'
```

## Appendix 2 — dollar figures and price wording in app/components/lib (excluding blog-data.ts)

Complete grep output for the rest of the codebase. Subscription/tier
prices and API field docs are Group D (excluded). Everything else maps
to Groups A–C above.

```
=== APP_COMPONENTS ===
app/api-access/page.tsx:89:                            <div className="text-2xl font-black text-[#3D2B1F]">$0<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
app/api-access/page.tsx:113:                            <div className="text-2xl font-black text-[#3D2B1F]">$29<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
app/api-access/page.tsx:142:                            <div className="text-2xl font-black text-[#3D2B1F]">$99<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
app/botox-buyers-guide/page.tsx:301:                                    <div className="text-4xl font-display font-black text-red-700 mb-8">$10/unit</div>
app/botox-buyers-guide/page.tsx:309:                                            <span className="font-bold text-[#3D2B1F]">$500</span>
app/botox-buyers-guide/page.tsx:317:                                            <span className="font-black text-red-700">$3,000+</span>
app/botox-buyers-guide/page.tsx:324:                                    <div className="text-4xl font-display font-black text-emerald-700 mb-8">$18/unit</div>
app/botox-buyers-guide/page.tsx:332:                                            <span className="font-bold text-[#3D2B1F]">$360</span>
app/botox-buyers-guide/page.tsx:340:                                            <span className="font-black text-emerald-700 font-display">$0</span>
app/claim/[slug]/edit/EditForm.tsx:103:                            Typical price in <strong className="text-[#3D2B1F]">{provider.city}</strong>: $11 - $14 / unit.
app/claim/[slug]/success/SuccessView.tsx:107:                        After 30 days, choose from Verified ($49/mo) or Featured ($99/mo) to keep your enhanced listing active. No auto-charge — we'll send a reminder before your trial ends.
app/claim/[slug]/success/SuccessView.tsx:119:                        {/* FEATURED TIER — $99/mo */}
app/claim/[slug]/success/SuccessView.tsx:128:                                    <span className="text-4xl font-black text-[#C9A96E]">$99</span>
app/claim/[slug]/success/SuccessView.tsx:158:                        {/* VERIFIED TIER — $49/mo */}
app/claim/[slug]/success/SuccessView.tsx:162:                                <span className="text-4xl font-black text-[#3D2B1F]">$49</span>
app/docs/page.tsx:142:        price: '$0',
app/docs/page.tsx:151:        price: '$29/mo',
app/guide/safety-guide/page.tsx:55:                                { title: "Suspiciously Low Pricing", text: "If the price is below $9/unit, it may indicate diluted product or non-FDA-approved counterfeits." },
app/provider/[slug]/intelligence-brief/page.tsx:189:                                    <td className="px-8 py-6 text-center text-slate-500">$18</td>
app/provider/[slug]/page.tsx:114:                    "text": `Botox in ${provider.city} typically costs $12-$16 per unit depending on the clinical setting and provider expertise. ${provider.name} is assessed at a price index of ${provider.price_per_unit ? '$' + provider.price_per_unit + '/unit' : 'the local average'}, reflecting the market standard for ${provider.businessType || 'Aesthetic Medicine'} providers in the area.`
app/provider/[slug]/page.tsx:183:                            Botox in {provider.city} typically costs between $12 and $16 per unit depending on the clinical setting and provider expertise. {provider.name} is assessed at a price index of {provider.price_per_unit ? '$' + provider.price_per_unit + '/unit' : 'the local average'}, reflecting the market standard for {provider.businessType || 'Aesthetic Medicine'} providers in the area. Patients should consult directly with the practice for exact quotes tailored to their treatment goals.
app/pulse/page.tsx:36:                            <div className="text-3xl font-bold font-display mb-1">$14.22</div>
app/pulse/page.tsx:230:                            <p className="text-[#3D2B1F]/60 italic mb-6">"I thought $22/unit was normal for the Pearl District. After seeing the Pulse data, I realized I was overpaying by $400 per visit. Found a new injector 2 miles away with more experience."</p>
components/Hero.tsx:87:                        { value: '$12–25', label: 'Unit Pricing' },
components/home/Hero.tsx:158:                        { value: '$12–25', label: 'Per Unit Pricing', note: 'Verified Market Rates' },
components/providers/TopScoringCard.tsx:202:                                : `Estimated: $12–$16/unit (City Avg)`
components/ui/MorphingHeadline.tsx:12:// Verified city: "In Portland, clinics publish Botox at $12–$17 a unit.
components/ui/TreatmentExplorer.tsx:10:        description: 'Neurotoxins relax the muscles that create dynamic wrinkles — forehead lines, crow\'s feet, and frown lines. Results last 3–4 months. Expect $10–$18/unit depending on your city.',
components/ui/TreatmentExplorer.tsx:16:        description: 'Hyaluronic acid fillers add subtle volume and definition to lips. A skilled injector focuses on proportion and balance — not overcorrection. Expect $500–$900/syringe.',
=== LIB_NONBLOG ===
lib/actions/audit.ts:243:                                <span style="font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
lib/actions/providers.ts:436:    // ANTI-ZERO GUARD: Ensure Scottsdale (and others) never show $0 or 0.0 rating
lib/emails/day0.ts:42:  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">A provider charging $14/unit who uses 25 units costs you $350. A provider charging $11/unit who uses 35 units costs you $385 — and they looked cheaper on paper.</p>
lib/emails/day2.ts:35:  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Some providers, though, charge $50-$150 for touch-up visits. Over 3-4 sessions per year, that's an extra $200-$600 you didn't budget for.</p>
lib/emails/day3.ts:2:// Subject: You're probably leaving $150/year on the table
lib/emails/day3.ts:9:    return "You're probably leaving $150/year on the table"
lib/emails/day3.ts:31:    <p style="font-size:15px;line-height:1.6;color:#444;margin-bottom:0;">This is the manufacturer's rewards program. You earn points on every Allergan treatment (Botox, Juvederm, etc.) at any participating provider. Points convert to savings on future treatments — typically $50-$75 in value per visit. Most providers participate, but not all. Ask before you book.</p>
lib/emails/day3.ts:41:    <p style="font-size:15px;color:#CCC;margin:8px 0;">Allē savings: ~$60/visit × 3 visits = <strong style="color:#fff;">$180/year</strong></p>
lib/emails/day3.ts:42:    <p style="font-size:15px;color:#CCC;margin:8px 0;">Provider loyalty: often another <strong style="color:#fff;">$50-$100/year</strong></p>
lib/emails/day3.ts:43:    <p style="font-size:18px;color:#B5936B;font-weight:700;margin:16px 0 0;">Total: $230-$280/year saved</p>
lib/city-botox-prices.ts:17:        range: '$12–$17',
=== PER_UNIT_WORDING ===
app/about/page.tsx:130:                                desc: 'We collect real per-unit pricing and compare each provider against their local market average. You see whether a clinic charges above, at, or below the norm for your city — before you walk in the door.'
app/api-access/page.tsx:191:                                <div><span className="text-[#3D2B1F]/70">max_price</span> <span className="text-gray-700">number</span> — Maximum price per unit</div>
app/badge/page.tsx:112:                                        desc: 'Clinic must have confirmed per-unit pricing transparency for at least one major neurotoxin brand.',
app/botox-buyers-guide/page.tsx:264:                                    { title: "No upfront per-unit pricing", desc: "Legitimate providers give you the price before you sit down. 'It depends on your consultation' is a trap that ends in an oversized bill." },
app/botox-buyers-guide/page.tsx:383:                                    { pts: 25, title: "Fair Pricing", desc: "Every provider's per-unit cost is compared to their city average. Pricing transparency is rewarded — 'call for consultation' is penalized." },
app/botox-buyers-guide/page.tsx:502:                                        "Confirmed per-unit pricing is stated upfront",
app/calculator/CalculatorClient.tsx:269:    // Get price per unit based on city + toxin + calculated tier
app/claim/[slug]/edit/EditForm.tsx:81:                        <p className="text-sm text-[#3D2B1F]/60 font-light">Listing your real cost-per-unit strengthens your Transparency Signal within our proprietary algorithm.</p>
app/claim/[slug]/edit/EditForm.tsx:191:                        <p className="text-sm text-[#3D2B1F]/60 font-light">List the treatments you offer so patients can find you. The treatments you offer don&apos;t change your Clarity Score™; publishing your price per unit does.</p>
app/claim/[slug]/page.tsx:69:                                Profiles with unlisted pricing are filtered out by 65% of our users. Adding your cost-per-unit increases lead conversion significantly.
app/claim/page.tsx:67:                                Stop being compared on price without context. List your per-unit rates and specialized treatment packages to attract the right patients.
app/docs/page.tsx:22:            { name: 'max_price', type: 'number', required: false, description: 'Maximum price per unit in USD' },
app/docs/page.tsx:351:                            { label: 'Published Pricing', weight: '10%', icon: <Zap className="w-5 h-5" />, description: 'A published per-unit neurotoxin price.' },
app/injectors/[state]/[city]/page.tsx:53:        ? `Compare ${providerCount} Botox & filler injectors in ${cityName}. See price per unit (from $${avgPrice}), confirmed credentials and patient reviews side by side. No paid placement. Updated ${month} ${year}.`
app/injectors/[state]/[city]/page.tsx:170:                        {stats?.avgCost ? ` Local market analysis shows average pricing in ${cityName} is currently $${stats.avgCost} per unit.` : ''}
app/injectors/[state]/[city]/page.tsx:323:                                    with an average Botox price of <strong style={{ color: 'var(--color-espresso)' }}>${stats?.avgCost || 14} per unit</strong> as of {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.
app/methodology/page.tsx:46:        items: [['10', 'The provider publishes a per-unit price for Botox or a comparable neurotoxin.']],
app/pulse/page.tsx:8:    description: 'Contribute to the largest independent Botox pricing index. Share your per-unit cost and patient experience to help others find fair, high-quality care.',
app/pulse/page.tsx:121:                                        What did you pay per unit?
app/treatments/[treatment]/[state]/[slug]/page.tsx:83:                    "text": `In ${cityName}, the average cost for ${treatment.name} is approximately $${stats?.avgCost || 15} per unit. Total treatment session costs typically range from $${(stats?.avgCost || 15) * (treatment.slug.includes('masseter') ? 40 : 15)} to $${(stats?.avgCost || 15) * (treatment.slug.includes('masseter') ? 60 : 25)} depending on your anatomy.`
```

---

*Proposed only. No copy change in this document is merged or applied.
Cleanup needs its own approval and its own commit, separate from the
widget branch.*
