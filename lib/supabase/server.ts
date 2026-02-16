import { createServerClient } from '@supabase/auth-helpers-nextjs'

export const createClient = async () => {
    // We dynamically import next/headers inside the function to prevent 
    // the "next/headers" leak into client components during the build phase.
    const { cookies } = await import('next/headers')
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
                        // Safe to ignore in Server Components
                    }
                },
            },
        }
    )
}
