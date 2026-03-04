import { NICHE } from '@/config/niche'

export async function GET() {
    const baseUrl = NICHE.baseUrl
    const currentDate = new Date().toISOString().split('T')[0]

    // Priority tiers: high-value pages get higher priority
    const pages = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/find-providers', priority: '0.9', changefreq: 'daily' },
        { path: '/quiz', priority: '0.9', changefreq: 'weekly' },
        { path: `/${NICHE.baseSlug}`, priority: '0.9', changefreq: 'daily' },
        { path: '/calculator', priority: '0.8', changefreq: 'weekly' },
        { path: '/blog', priority: '0.8', changefreq: 'daily' },
        { path: '/for-providers', priority: '0.8', changefreq: 'weekly' },
        { path: '/botox-buyers-guide', priority: '0.8', changefreq: 'monthly' },
        { path: '/botox-fact-sheet', priority: '0.7', changefreq: 'monthly' },
        { path: '/about', priority: '0.6', changefreq: 'monthly' },
        { path: '/pricing', priority: '0.6', changefreq: 'monthly' },
        { path: '/pulse', priority: '0.6', changefreq: 'weekly' },
        { path: '/guides', priority: '0.6', changefreq: 'monthly' },
        { path: '/methodology', priority: '0.5', changefreq: 'monthly' },
        { path: '/faq', priority: '0.5', changefreq: 'monthly' },
        { path: '/api-access', priority: '0.4', changefreq: 'monthly' },
        { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
        { path: '/terms', priority: '0.3', changefreq: 'yearly' },
        { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
        { path: '/provider/claim', priority: '0.5', changefreq: 'monthly' },
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
