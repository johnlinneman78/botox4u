import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Cookie-free, anon-key Supabase client for public, cacheable reads
 * (homepage counts, sitemaps). It does not touch next/headers, so it is safe
 * in ISR pages and route handlers, and it never uses the service_role key.
 * Returns null (and logs) when config is missing so callers can fail loudly.
 */
export function createPublicClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    if (!url || !key) {
        console.error('[supabase/public] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
        return null
    }
    return createClient(url, key, { auth: { persistSession: false } })
}
