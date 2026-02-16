# 🎯 MVP Launch Plan - Week 1 Focus

**Goal:** Ship a working directory with 3-5 cities and validate the funnel  
**Timeline:** Next 10-15 hours  
**Success Metric:** 1 real lead forwarded to 1 real provider

---

## 🎯 Phase 1: Deploy & Test (2-3 hours)

### Step 1.1: Fix Build & Deploy (1-2h)
- [x] Fix route conflicts
- [x] Fix missing server actions
- [ ] Verify build completes
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if ready)
- [ ] SSL certificate auto-provisioned

**Commands:**
```bash
npm run build                    # Verify build works
vercel --prod                    # Deploy to production
```

### Step 1.2: Test Complete Funnel (1h)
Test every step manually:

1. **Homepage** → Featured cities visible
2. **City Page** (/botox/new-york-ny) → Providers listed
3. **Provider Card** → "Request Quote" button works
4. **Lead Form** → Submission successful
5. **Confirmation** → User sees success message
6. **Lead Storage** → Lead appears in Supabase
7. **Email Notification** → You receive email

**Checklist:**
- [ ] Homepage loads
- [ ] City pages render
- [ ] Provider cards display
- [ ] Lead form submits
- [ ] Leads stored in DB
- [ ] Email notifications work
- [ ] Mobile responsive
- [ ] No console errors

---

## 🌆 Phase 2: Launch 3-5 Cities (3-4 hours)

### Step 2.1: Select Cities
**Big Markets (1-2):**
- New York, NY
- Los Angeles, CA

**Mid-Market (1-2):**
- Miami, FL
- Portland, OR

**Stretch (optional 5th):**
- Austin, TX

### Step 2.2: Create Essential Pages Per City
For each city, create these 3 pages:

1. **Main Directory:** `/botox/[city-slug]`
   - "Botox in [City]"
   - Provider listings
   - Cost ranges
   - Quick stats

2. **Cost Page:** `/botox/cost/[city-slug]`
   - "Botox Cost in [City]"
   - Detailed pricing breakdown
   - Cost comparison table
   - FAQ about pricing

3. **Treatment Page:** `/botox/masseter/[city-slug]`
   - "Masseter Botox in [City]"
   - Jaw slimming focus
   - Provider specialization
   - Treatment-specific FAQ

**Total Pages:** 3-5 cities × 3 pages = 9-15 pages

### Step 2.3: Add Real Providers (3-4h)

**Source:** Google Maps search for "botox [city]"

**Per City:** 3-5 providers (15-25 total)

**Data to Collect:**
- Business name
- Address
- Phone
- Website
- Google rating
- Estimated price (from website/call)
- Specialties

**Script to Add:**
```bash
# Use Notion update tool
npm run notion:update provider "Name" "City" "State" "Free"

# Or add directly to Supabase via SQL
```

**Providers to Target:**
- Med spas (primary)
- Dermatology clinics
- Plastic surgery practices
- High Google ratings (4.5+)
- Active websites

---

## 🎨 Phase 3: Polish Lighthouse Pages (2-3 hours)

### Step 3.1: Upgrade Top 4-6 Pages

**Pages to Polish:**
1. `/botox/new-york-ny`
2. `/botox/los-angeles-ca`
3. `/botox/cost/new-york-ny`
4. `/botox/masseter/new-york-ny`
5. `/` (homepage)
6. `/find-providers`

### Step 3.2: Required Elements Per Page

**✅ At a Glance Block:**
```
┌─────────────────────────────────────┐
│ Botox in New York - Quick Facts    │
├─────────────────────────────────────┤
│ Average Cost: $14-16/unit           │
│ Typical Treatment: $350-450         │
│ Verified Providers: 47              │
│ Average Rating: 4.8/5               │
└─────────────────────────────────────┘
```

**✅ Cost Comparison Table:**
| Treatment Area | Units Needed | Cost Range |
|---------------|--------------|------------|
| Forehead | 10-20 | $140-320 |
| Frown Lines | 15-25 | $210-400 |
| Crow's Feet | 12-24 | $168-384 |

**✅ 4-6 FAQs with Schema:**
- How much does Botox cost in [City]?
- Who are the best Botox injectors in [City]?
- How long does Botox last?
- Is Botox safe?
- What's the difference between Botox and fillers?
- How do I choose a provider?

**✅ Internal Links:**
- City page ↔ Cost page
- City page ↔ Treatment pages
- Provider cards → Provider details
- Footer → All cities

### Step 3.3: SEO Optimization

**Meta Tags:**
```html
<title>Best Botox in [City] | 2024 Pricing & Reviews</title>
<meta name="description" content="Find top-rated Botox injectors in [City]. Compare prices from 47 verified clinics, see patient reviews, and book consultations." />
```

**JSON-LD Schema:**
- LocalBusiness
- FAQPage
- AggregateRating
- BreadcrumbList

---

## 📧 Phase 4: Provider Outreach (2-3 hours)

### Step 4.1: Outreach Template

**Subject:** Free listing on new Botox directory - [City Name]

**Body:**
```
Hi [Provider Name],

I'm launching a Botox cost directory for [City] that helps patients find qualified providers and compare pricing.

I'd like to feature [Business Name] on the site during our beta launch. Here's what you get:

✓ Free profile with your info, pricing, and specialties
✓ Any patient leads from [City] forwarded directly to you
✓ No changes needed to your website
✓ No cost during beta (launching this week)

Your profile: [link to their page on your site]

Interested? Just reply "yes" and I'll activate your listing.

Best,
[Your Name]
[Your Directory URL]
```

### Step 4.2: Outreach Process

**Target:** 15-20 providers across 3-5 cities

**Method:**
1. Find contact form on their website
2. Send email to info@/contact@
3. Track in Notion (Outreach Status column)

**Goal:**
- 3-5 "yes" responses
- 1-2 providers ready to receive leads

**Tracking:**
```bash
# Log outreach in Notion
npm run notion:update marketing "Provider Outreach - [City]" "email" "Provider" "Sent" "High"
```

---

## 🔧 Phase 5: Analytics & Monitoring (1-2 hours)

### Step 5.1: Google Search Console
1. Add property: `https://yourdomain.com`
2. Verify ownership (DNS or HTML file)
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`
4. Request indexing for top 10 pages

### Step 5.2: Google Analytics
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`
3. Set up goals:
   - Lead form submission
   - Provider page view
   - Cost calculator usage

### Step 5.3: Lead Tracking
**Supabase Table:** `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  treatment TEXT,
  message TEXT,
  source_url TEXT,
  status TEXT DEFAULT 'new'
);
```

**Notion Integration:**
- Auto-sync leads to Notion (via daily sync)
- Or: Zapier/Make.com webhook

---

## 📊 Success Metrics - Week 1

### Must Have (Critical)
- [ ] Site deployed and live
- [ ] 3-5 cities with complete pages
- [ ] 15-25 real providers listed
- [ ] Lead form working end-to-end
- [ ] 1 lead received and forwarded
- [ ] GSC configured and sitemap submitted

### Should Have (Important)
- [ ] 3-5 providers responded positively
- [ ] First impressions in GSC (within 48h)
- [ ] Mobile responsive on all pages
- [ ] All lighthouse pages scoring 90+
- [ ] Email notifications working

### Nice to Have (Bonus)
- [ ] 10+ providers responded
- [ ] First organic click from Google
- [ ] Provider claimed their profile
- [ ] Social media accounts created
- [ ] First blog post published

---

## 🚫 What NOT to Do This Week

**Don't:**
- ❌ Build 50 cities
- ❌ Create complex pricing tiers
- ❌ Build provider dashboard
- ❌ Add payment processing
- ❌ Create content library
- ❌ Build review system
- ❌ Add booking integration
- ❌ Optimize for 100 keywords
- ❌ Write 20 blog posts
- ❌ Build mobile app

**Instead:**
- ✅ Focus on 3-5 cities
- ✅ Get 1 real lead
- ✅ Talk to 1 real provider
- ✅ Validate the funnel works
- ✅ See first Google impressions

---

## 📅 Hour-by-Hour Breakdown

### Hours 1-2: Deploy & Test
- Fix build errors
- Deploy to Vercel
- Test complete funnel
- Fix any critical bugs

### Hours 3-6: Add Providers
- Research providers on Google Maps
- Collect data (name, address, phone, website)
- Add to Supabase (15-25 providers)
- Verify pages render correctly

### Hours 7-9: Polish Pages
- Upgrade 4-6 lighthouse pages
- Add "At a Glance" blocks
- Create cost comparison tables
- Add 4-6 FAQs per page
- Optimize meta tags

### Hours 10-12: Provider Outreach
- Write outreach emails
- Send to 15-20 providers
- Track responses in Notion
- Follow up with interested providers

### Hours 13-15: Analytics & Monitoring
- Set up Google Search Console
- Configure Google Analytics
- Submit sitemap
- Request indexing for top pages
- Set up lead tracking

---

## 🎯 Simplified Notion OS

### Active Databases (Use Weekly)
1. **Development Tasks** - Track what you're building
2. **Keyword Research Hub** - Monitor rankings
3. **Programmatic Pages Tracker** - Track city pages
4. **Lead Log** (new or use Content Calendar)
5. **Provider Outreach** (new view in Provider DB)

### Inactive Databases (Ignore for Now)
- Financial Model (too early)
- Revenue Tracker (no revenue yet)
- KPI Tracker (wait for data)
- Advanced automation (not needed yet)

### Daily Routine
**Morning (5 min):**
```bash
npm run notion:sync
```

**As You Work:**
```bash
# Log tasks
npm run notion:update dev "Task" "Feature" "High" "Done" 2

# Log outreach
npm run notion:update marketing "Outreach" "email" "Provider" "Sent" "High"
```

**Evening (5 min):**
- Check for new leads
- Review GSC impressions
- Respond to provider emails

---

## 🔄 Next Steps After Week 1

**If you get 1+ leads and 3+ provider responses:**
1. Expand to 10 cities
2. Add 50 more providers
3. Launch paid tiers
4. Build provider dashboard

**If you get 0 leads but good traffic:**
1. Optimize lead forms
2. Add more CTAs
3. Improve provider listings
4. A/B test messaging

**If you get 0 traffic:**
1. Check GSC for indexing issues
2. Build more backlinks
3. Optimize for easier keywords
4. Create more content

---

## ✅ Week 1 Checklist

**Day 1 (Today):**
- [ ] Fix build and deploy
- [ ] Test complete funnel
- [ ] Add 5 providers to NYC

**Day 2:**
- [ ] Add providers to LA, Miami
- [ ] Polish 4 lighthouse pages
- [ ] Set up GSC and Analytics

**Day 3:**
- [ ] Send 15-20 outreach emails
- [ ] Add Portland providers
- [ ] Create cost pages

**Day 4:**
- [ ] Follow up on outreach
- [ ] Add treatment pages
- [ ] Monitor GSC for impressions

**Day 5:**
- [ ] Respond to provider questions
- [ ] Optimize based on early data
- [ ] Plan week 2 expansion

**Days 6-7:**
- [ ] Review metrics
- [ ] Forward any leads
- [ ] Document learnings
- [ ] Plan next phase

---

**Focus:** Ship fast, validate early, iterate based on real data.  
**Mantra:** 3-5 cities done well > 50 cities half-done.  
**Goal:** 1 real lead to 1 real provider = validation.

---

**Created:** 2026-02-16 01:56 AM  
**Timeline:** 10-15 hours  
**Next Review:** After first lead
