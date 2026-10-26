import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/validation'

// Pulse survey submissions. The old /pulse form had no backend at all,
// so submits reloaded the page and dropped the data. This route saves
// each submission to pulse_submissions (created 2026-10-26) and only
// returns success after the insert succeeds, so the form never shows
// a fake confirmation. No name, email, or phone is collected here.
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const cityState = typeof body.cityState === 'string' ? body.cityState.trim() : ''
        const perUnitPrice = Number(body.perUnitPrice)
        const clinicName = typeof body.clinicName === 'string' && body.clinicName.trim() ? body.clinicName.trim().slice(0, 200) : null
        const satisfaction = body.satisfaction === null || body.satisfaction === undefined ? null : Number(body.satisfaction)

        if (!cityState) {
            return NextResponse.json({ error: 'Please enter your city and state.' }, { status: 400 })
        }
        if (Number.isNaN(perUnitPrice) || perUnitPrice <= 0 || perUnitPrice > 1000) {
            return NextResponse.json({ error: 'Please enter a per-unit price between $1 and $1,000.' }, { status: 400 })
        }
        if (satisfaction !== null && (!Number.isInteger(satisfaction) || satisfaction < 1 || satisfaction > 5)) {
            return NextResponse.json({ error: 'Satisfaction must be 1 to 5 stars.' }, { status: 400 })
        }

        const [cityPart, ...stateParts] = cityState.split(',')
        const city = cityPart.trim().slice(0, 100) || null
        const state = stateParts.join(',').trim().slice(0, 100) || null

        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
        if (!checkRateLimit(`pulse:${ip}`, 5, 60000)) {
            return NextResponse.json({ error: 'Too many submissions. Please wait a minute and try again.' }, { status: 429 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) {
            console.error('pulse-submissions: Supabase service credentials missing')
            return NextResponse.json({ error: 'Saving is unavailable right now' }, { status: 500 })
        }
        const supabase = createClient(supabaseUrl, serviceKey)

        const { error } = await supabase.from('pulse_submissions').insert({
            city,
            state,
            per_unit_price: perUnitPrice,
            clinic_name: clinicName,
            satisfaction,
            source: 'pulse',
        })
        if (error) throw error

        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('pulse-submissions failed:', err)
        return NextResponse.json({ error: 'Could not save your data. Please try again.' }, { status: 500 })
    }
}
