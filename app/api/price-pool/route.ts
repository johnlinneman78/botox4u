import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
    SEED_CITIES,
    SEED_TREATMENTS,
    computeSeedAggregate,
    type SeedCity,
    type SeedTreatment,
} from '@/lib/price-pool-seed'

// Seed price-pool aggregate — GET only, aggregate only.
//
// GET /api/price-pool?city=austin&state=TX&treatment=botox
// Returns ONLY group numbers for one seed city + one seed treatment:
// range, median, count, status, last-updated month/year, and the
// give-to-get breakdown (by quantity bucket, by month/year).
//
// Hard rules, from John's Oct 28 seed ruling and the phase-1 design:
// - Only seed cities (Asheville, Austin, Scottsdale) and seed treatments
//   (Botox, Lip Filler) are served. Anything else is a 404.
// - Only status='approved', non-outlier reports count. Pending reports
//   never display, at any count.
// - Below 20 approved reports, the response is status 'collecting' with
//   a count and how many more are needed — and NO range, NO median.
//   That is the threshold working as intended, not an error.
// - No individual reports, no clinic names, no emails, no exact days.
// - List prices published by clinics are a different dataset and are
//   never mixed into this paid-price aggregate.

export async function GET(req: Request) {
    const url = new URL(req.url)
    const citySlug = (url.searchParams.get('city') ?? '').trim().toLowerCase()
    const state = (url.searchParams.get('state') ?? '').trim().toUpperCase()
    const treatmentKey = (url.searchParams.get('treatment') ?? '').trim().toLowerCase()

    const city: SeedCity | undefined = SEED_CITIES.find((c) => c.slug === citySlug && c.state === state)
    const treatment: SeedTreatment | undefined = SEED_TREATMENTS.find((t) => t.key === treatmentKey)
    if (!city || !treatment) {
        return NextResponse.json({ error: 'Not a seed city or treatment' }, { status: 404 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: 'Price pool is unavailable right now' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    // Botox rows are stored with product='botox'. Lip filler rows are
    // stored as filler with a free-text product name, so match on
    // category + unit and filter the product name in code below.
    const { data, error } = await supabase
        .from('price_reports')
        .select('total_paid, quantity, quantity_unit, treatment_date, submitted_at, product')
        .eq('city', city.name)
        .eq('state', city.state)
        .eq('product_category', treatment.category)
        .eq('quantity_unit', treatment.unit)
        .eq('status', 'approved')
        .eq('flagged_outlier', false)

    if (error) {
        console.error('price-pool: read failed', error.message)
        return NextResponse.json({ error: 'Price pool is unavailable right now' }, { status: 500 })
    }

    const rows = (data ?? []).filter((r: any) => {
        if (treatment.key === 'botox') return String(r.product ?? '').toLowerCase() === 'botox'
        // Lip filler: free-text product names vary; accept names that
        // contain "lip" and "filler", or a plain "filler" entry.
        const p = String(r.product ?? '').toLowerCase()
        return p.includes('lip') || p === 'filler'
    })

    const aggregate = computeSeedAggregate(city, treatment, rows)

    if (aggregate.status === 'collecting') {
        return NextResponse.json({
            city: aggregate.city,
            state: aggregate.state,
            treatment: aggregate.treatment,
            unitLabel: aggregate.unitLabel,
            count: aggregate.count,
            status: aggregate.status,
            neededForProvisional: 20 - aggregate.count,
        })
    }

    return NextResponse.json(aggregate)
}
