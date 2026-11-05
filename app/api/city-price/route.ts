import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// City market average — GET only, one number from real data.
//
// GET /api/city-price?city=Miami&state=FL
// Returns the average of published per-unit prices for providers in
// that city, with how many providers publish a price and how many
// providers are listed there. Same math as getCityStats in
// lib/actions/providers (mean of price_per_unit > 0), but filtered to
// one city AND state so "Portland" never mixes Oregon and Maine.
//
// When no clinic in the city has published a price, avgCost is null
// and callers say "Price not published" — never a guessed number, never
// another city's average presented as this city's.

export async function GET(req: Request) {
    const url = new URL(req.url)
    const city = (url.searchParams.get('city') ?? '').trim()
    const state = (url.searchParams.get('state') ?? '').trim().toUpperCase()
    if (!city || !state) {
        return NextResponse.json({ error: 'city and state are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: 'Price data is unavailable right now' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit')
        .ilike('city', city)
        .eq('state', state)

    if (error) {
        console.error('city-price: read failed', error.message)
        return NextResponse.json({ error: 'Price data is unavailable right now' }, { status: 500 })
    }

    const prices = (data ?? [])
        .map((p: any) => Number(p.price_per_unit))
        .filter((p: number) => !Number.isNaN(p) && p > 0)

    return NextResponse.json({
        city,
        state,
        avgCost: prices.length > 0 ? Math.round(prices.reduce((a, p) => a + p, 0) / prices.length) : null,
        pricedProviderCount: prices.length,
        providerCount: (data ?? []).length,
    })
}
