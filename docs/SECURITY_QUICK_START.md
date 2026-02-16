# 🔒 Security & Compliance - Quick Implementation Guide

**Time:** 5 minutes  
**Impact:** Critical legal/security protection

---

## ✅ What's Already Done

1. ✅ **MedicalDisclaimer component** created
2. ✅ **Input validation utilities** created
3. ✅ **Documentation** complete

---

## 🚀 What You Need to Do Now

### Step 1: Add Disclaimers to Pages (3 minutes)

**Add to these files:**

1. **City Pages** - `app/botox/[slug]/page.tsx`
```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

// Add before the closing </div> of main content
<MedicalDisclaimer />
```

2. **Provider Pages** - `app/provider/[slug]/page.tsx`
```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

// Add after provider details
<MedicalDisclaimer variant="compact" />
```

3. **Cost Calculator** - `app/calculator/page.tsx`
```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

// Add at bottom of page
<MedicalDisclaimer />
```

4. **Homepage Footer** - `components/layout/Footer.tsx`
```tsx
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'

// Add in footer
<MedicalDisclaimer variant="inline" />
```

### Step 2: Update Lead Form Validation (2 minutes)

**File:** `lib/actions/leads.ts` (create if doesn't exist)

```typescript
'use server'

import { validateLeadForm, checkRateLimit } from '@/lib/validation'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

export async function submitLead(formData: FormData) {
    // Rate limiting
    const email = formData.get('email') as string
    if (!checkRateLimit(email, 5, 60000)) {
        return { 
            success: false, 
            error: 'Too many requests. Please try again in a minute.' 
        }
    }

    // Validate input
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        city: formData.get('city') as string,
        zipCode: formData.get('zipCode') as string,
        treatment: formData.get('treatment') as string,
        budgetRange: formData.get('budgetRange') as string,
        timeframe: formData.get('timeframe') as string,
        message: formData.get('message') as string,
    }

    const validation = validateLeadForm(data)
    if (!validation.isValid) {
        return { 
            success: false, 
            errors: validation.errors 
        }
    }

    // Store in database
    const supabase = await getSupabaseServer(await cookies())
    
    const { error } = await supabase
        .from('leads')
        .insert({
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            zip_code: data.zipCode,
            treatment: data.treatment,
            budget_range: data.budgetRange,
            timeframe: data.timeframe,
            message: data.message,
            source_url: formData.get('source_url') as string,
        })

    if (error) {
        console.error('Error submitting lead:', error)
        return { 
            success: false, 
            error: 'Failed to submit. Please try again.' 
        }
    }

    // TODO: Send email notification (add later)

    return { success: true }
}
```

### Step 3: Environment Variables Checklist

**Verify these are NOT in code:**
- [ ] No `NOTION_API_KEY` hardcoded
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` hardcoded
- [ ] No `RESEND_API_KEY` hardcoded

**Add to Vercel:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable
3. Select "Production" environment
4. Redeploy

---

## 🎯 Priority Order

**Must Do Before Launch:**
1. ✅ Add disclaimers to city pages
2. ✅ Add disclaimers to provider pages
3. ✅ Add validation to lead form
4. ✅ Move API keys to environment variables

**Should Do Week 1:**
5. ⏳ Add Privacy Policy page
6. ⏳ Add Terms of Service page
7. ⏳ Test rate limiting
8. ⏳ Monitor for spam

**Can Wait:**
9. ⏸️ CAPTCHA (only if spam becomes issue)
10. ⏸️ Advanced security audit
11. ⏸️ Legal review

---

## ✅ Quick Test

**After adding disclaimers:**
1. Visit a city page → See disclaimer
2. Visit a provider page → See compact disclaimer
3. Check homepage footer → See inline disclaimer
4. Submit lead form → Validation works

**If all pass:** ✅ Ready to deploy!

---

**Time Investment:** 5 minutes  
**Risk Reduction:** Massive  
**Legal Protection:** ✅ Covered
