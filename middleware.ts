import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

    return response
}

export const config = {
    matcher: ['/provider/:path*', '/admin/:path*'],
}
