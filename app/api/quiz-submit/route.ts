import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

        return NextResponse.json({ success: true, leadId: inserted[0].id })
    } catch (error) {
        console.error('quiz-submit error:', error)
        return NextResponse.json({ error: 'Could not save your signup' }, { status: 500 })
    }
}
