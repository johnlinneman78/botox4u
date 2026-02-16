import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // MAINTENANCE MODE: Block all requests except Next.js assets
    const path = request.nextUrl.pathname

    if (path.startsWith('/_next') || path.startsWith('/static')) {
        return NextResponse.next()
    }

    return new NextResponse(
        `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Under Maintenance</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f9f9f9; color: #333; }
          .container { text-align: center; padding: 2rem; }
          h1 { margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Site Temporarily Unavailable</h1>
          <p>We are performing critical security updates.</p>
          <p>Please check back soon.</p>
        </div>
      </body>
    </html>
    `,
        {
            status: 503,
            headers: { 'content-type': 'text/html' }
        }
    )
}

export const config = {
    matcher: '/:path*',
}
