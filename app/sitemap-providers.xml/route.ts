import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const baseUrl = url.origin

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: providers } = await supabase
        .from('providers')
        .select('slug')
        .order('id', { ascending: true })

    const lastMod = new Date().toISOString().split('T')[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(providers || []).map((p) => `
    <url>
        <loc>${baseUrl}/provider/${p.slug}</loc>
        <lastmod>${lastMod}</lastmod>
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
