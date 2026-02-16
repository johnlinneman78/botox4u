import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/provider/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/provider/login', request.url))
        }
    }

    // Redirect to dashboard if logged in and trying to access login/register
    if (session && (request.nextUrl.pathname === '/provider/login' || request.nextUrl.pathname === '/provider/register')) {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/provider/:path*'],
}
