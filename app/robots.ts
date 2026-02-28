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
                '/provider/login',
                '/provider/dashboard',
                '/claim/*/verify',
                '/*?price=',
                '/*?rating=',
                '/*?sort=',
                '/*?filter=',
                '/*?page='
            ],
        },
        sitemap: 'https://www.injectorindex.com/sitemap.xml',
        host: 'https://www.injectorindex.com',
    }
}
