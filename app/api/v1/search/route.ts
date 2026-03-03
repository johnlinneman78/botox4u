import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    const key = req.headers.get('x-api-key')
    const auth = await validateApiKey(key)

    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.toLowerCase()

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    // Phase 1 Semantic Mapping: Extract keywords & intent
    const intentStyles = ['natural', 'conservative', 'high-volume', 'advanced', 'conservative', 'regenerative', 'filler', 'botox']
    const matchedStyles = intentStyles.filter(style => query.includes(style))

    // Extract potential city - match against niche config
    // Actually, simple query across full text search if available, otherwise filters

    let dbQuery = supabase
        .from('providers')
        .select('name, city, state, score, listing_tier, style_tags, price_per_unit, slug')
        .eq('active', true)

    // Filter by matched styles if found
    if (matchedStyles.length > 0) {
        dbQuery = dbQuery.contains('style_tags', matchedStyles)
    }

    // Filter by city if found in query
    // Simple look-up for common city names in query
    const words = query.split(' ')
    if (words.length > 0) {
        // This is a naive heuristic for 'semantic' until vectors are live
        // We look for name or city matches
        dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`)
    }

    const { data: results, error } = await dbQuery
        .order('score', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Semantic Search Error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    return NextResponse.json({
        query: query,
        intent_extraction: {
            detected_styles: matchedStyles,
            engine: 'Semantic Lexical Mapping v1.0'
        },
        results: results,
        total: results.length,
        powered_by: 'InjectorIndex Clarity Score™'
    })
}
