# ⏸️ Resume Instructions
**Last Session:** 2026-02-16 (Deployment Success)

## 📍 Where We Left Off
We successfully deployed the MVP to Vercel! The site is live at:
👉 **https://fiery-cosmos.vercel.app**

However, the **database is not connected** because we haven't added the Environment Variables to Vercel yet.

## 🛑 security Warning
Your local `.env.local` file has a **Security Issue**. It uses the **Service Role Key** (Admin) as the **Anon Key** (Public).
**DO NOT** copy the local Anon Key to Vercel. You must get the correct one from the Supabase Dashboard.

## ▶️ Immediate Actions for Next Session

1.  **Open Supabase & Vercel:**
    -   Supabase: `https://supabase.com/dashboard/project/tgqgsmaqmyeguapcogel/settings/api`
    -   Vercel: `https://vercel.com/john-linnemans-projects/fiery-cosmos/settings/environment-variables`

2.  **Add Envrionment Variables to Vercel:**
    -   `NEXT_PUBLIC_SUPABASE_URL`: `https://tgqgsmaqmyeguapcogel.supabase.co`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: **[Get from Supabase Dashboard - 'anon' key]**
    -   `SUPABASE_SERVICE_ROLE_KEY`: **[Get from Supabase Dashboard - 'service_role' key]**
    -   `NEXT_PUBLIC_APP_URL`: `https://fiery-cosmos.vercel.app`

3.  **Redeploy:**
    -   Go to Vercel Deployments -> Redeploy.

4.  **Test:**
    -   Submit a lead form on the live site to verify DB connection.

See `docs/DEPLOYMENT_SUCCESS.md` for the detailed guide we created.
