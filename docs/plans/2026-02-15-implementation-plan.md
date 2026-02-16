# National Botox Directory - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready national Botox directory with programmatic SEO, provider self-service, and monetization features.

**Architecture:** Next.js 14 (App Router) + Supabase + Prisma (optional if node < 20) + Stripe, deployed on Vercel with hybrid rendering (SSG/ISR/SSR).

**Note on Node Version:** Since we have Node 24 now, we can use the latest tools.

---

## PHASE 1: CORE DIRECTORY (4 WEEKS) → LAUNCH

### Task 1: Project Setup & Infrastructure (DONE)
- Next.js 14 project created
- Core dependencies installed
- Environment variables template created
- Tailwind configured
- Supabase client utilities created
- Utility functions created

### Task 2: Supabase Setup & Database Schema (DONE)
- Schema defined in Prisma (though we might use Supabase dashboard directly for migration if needed)
- Note: We currently have the schema but need to ensure tables exist in Supabase.

### Task 3: Design System & Core UI Components (DONE)
- Global styles setup
- Button, Card, Badge components created
- Header and Footer layouts created

### Task 4: Homepage Implementation (DONE)
- Hero component created
- Featured Cities grid created
- How It Works section created
- Homepage assembled

---

### Task 5: Search & Provider Discovery System

**Files:**
- Create: `app/find-providers/page.tsx`
- Create: `components/providers/ProviderCard.tsx`
- Create: `components/providers/ProviderFilters.tsx`
- Create: `lib/actions/providers.ts`

**Step 1: Create ProviderCard component**
Create `components/providers/ProviderCard.tsx` with Premium Authority styling.

**Step 2: Create Search Results page**
Develop `app/find-providers/page.tsx` with SSR to handle search queries.

**Step 3: Implement search action**
Create `lib/actions/providers.ts` to fetch providers from Supabase based on query.

**Step 4: Commit search system**

---

### Task 6: City Pages (ISR Programmatic)

**Files:**
- Create: `app/botox/[city-slug]/page.tsx`
- Create: `components/city/CityHero.tsx`
- Create: `components/city/CityStats.tsx`
- Create: `components/city/CityFAQ.tsx`

**Step 1: Create City Page Template**
Build `app/botox/[city-slug]/page.tsx` using ISR.

**Step 2: Implement dynamic stats**
Calculate average costs and provider counts for each city.

**Step 3: Add FAQ Schema**
Generate FAQ schema dynamically for each city page.

**Step 4: Commit city pages**

---

### Task 7: Provider Profile Pages

**Files:**
- Create: `app/provider/[slug]/page.tsx`
- Create: `components/provider/ProfileHeader.tsx`
- Create: `components/provider/ProfileServices.tsx`
- Create: `components/provider/ProfileReviews.tsx`
- Create: `components/provider/LeadForm.tsx`

**Step 1: Build Profile Header**
Show logo, name, badges, and contact info.

**Step 2: Implement Lead Form**
Create a form that sends leads to Supabase and triggers email.

**Step 3: Create Services & Reviews sections**
Display provider-specific data.

**Step 4: Commit provider profiles**

---

### Task 8: Cost Calculator Tool

**Files:**
- Create: `app/cost-calculator/page.tsx`
- Create: `components/tools/CalculatorForm.tsx`
- Create: `components/tools/CalculatorResults.tsx`

**Step 1: Implement Calculator Logic**
Multi-step form for treatment area, units, and location.

**Step 2: Design Results View**
Show estimated range and matching providers.

**Step 3: Commit cost calculator**

---

### Task 9: Core Data Seeding & Mocking

**Files:**
- Create: `lib/data/seed.ts`
- Create: `lib/data/mock-providers.ts`

**Step 1: Create high-quality mock data**
Curate 50-100 providers in top 10 cities.

**Step 2: Seed Supabase**
Create a script to populate tables with initial data.

**Step 3: Commit seed data**

---

### Task 10: SEO & Sitemap Configuration

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `app/layout.tsx` (add metadata base)

**Step 1: Configure sitemap**
Set up `next-sitemap` to handle programmatic paths.

**Step 2: Add JSON-LD utilities**
Create helper to generate structured data for all page types.

**Step 3: Commit SEO config**

---

### Task 11: State Pages (SSG/ISR)
**Files:**
- Create: `app/botox/state/[slug]/page.tsx`
- Create: `components/state/StateHero.tsx`
- Create: `components/state/CityList.tsx`

**Step 1: Create State Page Template**
Show aggregate data for the state (avg cost, provider count) and a categorized list of cities.

**Step 2: Implement dynamic state metadata**
Generate title/description tags for all 50 states.

**Task 12: Treatment-Specific Pages (Programmatic)**
**Files:**
- Create: `app/[treatment]/[slug]/page.tsx` (e.g. `/masseter-botox/los-angeles-ca`)

**Step 1: Create Treatment Page Template**
Focus on specific use cases: Masseter, Crows Feet, TMJ, etc.

**Task 13: Internal Linking & UX Polish**
- Add "Nearby Cities" to city pages.
- Add breadcrumbs (Home > State > City).
- Improve mobile navigation.

**Task 14: Sitemap Expansion**
- Ensure all 50 states and 300+ target cities are in the sitemap.

---

## EXECUTION HANDOFF

**Plan complete.** Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration.

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints.

**Which approach?**
