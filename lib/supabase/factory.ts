'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

/**
 * Robust Supabase client factory for Server Actions and Server Components.
 * This is isolated to prevent "next/headers" leaks during the build process.
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
        const client = createRouteHandlerClient(
            { cookies: () => cookieList }
        )
        return client
    } catch (err) {
        console.error('Failed to initialize Supabase server client:', err)
        return null
    }
}
