'use server'

import { createServerClient } from '@supabase/auth-helpers-nextjs'

/**
 * Robust Supabase client factory for Server Actions and Server Components.
 * This is isolated to prevent "next/headers" leaks during the build process.
 */
export async function getSupabaseServer(cookieList: any) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!url || !key) {
        console.warn('Supabase server variables missing')
        return null as any
    }

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieList.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieList.set(name, value, options)
                        )
                    } catch {
                        // Safe to ignore in Server Components
                    }
                },
            },
        }
    )
}
