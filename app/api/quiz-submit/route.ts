import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, answers, source } = body

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }

        const supabase = await getSupabaseServer(await cookies())

        if (!supabase) {
            return NextResponse.json({ success: true, leadId: null })
        }

        // Parse quiz answers for targeted storage
        const first_name = answers[0]?.text?.split(' ')[0] || 'Patient'
        const city_tier = answers[2]?.tier || 'major'
        const treatment = answers[1]?.value || 'forehead'
        const experience = answers[3]?.value || 'first_time'
        const priority = answers[4]?.value || 'value'

        // Save to Supabase Leads
        const { data: lead, error: dbError } = await supabase
            .from('leads')
            .upsert({
                email,
                full_name: first_name,
                city: city_tier,
                treatment_type: treatment,
                lead_source: source || 'botox_price_quiz',
                additional_metadata: {
                    quiz_answers: answers,
                    experience,
                    priority,
                    submitted_at: new Date().toISOString()
                }
            }, { onConflict: 'email' })
            .select()
            .single()

        if (dbError) {
            console.error('Supabase error:', dbError)
        }

        return NextResponse.json({ success: true, leadId: lead?.id })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
