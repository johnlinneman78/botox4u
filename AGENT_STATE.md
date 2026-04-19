# AGENT STATE — VerifiedAesthetics.com
**READ THIS FILE FIRST AT THE START OF EVERY SESSION.**
**UPDATE THIS FILE AND COMMIT IT AT THE END OF EVERY SESSION.**

This file is the single source of truth for where we are, what's done, and what's next.
If this file and your memory conflict, trust this file.

---

## ⚠️ CRITICAL PROJECT IDENTITY — READ BEFORE DOING ANYTHING
- **Project name**: VerifiedAesthetics (NOT fiery-cosmos, NOT botox4u, NOT InjectorIndex)
- **Live URL**: https://www.verifiedaesthetics.com
- **Vercel project**: `injectorindex` (org: `john-linnemans-projects`, ID: `prj_dhhPDqn6alh3lWBvmkxRGZyzPmsB`)
- **GitHub remote**: `https://github.com/johnlinneman78/botox4u` (legacy repo name — the project IS VerifiedAesthetics)
- **Branch**: `main`
- **Score branding**: Clarity Score™ (NOT TrueScore™)
- **Design system**: Warm linen spa editorial

## ⚠️ DEPLOYMENT RULES
1. **ALWAYS run `npx next build` locally before pushing** — if it fails, fix it first
2. **ALWAYS commit and push to `main`** — Vercel auto-deploys from GitHub
3. **If auto-deploy seems stuck, use `npx vercel --prod --yes`** to force-deploy
4. **ALWAYS verify the live site after deploy** — open https://www.verifiedaesthetics.com and confirm changes are visible
5. **NEVER deploy to any other Vercel project** — only `injectorindex`
6. **NEVER let changes accumulate locally without pushing** — push after every session

---

## CURRENT STATUS
**Active Phase:** 8 — Optimization & Maintenance
**Last Updated:** April 19, 2026
**Last Commit:** `f76e8a7` — feat(home): phase 2 cleanup - dynamic stats and placeholders
**Last Deploy:** April 19, 2026 — GitHub push to branch (brand-unify)
**Git Status:** Clean (0 uncommitted changes)
**Sessions Completed:** 5 (autonomous)

---

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

## WHAT TO DO RIGHT NOW
> This section always contains exactly one thing — the next unfinished task.

**Next task:** Phase 3 NPI enrichment strategy
**Details:** Enrich existing records via fuzzy name+address NPPES matching and city-wide discovery to update `npi_verified = true` and populate NPI records.
**Definition of done:** Existing DB providers matched; new city-wide discovery script active; transparent logging without deleting valid data.

---

## TECH STACK
- **Framework**: Next.js 16.1.6 (Turbopack)
- **CSS**: Tailwind CSS v4 + CSS custom properties in `globals.css`
- **Database**: Supabase
- **Hosting**: Vercel (project: `injectorindex`, brand: VerifiedAesthetics)
- **Email**: Resend.com
- **Analytics**: Google Analytics + Ahrefs
- **Config**: `config/niche.js` — single source of truth for branding

---

## PHASE COMPLETION STATUS

### PHASE 1–6 — ✅ COMPLETE (see history below)
All critical fixes, data cleanup, infrastructure, outreach, monetization, and maintenance tasks completed Feb 19, 2026.

### PHASE 7 — Redesign (March 2026)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| 7.1 Install design system fonts | ✅ Complete | Mar 3 | Cormorant Garamond + DM Sans via next/font/google |
| 7.2 Set up CSS variables + Tailwind config | ✅ Complete | Mar 3 | All tokens in globals.css + tailwind.config.ts |
| 7.3 Redesign homepage (Hero, HowItWorks, FeaturedProviders) | ✅ Complete | Mar 3 | New warm linen theme, Clarity Score branding |
| 7.4 Redesign Navbar + Footer | ✅ Complete | Mar 3 | New Navbar component, editorial footer |
| 7.5 Redesign provider cards + filters | ✅ Complete | Mar 3 | New card design, pill filters |
| 7.6 New UI components (Button, Card, Badge, etc.) | ✅ Complete | Mar 3 | Full component library |
| 7.7 Deploy redesign to production | ✅ Complete | Mar 3 | Live at verifiedaesthetics.com |
| 7.8 Post-redesign audit | ✅ Complete | Mar 5 | Fixed hydration mismatches, Lucide-react reference errors, and missing price data |

---

## COMPLETED TASKS LOG
*Agent appends to this list every time a task is finished.*

| Task | Completed | What was done | Files changed |
|------|-----------|---------------|---------------|
| 1.1–6.2 | Feb 19 | All Phase 1–6 tasks | See git history |
| 7.1–7.7 | Mar 3 | Complete site redesign + deploy | 70+ files, commit 6267468 |
| 7.9 | Mar 3 | Populated 22 target cities with 1,600+ real providers; fixed 404 city links on homepage | HomeClient.tsx, database |
| 7.10 | Mar 5 | Fixed critical hydration and reference errors; optimized SEO for provider pages; implemented 'Clinical Audit' style profiles | 27 files, commit 18e32e8 |
| 8.1–8.2 | Apr 19 | VerifiedAesthetics Rebrand Phase 1 (Unification) & Phase 2 (Homepage dynamic DB cleanup) | Configs, scripts, docs, pages |

---

## KNOWN ISSUES & BLOCKERS

| Issue | Phase | Needs Human? | Notes |
|-------|-------|-------------|-------|
| Yelp Fusion API requires manual application | 3.2 | YES | Cannot be automated |
| Some pages may still have old dark theme remnants | 7.8 | No | Audit needed |

---

## DECISIONS MADE
*Permanent record of strategic decisions so agent never re-debates them.*

| Decision | Chosen Option | Reason |
|----------|--------------|--------|
| Review display | Aggregate only + Google Maps link | Google ToS compliant |
| Hero image source | og:image from provider website | Legal, provider-controlled |
| 3-Provider Density | Show "Verifying" block if < 3 verified | Quality bar |
| Score branding | Clarity Score™ (not TrueScore™) | Brand evolution Mar 2026 |
| Design aesthetic | Warm linen spa editorial | Target audience: women 28-45 researching aesthetics |
| Deploy method | Push to main → Vercel auto-deploy | Simplest, most reliable |

---

## SESSION PROTOCOL
**Every session, the agent must:**

1. Read this file completely before writing a single line of code
2. Confirm: "Resuming VerifiedAesthetics — task [X.X]. Last deploy: [date]. Git status: [clean/dirty]."
3. Complete one task fully before starting the next
4. **Build locally before pushing**: `npx next build`
5. **Push and verify deploy**: `git push origin main`, then check https://www.verifiedaesthetics.com
6. Mark completed tasks with ✅ and add to Completed Tasks Log
7. Update "What to do right now" to the next task
8. Commit this file: `git add AGENT_STATE.md && git commit -m "chore: update agent state"`
9. End session: "Session complete. Deployed commit [hash]. Next task: [X.X]. AGENT_STATE.md updated."
