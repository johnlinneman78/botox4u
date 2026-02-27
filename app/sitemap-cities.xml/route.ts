import { NICHE } from '@/config/niche'

export async function GET(request: Request) {
    const baseUrl = 'https://www.injectorindex.com'
    const lastMod = new Date().toISOString().split('T')[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${NICHE.cities.map((c) => {
        const citySlug = c.name.toLowerCase().replace(/\s+/g, '-');
        const stateCode = c.state.toLowerCase();
        return `
    <url>
        <loc>${baseUrl}/${NICHE.baseSlug}/${stateCode}/${citySlug}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
    }).join('')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
