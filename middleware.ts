import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
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
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // Admin pages: signed in AND on the ADMIN_EMAILS allowlist
    if (path.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/provider/login', request.url))
        }
        if (!isAdminEmail(session.user?.email)) {
            return new NextResponse('Not found', { status: 404 })
        }
        return response
    }

    // Protect dashboard routes
    if (path.startsWith('/provider/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/provider/login', request.url))
        }
    }

    // Redirect to dashboard if logged in and trying to access login/register
    if (session && (path === '/provider/login' || path === '/provider/register')) {
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

    return response
}

export const config = {
    matcher: ['/provider/:path*', '/admin/:path*', '/find-providers'],
}
