import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'

// Consumer quiz signups are the demand list: a visitor answers the
// pricing quiz and leaves an email to get the full price guide.
//
// This route used to write through the visitor's cookie-session
// client and return success in every code path: when the database
// call errored (it upserted a `lead_source` column that does not
// exist on the production leads table), and even when no Supabase
// client could be built at all. A live test on 2026-10-23 confirmed
// the result: the page told the visitor a guide had been sent while
// the leads table gained no row. The write now runs server side with
// the service-role key, uses only columns that exist, and failure is
// returned as failure so the page can say so honestly.
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, answers, source } = body

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) {
            console.error('quiz-submit: Supabase service credentials missing')
            return NextResponse.json({ error: 'Signup is unavailable right now' }, { status: 500 })
        }
        const supabase = createClient(supabaseUrl, serviceKey)

        // Quiz answers arrive keyed by question index. Only fields the
        // quiz actually asks for are mapped, onto columns that exist.
        const cityTier = answers?.[2]?.tier || 'major'
        const treatment = answers?.[1]?.value || 'forehead'
        const experience = answers?.[3]?.value || 'first_time'
        const priority = answers?.[4]?.value || 'value'

        const { data: inserted, error } = await supabase
            .from('leads')
            .insert({
                // leads.full_name is NOT NULL with no default (the table
                // was built for provider lead forms). The quiz collects
                // email only, so record that truthfully instead of
                // inventing a name. (Production error 23502, 2026-10-23.)
                full_name: 'Not provided (pricing quiz)',
                email,
                city: cityTier,
                treatment_type: treatment,
                is_first_timer: experience === 'first_time',
                additional_metadata: {
                    source: source || 'botox_price_quiz',
                    quiz_answers: answers ?? null,
                    experience,
                    priority,
                    city_tier: cityTier,
                    submitted_at: new Date().toISOString()
                }
            })
            .select('id')

        if (error) throw error
        if (!inserted || inserted.length === 0) {
            throw new Error('Lead insert matched no rows')
        }

        // Notify John that a quiz signup landed. Fire-and-forget: it
        // must never break or delay the visitor's signup. No code
        // before this point emailed John about quiz signups — the
        // visitor's drip enrollment (via /api/subscribe, called
        // separately by the quiz component) only emails the visitor.
        // Skipped silently when no Resend key is configured.
        try {
            const apiKey = process.env.RESEND_API_KEY?.trim()
            if (!apiKey) {
                console.warn('quiz-submit notify skipped: no RESEND_API_KEY (signup unaffected)')
            } else {
                const resend = new Resend(apiKey)
                const notifyTo = process.env.QUIZ_NOTIFY_EMAIL?.trim() || 'urielpro78@gmail.com'
                const sender = process.env.FROM_EMAIL?.trim() || NICHE.outreach.senderEmail
                const submittedAt = new Date().toISOString()
                // Log the outcome either way. The Resend SDK returns
                // API rejections (e.g. unverified-domain 403) as a
                // result.error object instead of throwing, so an
                // earlier version that only awaited the call recorded
                // nothing on failure — the Oct 23 11:59 PM outage was
                // invisible for exactly this reason.
                const { data: sent, error: sendError } = await resend.emails.send({
                    from: `InjectorIndex <${sender}>`,
                    to: [notifyTo],
                    subject: 'New quiz signup',
                    text: [
                        'New pricing-quiz signup on InjectorIndex.',
                        `Email: ${email}`,
                        `Treatment: ${treatment}`,
                        `City tier: ${cityTier}`,
                        `First timer: ${experience === 'first_time' ? 'yes' : 'no'}`,
                        `Submitted: ${submittedAt}`,
                    ].join('\n'),
                })
                if (sendError) {
                    console.error('quiz-submit notify rejected (signup unaffected):', sendError)
                } else {
                    console.log('quiz-submit notify sent:', sent?.id, 'to', notifyTo, 'from', sender)
                }
            }
        } catch (notifyError) {
            console.error('quiz-submit notify failed (signup unaffected):', notifyError)
        }

        return NextResponse.json({ success: true, leadId: inserted[0].id })
    } catch (error) {
        console.error('quiz-submit error:', error)
        return NextResponse.json({ error: 'Could not save your signup' }, { status: 500 })
    }
}
