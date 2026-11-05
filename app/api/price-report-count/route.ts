import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Approved price-report count — GET only, a count and nothing else.
//
// GET /api/price-report-count?city=Miami&state=FL&treatment=botox
// Returns how many approved, non-outlier price reports exist for one
// city + treatment. Count only: no prices, no ranges, no medians, no
// individual reports. The count is what the price widget shows while a
// city is still collecting ("3 reviewed reports so far — we publish a
// range at 20").
//
// Why a separate route instead of /api/price-pool: the pool route serves
// ranges only for the three seed cities (Asheville, Austin, Scottsdale)
// under John's Oct 28 seed ruling. This route never publishes a range,
// so it can honestly report the count for any city without changing
// that ruling. Same filters as the pool route: status='approved',
// flagged_outlier=false, and the same product matching per treatment.

const TREATMENTS: Record<string, { category: string; unit: string; match: (product: string) => boolean }> = {
    botox: {
        category: 'toxin',
        unit: 'units',
        match: (p) => p === 'botox',
    },
    'lip-filler': {
        category: 'filler',
        unit: 'syringes',
        match: (p) => p.includes('lip') || p === 'filler',
    },
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const city = (url.searchParams.get('city') ?? '').trim()
    const state = (url.searchParams.get('state') ?? '').trim().toUpperCase()
    const treatmentKey = (url.searchParams.get('treatment') ?? '').trim().toLowerCase()

    const treatment = TREATMENTS[treatmentKey]
    if (!city || !state || !treatment) {
        return NextResponse.json({ error: 'city, state and a supported treatment are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: 'Price data is unavailable right now' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data, error } = await supabase
        .from('price_reports')
        .select('product')
        .eq('city', city)
        .eq('state', state)
        .eq('product_category', treatment.category)
        .eq('quantity_unit', treatment.unit)
        .eq('status', 'approved')
        .eq('flagged_outlier', false)

    if (error) {
        console.error('price-report-count: read failed', error.message)
        return NextResponse.json({ error: 'Price data is unavailable right now' }, { status: 500 })
    }

    const count = (data ?? []).filter((r: any) =>
        treatment.match(String(r.product ?? '').toLowerCase())
    ).length

    return NextResponse.json({ city, state, treatment: treatmentKey, count })
}
