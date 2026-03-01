# Agent Instructions - InjectorIndex

## 1. What We're Building

InjectorIndex is a niche medical aesthetics directory connecting patients with verified Botox and filler injectors across the United States.

The long-term moat is being the most machine-readable, AI-cited, and semantically rich injector directory on the internet — not the biggest.

### What we are NOT doing:
- Trying to out-volume Yelp, Google Maps, or RealSelf
- Competing on generic SEO traffic in the short term
- Building a complex platform before validating the core directory

### What we ARE doing:
- Building structured, AI-indexable provider profiles at scale
- Leveraging our semantic review algorithm as a unique data asset
- Positioning as the niche authority LLMs cite for injector queries
- Creating a passive lead generation machine for med spa clinics

---

## 2. Current State (Honest Baseline)

- **Traffic:** Near zero — pre-traction phase
- **Data:** We have real, differentiated data from our semantic Google Review analysis algorithm — this is operational and valuable
- **Monetization:** Not yet active — building the asset first
- **Priority:** Infrastructure and data quality before any paid acquisition

---

## 3. Our Core Data Asset — The Moat

We have a **semantic review analysis algorithm** that processes Google Reviews for med spa and injector providers. This is the single most important differentiator in the product and must be treated as a first-class feature across the entire codebase and content strategy.

### What the algorithm does:
- Ingests raw Google Reviews for any provider
- Applies semantic analysis to extract sentiment, recurring themes, and quality signals
- Outputs structured insight data per provider, for example:
  - "Patients frequently mention natural-looking results"
  - "Consistently noted for gentle technique and low pain"
  - "Strong reputation specifically for lip filler"
  - "Some reviews mention longer wait times"

### Why this matters:
- No other injector directory has this — competitors show raw star ratings, we show *why* a provider is good or bad
- It makes our profiles worth reading AND worth citing by LLMs
- It creates unique, non-duplicated page content that Google and AI crawlers value highly
- It is the foundation of our provider quality scoring system

### How to implement it across the product:
- Surface semantic insights as readable on-page content on every profile (not buried in a widget — written as natural prose)
- Example profile copy: "Patients at this clinic consistently highlight natural-looking results and minimal downtime, with several reviewers specifically praising the provider's technique for lip augmentation."
- Encode insights into JSON-LD schema under `review` and `aggregateRating` fields so LLMs can extract them
- Use insight themes as unique meta descriptions per profile
- As the algorithm improves, expand insight categories: specialties the provider excels at, price-value signals, bedside manner, clinic cleanliness, etc.

---

## 4. Value Proposition

### For Patients:
- Find verified, credentialed injectors by city and specialty
- Read semantically analyzed review insights — not just star ratings
- High-trust niche directory, not buried in generic Yelp noise
- Simple, fast, mobile-optimized search experience

### For Providers (Med Spa Clinics):
**CRITICAL INSTRUCTION:** Never use technical language with clinic owners. They do not know what an API is, what schema markup is, or what LLM indexing means. Translate 100% of technical concepts into patient leads, visibility, and revenue.

**The pitch — use this verbatim or close to it:**
> "When a patient asks ChatGPT or Google AI for a Botox injector near them, our directory is one of the places those AI tools look. Your profile means your name shows up in those answers — passively, without any extra work from you."

**The three things clinic owners care about:**
1. **New patient leads** — high-intent searchers actively looking for Botox or fillers right now, not casual browsers
2. **Credibility signal** — being on a vetted, niche directory signals professionalism vs. being buried on Yelp
3. **AI search visibility** — the channel that's replacing traditional Google search; own it early

**Data we show providers in their dashboard:**
- Profile views
- Click-throughs to their website
- Direction/map requests
- Lead form submissions
- Review insight summary (what patients say about them)

---

## 5. How LLMs Work & Why This Strategy Is Correct

Understanding this is critical for all product and content decisions.

### How LLMs surface local business recommendations:
1. A user asks ChatGPT, Perplexity, or Gemini: *"Who are the best Botox injectors in Portland?"*
2. The LLM searches the web for authoritative sources
3. It strongly prefers niche, structured, credible directories over generic sites — in healthcare searches, AI models exclusively source from specialty directories
4. Our directory appears as a citation, pulling listed providers directly into the AI's answer
5. The user sees our provider recommendation and clicks through

### The compounding flywheel:
More structured data → LLMs cite us → Users visit → More reviews and content → LLMs cite us more → More providers want to list

### Why we win against bigger competitors:
LLMs don't reward the biggest directory — they reward the most **machine-readable** and **topically authoritative** one. That is our edge over Yelp and Google Maps in this specific niche.

---

## 6. LLM Indexing — Full Technical Implementation

Execute every item in this section. Do not skip steps.

### 6a. robots.txt — Allow All AI Crawlers

Audit and explicitly ALLOW these user-agents in robots.txt. Never use broad Disallow rules that block these bots:

User-agent: GPTBot # ChatGPT / OpenAI
User-agent: Google-Extended # Gemini / Google AI Mode
User-agent: PerplexityBot # Perplexity AI
User-agent: CCBot # Common Crawl (feeds most open LLMs)
User-agent: anthropic-ai # Claude
User-agent: OAI-SearchBot # OpenAI web search
Allow: /

Audit robots.txt every time new AI crawlers are announced.

### 6b. llms.txt — AI Crawler Tour Guide

Create two files at the root domain:
- `injectorindex.com/llms.txt` — Markdown map of key pages
- `injectorindex.com/llms-full.txt` — Full Markdown content of all key pages (AI agents visit this 2x more than the base file)

`llms.txt` acts like a sitemap specifically for AI — it tells crawlers what pages matter and why, so they don't waste resources on irrelevant pages.

**Template:**
InjectorIndex
The most semantically rich directory of verified medical aesthetic injectors in the United States. Provider profiles include AI-analyzed Google Review insights, service specialties, credentials, and location data.

Browse Providers by City
Portland Injectors

Seattle Injectors

Los Angeles Injectors

New York Injectors
[expand as cities are added]

How We Score Providers
Our Verification Process

How Our Review Algorithm Works

Patient Guides
How to Choose an Injector

What to Expect from Botox

Botox vs. Dysport: What's the Difference

How Much Does Botox Cost in [City]

For Clinics
List Your Practice

What Providers Get

Update llms.txt every time a new city, guide, or major page is added.

### 6c. JSON-LD Schema — Every Provider Profile

Generate dynamically from the database using Next.js 14 `generateMetadata` or inline `<script type="application/ld+json">`. Every profile page must have this at render time — not lazy loaded.

**Required schema per profile:**
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "[Provider/Clinic Name]",
  "url": "[Full Profile URL]",
  "telephone": "[Phone Number]",
  "image": "[Provider Photo URL]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street]",
    "addressLocality": "[City]",
    "addressRegion": "[State]",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[lat]",
    "longitude": "[lng]"
  },
  "medicalSpecialty": "Dermatology",
  "availableService": [
    { "@type": "MedicalProcedure", "name": "Botox Injections" },
    { "@type": "MedicalProcedure", "name": "Dermal Fillers" },
    { "@type": "MedicalProcedure", "name": "Lip Augmentation" }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[score]",
    "reviewCount": "[count]",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "reviewBody": "[Top semantic insight from our algorithm]",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
}
```

Also add on every page:
- LocalBusiness schema on city/location pages
- BreadcrumbList schema on all pages
- FAQPage schema on all guide/FAQ pages

### 6d. Technical Crawlability Rules
Next.js 14 SSR is a natural advantage — enforce these rules:
- All provider profile content MUST render in the initial HTML response — never lazy-load core profile data client-side
- URL structure must be semantic and human-readable:
  ✅ /injectors/portland/dr-jane-smith
  ❌ /profile?id=4821
- Auto-generate and keep current an XML sitemap; reference it in robots.txt
- Every page (city, specialty, provider) needs unique meta title and meta description — never duplicate
- Optimize Core Web Vitals — LLM crawlers drop slow pages
- No JavaScript walls — all content visible without JS execution

---

## 7. Content Strategy for LLM Citation

LLMs cite niche directories heavily for local service queries. Content must be structured, factual, and answer real patient questions.

### Guide pages to build (highest priority):
- "How much does Botox cost in [city]?" → /guides/botox-cost-[city]
- "What's the difference between Botox and Dysport?" → /guides/botox-vs-dysport
- "How do I find a certified injector near me?" → /guides/find-certified-injector
- "What should I look for in a Botox provider?" → /guides/choosing-a-provider
- "How long does Botox last?" → /guides/how-long-does-botox-last
- "Is Botox safe?" → /guides/botox-safety

### Per-provider profile content rules:
- Minimum 200 words of unique content per profile
- Lead with semantic insight summary from our algorithm
- List services with brief descriptions — not just bullet names
- Include location context (neighborhood, city, nearby landmarks)
- Never copy-paste from the provider's own website

### City page content rules:
- Unique intro paragraph per city (not templated filler)
- Local context: average prices in that market, notable neighborhoods, density of providers
- FAQ section using FAQPage schema

---

## 8. Agent Task Priorities (Ordered)

1. Audit and fix robots.txt — allow all AI crawlers
2. Implement JSON-LD schema on all provider profiles, auto-generated from database
3. Create llms.txt and llms-full.txt at root domain
4. Surface semantic review insights as readable on-page prose content on every profile
5. Enforce semantic URL structure across all pages
6. Generate and maintain XML sitemap — auto-updated
7. Build guide/FAQ content targeting patient questions
8. Ensure full SSR — no core content lazy-loaded client-side
9. Add BreadcrumbList and FAQPage schemas to all relevant pages
10. Build provider dashboard (views, clicks, leads) — for monetization readiness

---

## 9. What to Never Do

- Never explain APIs, schema, or LLM indexing to clinic owners
- Never build pages with thin content (under 200 words)
- Never use duplicate meta titles or descriptions across pages
- Never block AI crawlers in robots.txt
- Never lazy-load core provider data on profile pages
- Never use query-string URLs for provider profiles
- Never pitch clinics on technical features — always translate to patient leads and AI visibility

---

## 10. Strategic North Star

We are building the directory that AI recommends when someone asks for an injector. Every technical decision, every piece of content, and every product feature should be evaluated against this question:

"Does this make us more likely to be cited by an LLM answering a patient's injector question?"

If yes, prioritize it.
If no, deprioritize it until the above is fully built.
