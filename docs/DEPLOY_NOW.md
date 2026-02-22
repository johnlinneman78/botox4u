# 🚀 Deploy to Vercel - Step by Step

**Status:** ✅ Code pushed to GitHub  
**Repository:** `johnlinneman78/injectorindex`  
**Branch:** `main`

---

## 📋 Step-by-Step Instructions

### Step 1: Open Vercel Dashboard
1. Go to: **https://vercel.com/new**
2. Sign in with GitHub (if not already)

### Step 2: Import Repository
1. Click **"Import Git Repository"**
2. Find `johnlinneman78/injectorindex` in the list
3. Click **"Import"**

### Step 3: Configure Project
**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** `./` (leave as default)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**DO NOT CHANGE** these - they're correct!

### Step 4: Add Environment Variables
Click **"Environment Variables"** section and add these **3 required variables**:

#### Variable 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://[your-project].supabase.co
```

**How to get:**
1. Go to Supabase Dashboard
2. Click your project
3. Settings → API → Project URL
4. Copy the URL

#### Variable 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJ... (long string)
```

**How to get:**
1. Same Supabase Settings → API page
2. Find "anon public" key
3. Click "Reveal" and copy

#### Variable 3: Supabase Service Role Key
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJ... (long string)
```

**How to get:**
1. Same Supabase Settings → API page
2. Find "service_role" key
3. Click "Reveal" and copy
4. ⚠️ **IMPORTANT:** Keep this secret!

#### Optional Variable 4: Resend API Key (for emails)
```
Name: RESEND_API_KEY
Value: re_...
```

**Skip this for now** - you can add it later when you set up email notifications.

### Step 5: Deploy!
1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. Watch the build logs

---

## ✅ What to Expect

### During Deployment (2-3 minutes)
You'll see:
- ✓ Cloning repository
- ✓ Installing dependencies
- ✓ Building application
- ✓ Deploying to edge network
- ✓ Assigning domain

### If Successful ✅
- You'll see: **"Congratulations! Your project is live"**
- You'll get a URL like: `https://injectorindex.vercel.app`
- Click **"Visit"** to see your live site!

### If Build Fails ❌
**Most likely cause:** Missing environment variables

**Solution:**
1. Go to Project Settings → Environment Variables
2. Add the 3 Supabase variables
3. Click "Redeploy" in Deployments tab

---

## 🧪 Testing Your Live Site

### Test 1: Homepage
Visit: `https://your-app.vercel.app/`

**Should see:**
- ✅ Hero section with "Find Botox Providers"
- ✅ Featured cities
- ✅ Navigation menu
- ✅ Footer

### Test 2: City Page
Visit: `https://your-app.vercel.app/botox/new-york-ny`

**Should see:**
- ✅ "Botox in New York" heading
- ✅ Provider listings (or "No providers found")
- ✅ Cost stats
- ✅ FAQ section

### Test 3: Find Providers
Visit: `https://your-app.vercel.app/find-providers`

**Should see:**
- ✅ Search interface
- ✅ Filters (city, state, treatment)
- ✅ Provider cards

### Test 4: Lead Form
1. Click on a provider
2. Click "Request Quote"
3. Fill out form
4. Submit

**Should see:**
- ✅ Success message
- ✅ Lead appears in Supabase `leads` table

---

## 🔧 If Something's Not Working

### Issue: Pages show "500 Internal Server Error"
**Cause:** Missing environment variables

**Fix:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the 3 Supabase variables
3. Deployments tab → Click "..." → Redeploy

### Issue: Providers not showing
**Cause:** Database not connected or no data

**Fix:**
1. Check Supabase - did you run `schema.sql`?
2. Check environment variables are correct
3. Check Vercel logs for errors

### Issue: Lead form doesn't submit
**Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY`

**Fix:**
1. Add the service role key to Vercel env vars
2. Redeploy

### Issue: Build fails with TypeScript errors
**Cause:** Next.js 16 async params issue

**Fix:**
1. Go to your repo on GitHub
2. Edit `package.json`
3. Change `"next": "16.1.6"` to `"next": "15.1.0"`
4. Commit and push
5. Vercel will auto-redeploy

---

## 📊 After Successful Deployment

### Immediate (Next 10 minutes)
- [ ] Test all 4 pages above
- [ ] Submit a test lead
- [ ] Check Supabase for the lead
- [ ] Share URL with a friend for feedback

### Within 1 Hour
- [ ] Set up custom domain (optional)
- [ ] Configure Google Search Console
- [ ] Submit sitemap
- [ ] Set up Google Analytics

### Within 24 Hours
- [ ] Add 5 more real providers
- [ ] Send first provider outreach email
- [ ] Monitor Vercel logs
- [ ] Check for any errors

---

## 🎯 Your Live URLs

**Homepage:**
`https://injectorindex.vercel.app/`

**City Pages:**
- `https://injectorindex.vercel.app/botox/new-york-ny`
- `https://injectorindex.vercel.app/botox/los-angeles-ca`
- `https://injectorindex.vercel.app/botox/miami-fl`

**Find Providers:**
`https://injectorindex.vercel.app/find-providers`

**Sitemap:**
`https://injectorindex.vercel.app/sitemap.xml`

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Homepage loads without errors
- [ ] At least 1 city page works
- [ ] Provider cards display
- [ ] Lead form submits successfully
- [ ] Mobile responsive (test on phone)
- [ ] HTTPS enabled (automatic)
- [ ] No console errors

**If all checked:** 🎊 **YOU'RE LIVE!**

---

## 📞 Quick Reference

**Vercel Dashboard:**
https://vercel.com/dashboard

**Your Project:**
https://vercel.com/johnlinneman78/injectorindex

**Deployments:**
https://vercel.com/johnlinneman78/injectorindex/deployments

**Settings:**
https://vercel.com/johnlinneman78/injectorindex/settings

**Logs:**
https://vercel.com/johnlinneman78/injectorindex/logs

---

## 🚀 Next Steps

**After successful deployment, follow:**
- `docs/MVP_WEEK1_PLAN.md` - Your week 1 execution plan
- `docs/DEPLOYMENT_CHECKLIST.md` - Post-deployment tasks
- `docs/SECURITY_QUICK_START.md` - Add disclaimers to pages

**Goal for Week 1:**
- 3-5 cities live
- 15-25 providers listed
- 1 real lead received
- 3-5 provider responses

---

**You're about to go live!** 🚀

Just follow the steps above and you'll have a production-ready MVP in 5 minutes!
