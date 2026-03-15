import { BLOG_POSTS } from '@/lib/blog-data'

export async function GET(request: Request) {
    const baseUrl = 'https://www.verifiedaesthetics.com'

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${BLOG_POSTS.map((post) => `
    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${post.publishDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
