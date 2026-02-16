# National Botox Directory - Design Document

**Date:** February 15, 2026  
**Project:** National Botox Directory  
**Status:** Design Complete - Ready for Implementation

---

## Executive Summary

Building a production-ready, national directory website for Botox and cosmetic injection providers across all 50 US states. This is a full-scale implementation optimized for local SEO, AI search results, programmatic content generation, and multiple revenue streams.

**Market Opportunity:** Competitive analysis reveals a significant gap in the market. While RealSelf.com dominates with broad cosmetic procedure coverage, there is NO well-executed Botox-specific directory with programmatic SEO. Smaller competitors have weak technical implementation and limited coverage.

**Timeline:** 3-month modular development with incremental launches
- **Phase 1 (4 weeks):** Core directory with 100 cities → Launch
- **Phase 2 (3 weeks):** Programmatic SEO expansion to 500+ pages
- **Phase 3 (3 weeks):** Provider self-service tools
- **Phase 4 (2 weeks):** Monetization activation

---

## Competitive Intelligence Summary

### Primary Competitor: RealSelf.com
- **Domain Authority:** 75-85 (very high)
- **Monthly Traffic:** 2.54M visits
- **Backlinks:** 2.09M from 22,950 domains
- **Weaknesses:**
  - Not Botox-focused (diluted across 100+ procedures)
  - High bounce rate (56.54%)
  - Limited programmatic SEO
  - Not optimized for AI search

### Secondary Competitors: bestaestheticinjectors.com, findmycosmeticinjector.com
- **Domain Authority:** 15-30 (low)
- **Weaknesses:**
  - Thin content
  - No programmatic SEO
  - Poor technical implementation
  - No monetization strategy

### Our Competitive Advantages:
1. **Botox-specific focus** vs broad marketplace
2. **Programmatic SEO at scale** (500+ pages at launch)
3. **Price transparency** (interactive calculator, real data)
4. **AI-optimized content** (structured data, FAQs, quick answers)
5. **Medical authority** (expert-reviewed content)
6. **Superior UX** (Premium Authority design aesthetic)
7. **Multiple revenue streams** (listings + leads + affiliates)

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components (no shadcn - we want unique design)
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Context + Zustand (for complex state)

### Backend
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for images)
- **APIs:** 
  - Google Places API (provider data)
  - SendGrid (transactional emails)

### Payments & Monetization
- **Payment Processing:** Stripe
- **Subscriptions:** Stripe Subscriptions
- **Analytics:** Vercel Analytics + Google Analytics 4

### Deployment & Infrastructure
- **Hosting:** Vercel
- **CDN:** Vercel Edge Network
- **Domain:** TBD (recommend: botoxdirectory.com or findmybotox.com)
- **SSL:** Automatic via Vercel

### SEO & Performance
- **Sitemap:** next-sitemap
- **Schema:** Custom JSON-LD implementation
- **Performance:** Next.js Image optimization, ISR, edge functions

---

## Architecture Decisions

### Rendering Strategy (Hybrid Approach)

**Static Site Generation (SSG):**
- State pages (50 pages)
- Core resource pages
- Revalidate: 7 days

**Incremental Static Regeneration (ISR):**
- City pages (500+ pages)
- Provider profiles
- Revalidate: 24 hours (city pages), 12 hours (providers)

**Server-Side Rendering (SSR):**
- Search results
- Real-time filtering
- Dynamic provider discovery

**Client-Side Rendering (CSR):**
- Admin dashboard
- Provider portal
- Interactive tools (after initial load)

### Database Schema

**Core Tables:**
1. `providers` - Provider listings with all details
2. `reviews` - User reviews and ratings
3. `cities` - City data with computed averages
4. `states` - State data with aggregations
5. `provider_images` - Before/after, facility photos
6. `leads` - Lead generation tracking
7. `subscriptions` - Stripe subscription management
8. `seo_pages` - Programmatic page tracking

**Key Relationships:**
- Provider → Reviews (one-to-many)
- Provider → Images (one-to-many)
- Provider → Leads (one-to-many)
- Provider → Subscription (one-to-one)
- City → Providers (one-to-many)
- State → Cities (one-to-many)

---

## Design System: "Premium Authority"

### Visual Identity

**Typography:**
- **Display Font:** Crimson Pro (elegant serif for headings)
- **Body Font:** DM Sans (refined sans-serif for readability)
- **Code/Data:** JetBrains Mono (for pricing tables)

**Color Palette:**
```css
--color-primary: #1a2332 (Deep Navy)
--color-secondary: #b76e79 (Rose Gold)
--color-accent: #d4af37 (Soft Gold)
--color-background: #fafaf8 (Warm White)
--color-success: #6b8e7f (Sage Green)
--color-error: #c94d4d (Muted Red)
--color-text-primary: #1a1a1a
--color-text-secondary: #666666
--color-border: #e5e5e5
```

**Design Principles:**
1. **Sophistication:** Generous white space, subtle shadows, elegant typography
2. **Trust:** Medical credentials, verified badges, transparent pricing
3. **Data-Rich:** Beautiful tables, charts, comparison tools
4. **Accessibility:** WCAG 2.1 AA compliance
5. **Performance:** < 2.5s LCP, 95+ Lighthouse score

### Component Design Patterns

**Provider Card:**
- Clean card with subtle shadow
- Featured badge (gold accent)
- Star rating prominently displayed
- Price range clearly visible
- "Request Consultation" CTA (rose gold)

**Cost Calculator:**
- Interactive, step-by-step
- Visual feedback
- Smooth animations
- Instant results

**Comparison Tables:**
- Sortable columns
- Highlight best value
- Responsive design
- Export functionality

---

## URL Structure & Page Architecture

### URL Patterns

```
Homepage:
/

State Pages (50):
/botox/[state-slug]
Example: /botox/california

City Pages (500+):
/botox/[city-slug]-[state-code]
Example: /botox/los-angeles-ca

Provider Profiles:
/provider/[provider-slug]
Example: /provider/beverly-hills-aesthetics

Treatment Pages:
/[treatment]/[city-slug]-[state-code]
Example: /masseter-botox/dallas-tx

Cost Pages:
/botox-cost/[city-slug]-[state-code]
Example: /botox-cost/chicago-il

Comparison Pages:
/compare/[treatment-a]-vs-[treatment-b]
Example: /compare/botox-vs-dysport

Tools:
/cost-calculator
/find-providers

Resources:
/guide/botox-cost-guide
/guide/choosing-an-injector
/faq

Provider Portal:
/provider/login
/provider/dashboard
/provider/claim-listing

Admin:
/admin/dashboard
/admin/providers
/admin/reviews
```

### Page Templates

**City Page Structure:**
1. Hero with local data (average cost, provider count)
2. Quick Answer box (AI-optimized)
3. Provider listings (filterable, map + list view)
4. Cost breakdown table
5. FAQ section (10-15 questions with schema)
6. Nearby cities (internal linking)
7. Local statistics

**Provider Profile Structure:**
1. Header (logo, name, badges, rating)
2. Key info (address, phone, hours, map)
3. Services & pricing
4. Credentials & experience
5. Photo gallery (before/after, facility)
6. Reviews section
7. Lead generation form
8. Similar providers

---

## SEO Strategy

### On-Page SEO Template

**Meta Tags (City Page Example):**
```html
<title>Botox in [City], [State] - Cost, Reviews & Top Providers 2026</title>
<meta name="description" content="Find the best Botox injectors in [City]. Compare prices ($[min]-$[max]), read reviews, and book consultations. Average cost: $[avg]. [X] verified providers.">
<link rel="canonical" href="https://[domain]/botox/[city-slug]-[state-code]">
```

**Schema Markup (Comprehensive):**
1. MedicalBusiness schema (provider profiles)
2. LocalBusiness schema (with geo coordinates)
3. AggregateRating schema (reviews)
4. Review schema (individual reviews)
5. FAQPage schema (every page with FAQs)
6. BreadcrumbList schema (navigation)

### Content Strategy

**Programmatic Content Generation:**
- 50 state pages (launch)
- 100 city pages (Phase 1)
- 500+ city pages (Phase 2)
- 1,000+ long-tail pages (Phase 3)

**Content Quality Standards:**
- Minimum 800 words per city page
- Unique content (no duplication)
- Data-driven (real pricing, statistics)
- Medically reviewed
- Updated quarterly

**Keyword Targeting:**

**High-Value (Competitive):**
- botox cost (40,500 vol)
- botox near me (90,500 vol)
- how much is botox (33,100 vol)

**Medium Competition (Target First):**
- botox cost in [City] (100-1000/city)
- botox per unit cost [City] (50-500/city)
- cheap botox [City] (100-800/city)

**Low Competition (Quick Wins):**
- masseter botox cost [City] (50-300/city)
- botox for migraines cost (1,600 vol)
- lip filler and botox cost (880 vol)
- dysport vs botox cost (2,900 vol)

### Technical SEO

**Performance Targets:**
- Lighthouse Score: 95+ (all metrics)
- Core Web Vitals:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
- Mobile-First: Fully responsive
- Image Optimization: Next.js Image, WebP format

**Sitemap Structure:**
```
/sitemap.xml (index)
├── /sitemap-pages.xml
├── /sitemap-states.xml
├── /sitemap-cities-1.xml
├── /sitemap-cities-2.xml
├── /sitemap-providers-1.xml
└── /sitemap-providers-2.xml
```

---

## Monetization Strategy

### Revenue Streams

**1. Paid Listings (Primary Revenue)**

**Free Tier:**
- Basic listing
- Name, address, phone, website
- Standard placement

**Featured Tier ($99/month):**
- ⭐ Featured badge
- Top 3 placement in search results
- Enhanced profile
- Photo gallery (10 images)
- Review highlighting
- Basic analytics

**Premium Tier ($299/month):**
- 🏆 Premium badge
- #1 placement guarantee in their city
- Unlimited photos
- Video integration
- Priority lead notifications
- Advanced analytics
- Homepage rotation
- Social media badge

**2. Lead Generation (Alternative Model)**
- $20 per qualified lead
- Includes: name, email, phone, treatment interest
- Delivered via email + dashboard
- 24-hour response tracking

**3. Affiliate Revenue**
- Botox savings programs (Allē) - 10-15% commission
- Skincare products (Amazon) - 3-8% commission
- Financing partners - $50-100 per approval

**4. Advertising (After Scale)**
- Google AdSense (10k+ monthly visitors)
- Direct ad sales (50k+ monthly visitors)

### Stripe Integration

**Subscription Plans:**
- Monthly billing
- Annual discount (20% off)
- Free trial (14 days)
- Automatic renewal
- Cancellation anytime

**Payment Features:**
- Stripe Checkout
- Customer portal (self-service)
- Invoice generation
- Failed payment recovery
- Proration on upgrades

---

## Data Strategy

### Initial Data Population (Hybrid Approach)

**Phase 1: Manual Curation (Weeks 1-2)**
- 50-100 top providers in 10-20 major cities
- Focus on quality over quantity
- Verify all information
- Collect pricing data

**Phase 2: API Integration (Weeks 3-4)**
- Google Places API for basic info
- Yelp Fusion API (if budget allows)
- Automated data enrichment

**Phase 3: Provider Claims (Month 2+)**
- Providers claim and update listings
- Self-service data entry
- Verification process
- Ongoing data quality

**Phase 4: User-Generated Content (Month 3+)**
- Review submission
- Photo uploads
- Pricing updates

### Data Quality Standards

**Provider Verification:**
- Business license check
- Medical credentials verification
- Address validation
- Phone number verification

**Review Moderation:**
- Manual approval for first 100 reviews
- Automated filtering (profanity, spam)
- Verified patient badge (email confirmation)
- Response from providers

---

## Compliance & Legal

### Medical Disclaimers
- "Not medical advice" disclaimer on every page
- "Consult licensed professional" messaging
- Clear separation of educational vs promotional content

### Privacy & Data Protection
- HIPAA-safe lead forms (no PHI collection)
- Privacy policy (GDPR-compliant)
- Cookie consent
- Data retention policy

### FTC Compliance
- Clear disclosure of sponsored listings
- Affiliate link disclosures
- Transparent pricing methodology

### Terms of Service
- Provider listing terms
- User terms
- Review guidelines
- Refund policy

---

## Analytics & Tracking

### Key Metrics

**Traffic Metrics:**
- Organic search traffic
- Direct traffic
- Referral traffic
- Bounce rate by page type
- Time on site

**Conversion Metrics:**
- Lead form submissions
- Provider profile views
- Click-to-call events
- Website clicks
- Cost calculator usage

**SEO Metrics:**
- Keyword rankings (track top 100)
- Indexed pages
- Backlinks
- Domain authority
- SERP features won

**Revenue Metrics:**
- MRR (Monthly Recurring Revenue)
- Churn rate
- Lead conversion rate
- Average revenue per provider
- Lifetime value

### Tracking Implementation

**Google Analytics 4:**
- Custom events (lead submissions, calculator usage)
- Enhanced ecommerce (subscription tracking)
- User journey analysis

**Vercel Analytics:**
- Real-time performance
- Core Web Vitals
- Geographic distribution

**Custom Dashboard:**
- Provider analytics (views, leads, conversion)
- Admin dashboard (revenue, growth, top pages)

---

## Development Phases

### Phase 1: Core Directory (4 weeks) → Launch

**Week 1-2: Infrastructure**
- Next.js project setup
- Supabase configuration
- Database schema implementation
- Authentication system
- Design system components

**Week 3-4: Core Features**
- Homepage
- 100 city pages (top metros)
- Provider profile template
- Search functionality
- Cost calculator tool
- 50-100 curated provider listings

**Launch Criteria:**
- 100+ pages indexed
- 50+ providers listed
- All core features functional
- Mobile responsive
- Lighthouse score 90+

### Phase 2: Programmatic SEO (3 weeks) → Expand

**Week 5-6: Scale Content**
- 50 state pages
- Expand to 300 city pages
- 100 long-tail keyword pages
- Internal linking structure
- Sitemap optimization

**Week 7: Content Depth**
- Treatment-specific pages
- Comparison pages
- Resource guides
- FAQ expansion

**Expansion Criteria:**
- 500+ pages indexed
- Comprehensive internal linking
- All schema markup implemented
- 1,000+ organic visits/day

### Phase 3: Provider Tools (3 weeks) → Enable Claims

**Week 8-9: Provider Portal**
- Provider authentication
- Dashboard (analytics, leads)
- Listing management
- Photo upload
- Claim listing workflow

**Week 10: Admin Tools**
- Admin dashboard
- Provider approval system
- Review moderation
- Bulk import tools

**Completion Criteria:**
- Providers can claim listings
- Self-service updates working
- Admin moderation functional
- Email notifications active

### Phase 4: Monetization (2 weeks) → Revenue

**Week 11: Stripe Integration**
- Subscription plans
- Checkout flow
- Customer portal
- Webhook handling
- Invoice generation

**Week 12: Launch & Polish**
- Featured/Premium badges
- Lead form integration
- Analytics dashboards
- Final testing
- Marketing launch

**Revenue Criteria:**
- Payment processing live
- First paid subscribers
- Lead generation active
- Affiliate links implemented

---

## Success Metrics

### Month 3 Targets
- 500+ pages indexed
- 2,000-5,000 organic visits/day
- 100+ provider listings
- 5-10 paid subscribers
- $500-1,000 MRR

### Month 6 Targets
- 1,000+ pages indexed
- 10,000-20,000 organic visits/day
- 300+ provider listings
- 20-30 paid subscribers
- $2,000-3,000 MRR
- Ranking for 50+ keywords (top 10)

### Month 12 Targets
- 5,000+ pages indexed
- 50,000-100,000 organic visits/day
- 1,000+ provider listings
- 100+ paid subscribers
- $10,000-30,000 MRR
- Ranking for 500+ keywords (top 10)
- Competing with RealSelf for Botox-specific searches

---

## Risk Mitigation

### Technical Risks
- **Risk:** Slow page generation with ISR
- **Mitigation:** Optimize queries, implement caching, use edge functions

- **Risk:** Database performance at scale
- **Mitigation:** Proper indexing, query optimization, read replicas if needed

### SEO Risks
- **Risk:** Google penalty for thin content
- **Mitigation:** Phased rollout, quality standards, unique content per page

- **Risk:** Competitor backlink advantage
- **Mitigation:** PR strategy, linkable assets, partnership outreach

### Business Risks
- **Risk:** Low provider adoption
- **Mitigation:** Free tier, easy claim process, clear value proposition

- **Risk:** Slow revenue growth
- **Mitigation:** Multiple revenue streams, flexible pricing, lead gen alternative

---

## Next Steps

1. **Review and approve this design document**
2. **Create detailed implementation plan** (task-by-task breakdown)
3. **Set up development environment**
4. **Begin Phase 1 development**

---

**Design Status:** ✅ Complete and validated
**Ready for Implementation:** Yes
**Estimated Timeline:** 12 weeks to full launch
**Estimated Budget:** $0-500/month (Supabase free tier, Vercel free tier, Google Places API ~$100/month)
