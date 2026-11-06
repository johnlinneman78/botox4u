import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseCoordinateStrings } from '@/lib/utils/geo'

// Comma-separated list of emails allowed into /admin, e.g. "you@example.com".
// If it is unset, /admin is closed to everyone.
function isAdminEmail(email: string | undefined | null): boolean {
    if (!email) return false
    const allowed = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)
    return allowed.includes(email.toLowerCase())
}

export async function middleware(request: NextRequest) {
    // Singapore bot block (Nov 6, 2026): ~26% of CDN requests arrive via the
    // Singapore edge as automated crawls (824 GA users, 0s engagement, zero
    // key events, ~2,970 requests/day). No real audience in SG, so turn
    // those requests away before any page, auth, or database work runs.
    // Only an explicit SG blocks; unknown or missing geo is allowed through.
    if (request.headers.get('x-vercel-ip-country') === 'SG') {
        return new NextResponse('Not available in your region.', { status: 403 })
    }

    const path = request.nextUrl.pathname

    // Public pages need nothing from auth: let them through without the
    // Supabase round-trip. (Middleware now runs on every page so the SG
    // block covers the homepage and city pages, not just /provider/*.)
    if (
        !path.startsWith('/provider') &&
        !path.startsWith('/admin') &&
        path !== '/find-providers'
    ) {
        return NextResponse.next()
    }

    // @supabase/ssr middleware pattern: one client for login, dashboard and
    // middleware alike (see lib/supabase/client.ts). The old auth-helpers
    // middleware client disagreed with the dashboard's SSR client about
    // whether a provider was signed in, which produced the Nov 4
    // login↔dashboard redirect loop.
    let supabaseResponse = NextResponse.next({
        request,
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
                    // RequestCookies.set takes (name, value) only in this
                    // Next version; attributes ride on the response below.
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Admin pages: signed in AND on the ADMIN_EMAILS allowlist
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/provider/login', request.url))
        }
        if (!isAdminEmail(user?.email)) {
            return new NextResponse('Not found', { status: 404 })
        }
        return supabaseResponse
    }

    // Protect dashboard routes
    if (path.startsWith('/provider/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/provider/login', request.url))
        }
    }

    // Redirect to dashboard if logged in and trying to access login/register
    if (user && (path === '/provider/login' || path === '/provider/register')) {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url))
    }

    // Intercept incoming legacy coordinate URLs on /find-providers before tracker/analytics execution
    if (path === '/find-providers') {
        const searchParams = request.nextUrl.searchParams
        if (searchParams.has('lat') || searchParams.has('lng')) {
            const rawLatStr = searchParams.get('lat')
            const rawLngStr = searchParams.get('lng')

            const cleanUrl = new URL(request.url)
            cleanUrl.searchParams.delete('lat')
            cleanUrl.searchParams.delete('lng')
            cleanUrl.searchParams.set('sort', 'distance')

            const redirectRes = NextResponse.redirect(cleanUrl, 307)

            // Validate complete coordinate strings before conversion and saving to HttpOnly cookie
            const parsedCoords = parseCoordinateStrings(rawLatStr, rawLngStr)
            if (parsedCoords) {
                redirectRes.cookies.set('user_geo', JSON.stringify(parsedCoords), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                })
            }

            return redirectRes
        }
    }

    return supabaseResponse
}

export const config = {
    // Every page, so the SG block covers the homepage, city pages, provider
    // pages, blog, etc. — except API routes, Next internals, and files.
    // /api stays out on purpose: the Vercel cron hits /api/digest, and API
    // routes are not what fires the GA tag.
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
