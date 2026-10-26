import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateApiKey } from '@/lib/api-auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const apiKeyHeader = req.headers.get('x-api-key')

    // 1. Validate API Key
    const auth = await validateApiKey(apiKeyHeader)
    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // 2. Query distinct cities with provider counts
    const { data, error } = await supabase
        .from('providers')
        .select('city, state')

    if (error) {
        console.error('API Cities Error:', error)
        return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
    }

    // 3. Aggregate by city + state
    const cityMap = new Map<string, { city: string; state: string; provider_count: number }>()

    for (const row of data || []) {
        if (!row.city || !row.state) continue
        const key = `${row.city.toLowerCase()}-${row.state.toLowerCase()}`
        const existing = cityMap.get(key)
        if (existing) {
            existing.provider_count++
        } else {
            cityMap.set(key, {
                city: row.city,
                state: row.state.toUpperCase(),
                provider_count: 1
            })
        }
    }

    // 4. Sort by provider count descending
    const cities = Array.from(cityMap.values())
        .sort((a, b) => b.provider_count - a.provider_count)
        .map(c => ({
            ...c,
            directory_url: `https://www.verifiedaesthetics.com/injectors/${c.state.toLowerCase()}/${c.city.toLowerCase().replace(/\s+/g, '-')}`
        }))

    return NextResponse.json({
        cities,
        total_cities: cities.length,
        total_providers: (data || []).length,
        powered_by: "VerifiedAesthetics Clarity Score™"
    })
}
