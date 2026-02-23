import { NextRequest, NextResponse } from 'next/server'
import { getProvidersWithSearch } from '@/lib/actions/providers'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || ''
    const city = searchParams.get('city') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')

    try {
        const providers = await getProvidersWithSearch({ query, city })
        return NextResponse.json({ providers: providers.slice(0, limit) })
    } catch (error) {
        console.error('API Error searching providers:', error)
        return NextResponse.json({ error: 'Search failed', providers: [] }, { status: 500 })
    }
}
