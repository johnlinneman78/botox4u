import { STATE_MAP } from '@/lib/constants'
import { NICHE } from '@/config/niche'
import { createPublicClient } from '@/lib/supabase/public'

export async function GET() {
    const supabase = createPublicClient()

    if (!supabase) {
        // Fail loudly: an empty sitemap tells Google there are no state pages
        return new Response('Sitemap unavailable: Supabase config missing', { status: 503 })
    }

    const baseUrl = NICHE.baseUrl
    const lastMod = new Date().toISOString().split('T')[0]

    // Only states with at least one provider. The state page itself noindexes
    // when it has no provider cities (see app/injectors/[state]/page.tsx),
    // so listing empty states here told Google to crawl pages the site
    // itself marks noindex — 19 states in Search Console, Nov 9 2026.
    // Mirrors getCitiesInState: any provider row in the state counts.
    const { data, error } = await supabase
        .from('providers')
        .select('state')

    if (error) {
        console.error('Sitemap states error:', error.message)
        // 503 keeps Google on the last good copy instead of reading "no pages"
        return new Response('Sitemap temporarily unavailable', {
            status: 503,
            headers: { 'Retry-After': '3600' },
        })
    }

    const statesWithProviders = new Set(
        (data || []).map((p: { state: string }) => (p.state || '').toUpperCase())
    )
    const states = Object.values(STATE_MAP).filter((code) =>
        statesWithProviders.has(code.toUpperCase())
    )

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${states.map((stateCode) => `
    <url>
        <loc>${baseUrl}/${NICHE.baseSlug}/${stateCode.toLowerCase()}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
