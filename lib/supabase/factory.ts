'use server'

import { createServerClient } from '@supabase/ssr'

/**
 * Robust Supabase client factory for Server Actions and Server Components.
 * This is isolated to prevent "next/headers" leaks during the build process.
 *
 * @supabase/ssr only, matching lib/supabase/client.ts, lib/supabase/server.ts
 * and middleware.ts. The old auth-helpers route-handler client read a
 * different session cookie store than the dashboard's SSR client, which
 * produced the Nov 4 login↔dashboard redirect loop.
 */
export async function getSupabaseServer(cookieList: any) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim()

    if (!url || !key) {
        console.error('CRITICAL: Supabase configuration missing in production environment.')
        console.error('URL:', url ? 'Present' : 'MISSING')
        console.error('Key:', key ? 'Present' : 'MISSING')
        return null
    }

    try {
        const client = createServerClient(url, key, {
            cookies: {
                getAll() {
                    return typeof cookieList?.getAll === 'function' ? cookieList.getAll() : []
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieList?.set?.(name, value, options)
                        )
                    } catch {
                        // Server Actions may not be able to set cookies;
                        // session reads still work from getAll().
                    }
                },
            },
        })
        return client
    } catch (err) {
        console.error('Failed to initialize Supabase server client:', err)
        return null
    }
}
