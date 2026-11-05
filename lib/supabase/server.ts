import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-component client, @supabase/ssr only (see lib/supabase/client.ts
// for why auth-helpers must not come back here).
export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Called from a Server Component; setting cookies
                        // here is best-effort only.
                    }
                },
            },
        }
    )
}
