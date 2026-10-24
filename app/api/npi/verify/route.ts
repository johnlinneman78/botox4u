import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy for the CMS NPI Registry lookup used by the claim
// verification form. The registry API does not send CORS headers, so the
// form's old browser-side fetch to npiregistry.cms.hhs.gov was blocked by
// the browser and every verification attempt failed with "Verification
// service unavailable" — even though the registry itself was up and
// answering. Server-to-server calls are not subject to CORS.
export async function GET(req: NextRequest) {
    const number = req.nextUrl.searchParams.get('number') || ''

    if (!/^\d{10}$/.test(number)) {
        return NextResponse.json({ error: 'Invalid NPI number' }, { status: 400 })
    }

    try {
        const response = await fetch(
            `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${number}`
        )

        if (!response.ok) {
            return NextResponse.json({ error: 'Registry lookup failed' }, { status: 502 })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('NPI verify proxy failed:', error)
        return NextResponse.json({ error: 'Registry unreachable' }, { status: 502 })
    }
}
