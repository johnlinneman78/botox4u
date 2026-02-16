# 🎯 What Goes Where - Quick Reference

**You got a SQL error because you tried to run React code in Supabase!**

Here's what goes where:

---

## 📊 Supabase (Database) - SQL Only

**File:** `supabase/schema.sql`

**What to do:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy/paste the ENTIRE `supabase/schema.sql` file
4. Click "Run"

**This creates:**
- ✅ `providers` table (with 9 sample providers)
- ✅ `leads` table (empty, ready for submissions)
- ✅ Row Level Security policies
- ✅ Privacy compliance functions

**DO NOT** put TypeScript/React code here!

---

## 💻 Next.js App (Frontend/Backend) - TypeScript/React

**Files you created:**
- `components/legal/MedicalDisclaimer.tsx` ← React component
- `lib/validation.ts` ← TypeScript utilities
- `lib/actions/leads.ts` ← Server actions

**What to do:**
1. Add disclaimers to your pages (see below)
2. Build and deploy

**DO NOT** run these in Supabase SQL Editor!

---

## 🔧 How to Add Disclaimers to Pages

### City Pages
**File:** `app/botox/[slug]/page.tsx`

```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

export default async function CityPage({ params }: { params: { slug: string } }) {
  // ... existing code ...
  
  return (
    <div>
      {/* ... existing content ... */}
      
      {/* Add before closing div */}
      <MedicalDisclaimer />
    </div>
  )
}
```

### Provider Pages
**File:** `app/provider/[slug]/page.tsx`

```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

export default async function ProviderPage({ params }: { params: { slug: string } }) {
  // ... existing code ...
  
  return (
    <div>
      {/* ... existing content ... */}
      
      {/* Add after provider details */}
      <MedicalDisclaimer variant="compact" />
    </div>
  )
}
```

### Footer (All Pages)
**File:** `components/layout/Footer.tsx`

```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

export function Footer() {
  return (
    <footer>
      {/* ... existing footer content ... */}
      
      {/* Add at bottom of footer */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <MedicalDisclaimer variant="inline" />
      </div>
    </footer>
  )
}
```

---

## ✅ Step-by-Step Deployment

### Step 1: Supabase Setup (5 min)
1. Open https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in sidebar
4. Click "New Query"
5. Copy/paste ENTIRE contents of `supabase/schema.sql`
6. Click "Run"
7. Verify: Should see "Success. 9 rows affected" (or similar)

### Step 2: Add Disclaimers (5 min)
1. Edit `app/botox/[slug]/page.tsx` - add `<MedicalDisclaimer />`
2. Edit `app/provider/[slug]/page.tsx` - add `<MedicalDisclaimer variant="compact" />`
3. Edit `components/layout/Footer.tsx` - add `<MedicalDisclaimer variant="inline" />`

### Step 3: Build & Deploy (10 min)
```bash
# Option A: Downgrade Next.js (recommended for quick deploy)
npm install next@15.1.0
npm run build
vercel --prod

# Option B: Fix TypeScript types (if you want latest Next.js)
# (I can help with this if you choose this path)
```

---

## 🚨 Common Mistakes

### ❌ WRONG: Running React code in Supabase
```sql
-- This will ERROR in Supabase SQL Editor
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
```

### ✅ RIGHT: Running SQL in Supabase
```sql
-- This works in Supabase SQL Editor
CREATE TABLE providers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);
```

### ❌ WRONG: Running SQL in Next.js files
```tsx
// Don't put this in .tsx files
CREATE TABLE leads (...)
```

### ✅ RIGHT: Running TypeScript in Next.js files
```tsx
// This goes in .tsx files
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
```

---

## 📋 Quick Checklist

**Supabase (Database):**
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Verify 9 providers created
- [ ] Verify RLS policies enabled

**Next.js (App):**
- [ ] Add disclaimers to city pages
- [ ] Add disclaimers to provider pages
- [ ] Add disclaimer to footer
- [ ] Build succeeds
- [ ] Deploy to Vercel

**Environment Variables:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- [ ] `RESEND_API_KEY` in Vercel (optional for now)

---

## 🎯 What You Should Do Right Now

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Copy/paste `supabase/schema.sql`**
4. **Click Run**
5. **Verify success**

Then come back and we'll add the disclaimers to your pages!

---

**TL;DR:**
- 📊 **Supabase = SQL** (database schema)
- 💻 **Next.js = TypeScript/React** (app code)
- 🚫 **Don't mix them!**
