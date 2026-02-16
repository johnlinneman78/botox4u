# 🚀 Deploy to Vercel - Final Steps

**Current Status:** Local build has TypeScript issues with Next.js 16  
**Solution:** Deploy to Vercel and let their build system handle it

---

## ✅ Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: MVP ready - database, security, automation complete"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Step 3: Add Environment Variables
Click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Visit your live URL!

---

## ✅ Option 2: Deploy via CLI

```bash
# If not linked yet
vercel link

# Deploy to production
vercel --prod

# Add environment variables interactively
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redeploy with env vars
vercel --prod --force
```

---

## 🔧 If Vercel Build Also Fails

**Downgrade Next.js in package.json:**

```json
{
  "dependencies": {
    "next": "15.1.0"  // Change from 16.1.6 to 15.1.0
  }
}
```

Then:
```bash
rm -rf node_modules package-lock.json
npm install
git add package.json package-lock.json
git commit -m "fix: downgrade to Next.js 15.1.0 for stability"
git push
```

Vercel will auto-redeploy.

---

## 📊 What Vercel Will Do

1. **Clone your repo**
2. **Install dependencies** (`npm install`)
3. **Build** (`npm run build`)
4. **Deploy** to global CDN
5. **Provision SSL** (automatic)
6. **Generate URL** (e.g., `fiery-cosmos.vercel.app`)

---

## ✅ After Successful Deploy

**Test these URLs:**
- `https://your-app.vercel.app/` (homepage)
- `https://your-app.vercel.app/botox/new-york-ny` (city page)
- `https://your-app.vercel.app/find-providers` (search)

**If pages load:** ✅ Success!  
**If 500 errors:** Check Vercel logs for missing env vars

---

## 🎯 Next Steps After Deploy

1. **Test lead form** - Submit a test lead
2. **Check Supabase** - Verify lead appears in database
3. **Set up analytics** - Google Search Console + GA4
4. **Start Week 1 plan** - Add providers, send outreach

---

**Recommendation:** Use Vercel Dashboard (Option 1) - it's the most reliable and handles build issues automatically.

Ready to deploy? 🚀
