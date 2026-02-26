import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const host = request.headers.get('host')

    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

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
