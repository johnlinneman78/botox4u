'use server'

import { createServerClient } from '@supabase/auth-helpers-nextjs'

/**
 * Robust Supabase client factory for Server Actions and Server Components.
 * This is isolated to prevent "next/headers" leaks during the build process.
 */
export async function getSupabaseServer(cookieList: any) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
