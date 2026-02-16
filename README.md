# National Botox Directory (Botox-4U)

The ultimate platform connecting aesthetic patients with top-tier Botox and filler providers across the United States.

## 🚀 Key Features

- **Directory Search:** Advanced geolocation-based search for providers.
- **Cost Calculator:** Interactive tool for patients to estimate treatment pricing.
- **Programmatic SEO:** Dynamic city pages (e.g., `/botox/los-angeles`) optimized for local search results.
- **Provider Hub:** Secure dashboard for clinics to manage their listing, view leads, and upgrade their tier.
- **Lead Generation System:** Multi-step inquiry forms with instant email notifications for providers.
- **SaaS Monetization:** Stripe-powered subscription tiers (Featured & Premium).

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Modern Engine)
- **Database & Auth:** Supabase
- **Payments:** Stripe
- **Email:** Resend
- **Validation:** Zod + React Hook Form

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
   STRIPE_SECRET_KEY=your_key
   RESEND_API_KEY=your_key
   ```

3. **Run Dev:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

Deployed via **Vercel**. Simply connect this repository to your Vercel dashboard and configure the environment variables mentioned above.
