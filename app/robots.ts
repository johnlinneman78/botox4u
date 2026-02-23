import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/_next/',
                '/admin/',
                '/*?price=',
                '/*?rating=',
                '/*?sort=',
                '/*?filter=',
                '/*?page='
            ],
        },
        sitemap: 'https://injectorindex.com/sitemap.xml',
        host: 'https://injectorindex.com',
    }
}
