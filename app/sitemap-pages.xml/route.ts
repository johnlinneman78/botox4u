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
        '/faq',
        '/botox-buyers-guide',
        '/botox-fact-sheet',
        '/provider/login',
        '/provider/claim'
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
