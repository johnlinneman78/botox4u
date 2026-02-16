# ⏸️ Resume Instructions: SECURITY FIX REQUIRED

**Last Session:** 2026-02-16
**Status:** 🔴 SITE TAKEN DOWN (Maintenance Mode)

## 🚨 CRITICAL Security Situation
We disabled the live site because a **critical security vulnerability** was detected in your local config (Service Role Key used as Public Key).

The site is currently showing a "Site Temporarily Unavailable" page via `middleware.ts`.

## 🛠️ Step 1: Fix Security Credentials (FIRST)

1.  **Go to Supabase Dashboard:**
    [https://supabase.com/dashboard/project/tgqgsmaqmyeguapcogel/settings/api](https://supabase.com/dashboard/project/tgqgsmaqmyeguapcogel/settings/api)
    *   Find the `anon` / `public` key. It is NOT the `service_role` key.

2.  **Go to Vercel Dashboard:**
    [https://vercel.com/john-linnemans-projects/fiery-cosmos/settings/environment-variables](https://vercel.com/john-linnemans-projects/fiery-cosmos/settings/environment-variables)
    *   **DELETE** any existing `NEXT_PUBLIC_SUPABASE_ANON_KEY` if you added it.
    *   **ADD** the correct `anon` key as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    *   Add `NEXT_PUBLIC_SUPABASE_URL` if missing.
    *   Add `SUPABASE_SERVICE_ROLE_KEY` (secret) if missing.
    *   Add `NEXT_PUBLIC_APP_URL` (`https://fiery-cosmos.vercel.app`).

3.  **Fix Local Config:**
    *   Update your local `.env.local` to use the correct Anon key too!

## 🚀 Step 2: Restore Site (AFTER FIXING KEYS)

1.  **Restore the original middleware:**
    ```bash
    git mv middleware.ts.bak middleware.ts
    # (Or manually rename middleware.ts.bak back to middleware.ts)
    ```

2.  **Commit and Push:**
    ```bash
    git add middleware.ts
    git commit -m "restore: bring site back online with fixed security"
    git push
    ```

3.  **Redeploy:**
    ```bash
    npx vercel --prod
    ```

This will bring the site back live ONLY when you are ready.
