import { STATE_MAP } from '@/lib/constants'

export async function GET() {
    const baseUrl = 'https://www.injectorindex.com'
    const lastMod = new Date().toISOString().split('T')[0]

    const states = Object.values(STATE_MAP)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${states.map((stateCode) => `
    <url>
        <loc>${baseUrl}/botox/${stateCode.toLowerCase()}</loc>
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
