import { createBrowserClient } from '@supabase/ssr'

// Single browser client for the whole app (login, signup, claim, new,
// set-password, unsubscribe). Must match the server/middleware client in
// lib/supabase/server.ts, lib/supabase/factory.ts and middleware.ts: all of
// them use @supabase/ssr, so a session created here is recognised there.
// Mixing in @supabase/auth-helpers-nextjs caused the Nov 4 dashboard loop
// (login succeeded, dashboard redirected back to login forever).
export const createClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
