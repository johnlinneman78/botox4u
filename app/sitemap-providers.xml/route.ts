import { NICHE } from '@/config/niche'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim()

    if (!url || !key) {
        console.error('Sitemap: Supabase config missing')
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
            headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
    }

    const supabase = createClient(url, key)
    const baseUrl = NICHE.baseUrl

    // Only include providers with real data (phone OR website = real business)
    const { data: providers, error } = await supabase
        .from('providers')
        .select('slug, updated_at, phone, website')
        .or('phone.not.is.null,website.not.is.null')

    if (error) {
        console.error('Sitemap providers error:', error.message)
        // Return empty valid sitemap instead of 500
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        })
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(providers || []).map((p) => `
    <url>
        <loc>${baseUrl}/provider/${p.slug}</loc>
        <lastmod>${p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
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
