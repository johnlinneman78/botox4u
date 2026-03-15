import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email, clinic, procedures } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
        }

        const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY
        const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUBLICATION_ID

        if (BEEHIIV_API_KEY && BEEHIIV_PUB_ID) {
            // Subscribe to Beehiiv
            const beehiivRes = await fetch(
                `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
                    },
                    body: JSON.stringify({
                        email,
                        reactivate_existing: true,
                        send_welcome_email: true,
                        utm_source: 'verifiedaesthetics-website',
                        utm_medium: 'clinic-audit-form',
                        custom_fields: [
                            { name: 'clinic', value: clinic || '' },
                            { name: 'procedures', value: (procedures || []).join(', ') },
                        ],
                    }),
                }
            )

            if (!beehiivRes.ok) {
                const error = await beehiivRes.text()
                console.error('Beehiiv error:', error)
                // Still return success to user — don't expose internal errors
            }
        } else {
            // Log in dev mode
            console.log('[Newsletter] Beehiiv not configured. Would have subscribed:', { email, clinic, procedures })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Newsletter API error:', err)
        // Return success anyway to avoid revealing internals
        return NextResponse.json({ success: true })
    }
}
