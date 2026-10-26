import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateApiKey } from '@/lib/api-auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const apiKeyHeader = req.headers.get('x-api-key')

    // 1. Validate API Key
    const auth = await validateApiKey(apiKeyHeader)
    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // 2. Parse Query Parameters
    const city = searchParams.get('city')
    const style = searchParams.get('style') // e.g. "natural"
    const maxPrice = searchParams.get('max_price')
    const minScore = searchParams.get('min_clarity_score')
    const tier = searchParams.get('tier') // FEATURED, VERIFIED, FREE
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    // 3. Validation: City is required
    if (!city) {
        return NextResponse.json({ error: 'City parameter is required (e.g. ?city=portland)' }, { status: 400 })
    }

    // 4. Build Supabase Query
    let query = supabase
        .from('providers')
        .select('*', { count: 'exact' })
        .ilike('city', `%${city}%`)
        .order('score_total', { ascending: false })
        .limit(limit)

    if (style) {
        // Check if the style tag exists in the style_tags array
        query = query.contains('style_tags', [style.toLowerCase()])
    }

    if (maxPrice) {
        query = query.lte('price_per_unit', parseInt(maxPrice))
    }

    if (minScore) {
        query = query.gte('score_total', parseInt(minScore))
    }

    if (tier) {
        query = query.eq('listing_tier', tier.toLowerCase())
    }

    const { data: providers, error, count } = await query

    if (error) {
        console.error('API Provider Search Error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    // 5. Format Response
    const results = (providers || []).map(p => ({
        provider_id: p.id,
        name: p.name,
        city: p.city,
        clarityScore: p.score_total,
        tier: (p.listing_tier || 'FREE').toUpperCase(),
        style_tags: p.style_tags || [],
        avg_price: p.price_per_unit,
        booking_url: p.booking_url || p.website,
        profile_url: `https://www.verifiedaesthetics.com/provider/${p.slug}`
    }))

    return NextResponse.json({
        results,
        total: count || 0,
        city: city,
        powered_by: "VerifiedAesthetics Clarity Score™"
    })
}
