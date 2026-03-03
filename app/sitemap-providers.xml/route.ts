import { NICHE } from '@/config/niche'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

export async function GET() {
    const supabase = await getSupabaseServer(await cookies())
    const baseUrl = NICHE.baseUrl

    if (!supabase) {
        return new Response('Supabase connection failed', { status: 500 })
    }

    const { data: providers, error } = await supabase
        .from('providers')
        .select('slug, updated_at')
    // .eq('display_status', 'live') // Add filter if needed

    if (error) {
        return new Response('Error fetching providers', { status: 500 })
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
