import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'

// Own-list signup: every email is saved in newsletter_subscribers first,
// so a signup is never silently dropped when Beehiiv is unconfigured.
export async function POST(req: NextRequest) {
    try {
        const { email, clinic, procedures, source } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
            process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
        )

        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .upsert(
                { email, source: source || 'blog-cta' },
                { onConflict: 'email' }
            )

        if (insertError) {
            console.error('Newsletter signup save failed:', insertError)
            return NextResponse.json({ error: 'Could not save signup. Please try again.' }, { status: 500 })
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
            // No newsletter platform connected: welcome them directly.
            // A sending failure never fails the signup itself — the email
            // is already saved above.
            try {
                const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build')
                await resend.emails.send({
                    from: `${NICHE.siteName} <${NICHE.outreach.senderEmail}>`,
                    to: email,
                    subject: `You're on the list — ${NICHE.siteName}`,
                    html: `<p>You're on the list for monthly Botox pricing updates, provider scores, and patient insights from ${NICHE.siteName}.</p><p>We'll write when there's something worth knowing.</p><p>You signed up at verifiedaesthetics.com.</p>`,
                })
            } catch (emailErr) {
                console.error('Newsletter welcome email failed:', emailErr)
            }
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Newsletter API error:', err)
        // Return success anyway to avoid revealing internals
        return NextResponse.json({ success: true })
    }
}
