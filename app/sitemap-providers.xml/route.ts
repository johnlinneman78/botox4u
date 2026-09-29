import { NICHE } from '@/config/niche'
import { createPublicClient } from '@/lib/supabase/public'

export async function GET() {
    const supabase = createPublicClient()

    if (!supabase) {
        // Fail loudly: an empty sitemap tells Google there are no provider pages
        return new Response('Sitemap unavailable: Supabase config missing', { status: 503 })
    }

    const baseUrl = NICHE.baseUrl

    // Only providers matched to a real Google listing. Rows without a place ID
    // were never confirmed to exist. Note: the providers table has no
    // updated_at column (selecting it made this query fail), so lastmod uses
    // the most recent enrichment or creation date.
    const { data: providers, error } = await supabase
        .from('providers')
        .select('slug, created_at, enriched_at, npi_verified_at')
        .not('google_place_id', 'is', null)

    if (error) {
        console.error('Sitemap providers error:', error.message)
        // 503 keeps Google on the last good copy instead of reading "no pages"
        return new Response('Sitemap temporarily unavailable', {
            status: 503,
            headers: { 'Retry-After': '3600' },
        })
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(providers || []).map((p) => `
    <url>
        <loc>${baseUrl}/provider/${p.slug}</loc>
        <lastmod>${new Date(p.npi_verified_at || p.enriched_at || p.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
