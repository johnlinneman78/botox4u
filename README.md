# InjectorIndex (injectorindex.com) 💉

The premium platform connecting aesthetic patients with top-tier Botox and regenerative medicine providers across the United States. Powered by **Clarity Score™** intelligence and **Clinical Quality Ratio™** benchmarks.

## 🚀 2026 Platform Overhaul

The platform has been fully modernized and optimized for the next generation of aesthetic research:

- **Clarity Score™ Intelligence:** A proprietary scoring system (1-10) based on verified safety data, board credentials, price transparency, and verified patient satisfaction.
- **Elite Audit™ Reports:** Rich-HTML clinical audits delivered directly to patient inboxes, eliminating PDF friction and providing instant regional benchmarks.
- **Advanced pSEO Architecture:** A high-performance hierarchical URL structure (`/botox/[state]/[city]`) optimized for local search authority and zero-duplicate content.
- **Regenerative Focus:** Tracking the **Clinical Quality Ratio™** (PNs, Exosomes, Biostimulators) to help patients find clinics meeting 2026 biological standards.
- **Standardized Domain:** Unified host authority under `https://www.injectorindex.com` with server-level SSL and subdomain enforcement.
- **2026 Stability Audit:** Resolved 100% of major 404 errors found in the initial SEO crawl, including city patterns, blog redirects, and the provider claim system.

## 🏆 Technical Excellence

The platform is engineered for speed, stability, and conversion:
- **Zero-Friction Claims:** Refactored provider claim system using `getProviderBySlug` for 100% data consistency.
- **Enterprise SEO:** Dynamic `robots.txt` and tiered sitemaps (`sitemap-index-main.xml`) ensure efficient crawl budget utilization.
- **Global Context:** Integrated Ahrefs Analytics and Google Tag Manager for deep conversion tracking.
- **User Support:** Dedicated FAQ architecture and medical disclaimer systems to improve trust signals and E-E-A-T.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Dynamic Rendering)
- **Styling:** Tailwind CSS v4 (Modern High-Performance Engine)
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Backend Logics:** Server Actions with optimized audit processing
- **Email:** Resend (High-deliverability rich HTML templates)
- **Validation:** Zod + React Hook Form
- **Deployment:** Vercel (Edge-optimized)

## 📦 Getting Started

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   RESEND_API_KEY=your_key
   CONTACT_EMAIL=reports@injectorindex.com
   NEXT_PUBLIC_APP_URL=https://www.injectorindex.com
   ```

3. **Run Dev:**
   ```bash
   npm run dev
   ```

## 🌐 SEO & Sitemaps

The platform uses a tiered sitemap structure to optimize crawl budget:
- `sitemap-index-main.xml`: The primary index entry point.
- `sitemap-pages.xml`: Core landing pages and state-level authority pages.
- `sitemap-cities.xml`: Localized city pages.
- `sitemap-blog.xml`: Educational resource content.

## 🕷️ Research Infrastructure

We use automated discovery to gather real-world data from provider websites.

### Setup
1. **Initialize Python Environment:**
   ```bash
   py -3.12 -m venv .venv
   .\.venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   .\.venv\Scripts\pip install crawl4ai
   .\.venv\Scripts\crawl4ai-setup
   ```

---
© 2026 InjectorIndex. Independent data for the regenerative medicine era.