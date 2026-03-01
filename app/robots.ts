import { MetadataRoute } from 'next'
import { NICHE } from '@/config/niche'

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
        sitemap: `${NICHE.baseUrl}/sitemap.xml`,
        host: NICHE.baseUrl,
    }
}
