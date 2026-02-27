export async function GET() {
    const baseUrl = 'https://www.injectorindex.com'
    const currentDate = new Date().toISOString()

    const pages = [
        '',
        '/blog',
        '/calculator',
        '/about',
        '/pricing',
        '/find-providers',
        '/methodology',
        '/privacy',
        '/terms',
        '/disclaimer',
        '/botox-buyers-guide',
        '/botox-fact-sheet',
        '/botox/ny',
        '/botox/ca',
        '/botox/fl',
        '/botox/tx',
        '/botox/ga',
        '/botox/co',
        '/botox/tn',
        '/botox/nc',
        '/botox/nv',
        '/botox/or',
        '/botox/mn',
        '/botox/pa',
        '/botox/dc',
        '/botox/ma',
        '/botox/wa',
        '/botox/az'
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
