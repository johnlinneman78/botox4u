import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        // Return a mock or handle this gracefully during build
        console.warn('Supabase environment variables are missing')
        return null as any
    }

    return createBrowserClient(url, key)
}
