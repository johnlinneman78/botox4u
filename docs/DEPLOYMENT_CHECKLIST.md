# 🚀 Deployment Checklist - MVP Launch

**Status:** Build in progress  
**Target:** Vercel Production  
**Timeline:** Next 30 minutes

---

## ✅ Pre-Deployment (Complete)

- [x] Route conflicts resolved
- [x] Missing server actions added
- [x] Provider dashboard removed (not needed for MVP)
- [x] Build running successfully

---

## 🔧 Deployment Steps

### Step 1: Verify Build (5 min)
```bash
npm run build
```

**Expected Output:**
- ✓ Compiled successfully
- ✓ Route Manifest generated
- ✓ Static pages generated
- ✓ No errors

### Step 2: Deploy to Vercel (5 min)
```bash
vercel --prod
```

**Or via Vercel Dashboard:**
1. Connect GitHub repo
2. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (for emails)
4. Deploy

### Step 3: Configure Domain (5 min)
**Option A: Custom domain (Recommended)**
- `botox-4u.com` (configured in Vercel)
- Update DNS records if needed
- Wait for SSL provisioning (5-10 min)

### Step 4: Test Live Site (10 min)

**Critical Paths:**
1. **Homepage:** `https://yourdomain.com/`
   - [ ] Loads without errors
   - [ ] Featured cities visible
   - [ ] Navigation works

2. **City Page:** `https://yourdomain.com/botox/new-york-ny`
   - [ ] Page renders
   - [ ] Providers listed (or "no providers" message)
   - [ ] Cost stats visible
   - [ ] FAQ section present

3. **Find Providers:** `https://yourdomain.com/find-providers`
   - [ ] Search works
   - [ ] Filters functional
   - [ ] Provider cards display

4. **Provider Detail:** `https://yourdomain.com/provider/[slug]`
   - [ ] Page loads
   - [ ] "Request Quote" button visible
   - [ ] Contact info displayed

5. **Lead Form:**
   - [ ] Form submits
   - [ ] Success message shows
   - [ ] Lead stored in Supabase
   - [ ] Email notification sent

### Step 5: Mobile Testing (5 min)
- [ ] Responsive on iPhone (Safari)
- [ ] Responsive on Android (Chrome)
- [ ] Touch targets adequate
- [ ] No horizontal scroll

---

## 🔐 Environment Variables

**Required for Production:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Resend)
RESEND_API_KEY=re_...

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Add in Vercel:**
1. Project Settings → Environment Variables
2. Add each variable
3. Select "Production" environment
4. Save and redeploy

---

## 📊 Post-Deployment Setup

### Google Search Console (15 min)
1. Go to: https://search.google.com/search-console
2. Add property: `https://yourdomain.com`
3. Verify ownership:
   - **Method 1:** HTML file upload
   - **Method 2:** DNS TXT record
   - **Method 3:** Google Analytics
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`
5. Request indexing for:
   - Homepage
   - Top 3 city pages
   - Find providers page

### Google Analytics (10 min)
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `app/layout.tsx`:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```
4. Redeploy
5. Verify tracking in GA4 Realtime

### Supabase Tables (15 min)

**Create `providers` table:**
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  business_type TEXT,
  description TEXT,
  price_per_unit DECIMAL(10,2),
  min_treatment_price DECIMAL(10,2),
  listing_tier TEXT DEFAULT 'free',
  average_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  claimed BOOLEAN DEFAULT false,
  treatment_slugs TEXT[]
);

CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_state ON providers(state);
CREATE INDEX idx_providers_tier ON providers(listing_tier);
```

**Create `leads` table:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  treatment TEXT,
  message TEXT,
  source_url TEXT,
  provider_id UUID REFERENCES providers(id),
  status TEXT DEFAULT 'new'
);

CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
```

---

## 🎯 First 3 Cities Setup

### New York, NY
```sql
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier)
VALUES
  ('Manhattan Aesthetics', 'manhattan-aesthetics-ny', 'New York', 'NY', '123 5th Ave, New York, NY 10001', '(212) 555-0100', 'https://example.com', 'Medspa', 15.00, 'free'),
  ('NYC Dermatology', 'nyc-dermatology', 'New York', 'NY', '456 Park Ave, New York, NY 10022', '(212) 555-0200', 'https://example.com', 'Dermatology', 16.00, 'free'),
  ('Fifth Avenue Med Spa', 'fifth-avenue-med-spa', 'New York', 'NY', '789 Madison Ave, New York, NY 10065', '(212) 555-0300', 'https://example.com', 'Medspa', 14.50, 'free');
```

### Los Angeles, CA
```sql
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier)
VALUES
  ('Beverly Hills Aesthetics', 'beverly-hills-aesthetics', 'Los Angeles', 'CA', '123 Rodeo Dr, Beverly Hills, CA 90210', '(310) 555-0100', 'https://example.com', 'Medspa', 16.00, 'free'),
  ('LA Dermatology Center', 'la-dermatology-center', 'Los Angeles', 'CA', '456 Wilshire Blvd, Los Angeles, CA 90010', '(213) 555-0200', 'https://example.com', 'Dermatology', 15.50, 'free'),
  ('West Hollywood Med Spa', 'west-hollywood-med-spa', 'Los Angeles', 'CA', '789 Santa Monica Blvd, West Hollywood, CA 90069', '(323) 555-0300', 'https://example.com', 'Medspa', 14.00, 'free');
```

### Miami, FL
```sql
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier)
VALUES
  ('South Beach Aesthetics', 'south-beach-aesthetics', 'Miami', 'FL', '123 Ocean Dr, Miami Beach, FL 33139', '(305) 555-0100', 'https://example.com', 'Medspa', 13.50, 'free'),
  ('Miami Dermatology', 'miami-dermatology', 'Miami', 'FL', '456 Brickell Ave, Miami, FL 33131', '(305) 555-0200', 'https://example.com', 'Dermatology', 14.00, 'free'),
  ('Coral Gables Med Spa', 'coral-gables-med-spa', 'Miami', 'FL', '789 Miracle Mile, Coral Gables, FL 33134', '(305) 555-0300', 'https://example.com', 'Medspa', 12.50, 'free');
```

---

## 📧 Email Notification Setup

**Resend Configuration:**

1. Sign up at https://resend.com
2. Verify domain (or use resend.dev for testing)
3. Get API key
4. Add to Vercel environment variables

**Test Email:**
```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadNotification(lead: any) {
  await resend.emails.send({
    from: 'leads@yourdomain.com',
    to: 'your-email@gmail.com',
    subject: `New Lead: ${lead.name} - ${lead.city}`,
    html: `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>City:</strong> ${lead.city}</p>
      <p><strong>Treatment:</strong> ${lead.treatment}</p>
      <p><strong>Message:</strong> ${lead.message}</p>
      <p><strong>Source:</strong> ${lead.source_url}</p>
    `
  });
}
```

---

## ✅ Launch Checklist

### Pre-Launch
- [ ] Build completes successfully
- [ ] All environment variables set
- [ ] Supabase tables created
- [ ] Sample providers added (9 total)

### Launch
- [ ] Deploy to Vercel
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Site loads without errors

### Post-Launch
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Google Analytics tracking
- [ ] Email notifications working
- [ ] Lead form tested end-to-end

### First Hour
- [ ] Test all 3 city pages
- [ ] Submit for indexing
- [ ] Share with 1-2 friends for feedback
- [ ] Monitor Vercel logs for errors

### First Day
- [ ] Check GSC for crawl errors
- [ ] Verify Analytics data
- [ ] Test lead form from mobile
- [ ] Send first provider outreach email

---

## 🚨 Common Issues & Fixes

### Build Fails
- Check for TypeScript errors
- Verify all imports are correct
- Remove unused dependencies

### Site Loads Slowly
- Enable Vercel Edge caching
- Optimize images (use Next.js Image)
- Check Supabase query performance

### No Providers Showing
- Verify Supabase connection
- Check environment variables
- Test query in Supabase dashboard

### Lead Form Not Working
- Check Supabase RLS policies
- Verify email API key
- Test with console.log

### SEO Not Working
- Verify sitemap.xml loads
- Check robots.txt
- Ensure meta tags present

---

## 📊 Success Metrics - First 48 Hours

**Must Have:**
- [ ] Site deployed and accessible
- [ ] 0 build/runtime errors
- [ ] 3 city pages indexed by Google
- [ ] 1 test lead submitted successfully

**Should Have:**
- [ ] 10+ impressions in GSC
- [ ] 1+ organic click
- [ ] Mobile responsive confirmed
- [ ] Email notifications working

**Nice to Have:**
- [ ] Shared on social media
- [ ] First provider outreach sent
- [ ] Analytics showing real visitors
- [ ] Positive feedback from testers

---

**Next Steps After Deployment:**
1. Monitor Vercel logs for errors
2. Check Google Search Console daily
3. Send provider outreach emails
4. Iterate based on feedback

**Timeline:**
- **Now:** Build completing
- **+5 min:** Deploy to Vercel
- **+15 min:** Test live site
- **+30 min:** Configure analytics
- **+1 hour:** Add sample providers
- **+2 hours:** First outreach email sent

---

**Created:** 2026-02-16 02:02 AM  
**Status:** 🟡 Build in progress  
**Next:** Deploy to Vercel
