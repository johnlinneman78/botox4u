import { MetadataRoute } from 'next'
import { NICHE } from '@/config/niche'

export default function robots(): MetadataRoute.Robots {
    const rules = [
        {
            userAgent: 'GPTBot',
            allow: '/',
        },
        {
            userAgent: 'Google-Extended',
            allow: '/',
        },
        {
            userAgent: 'PerplexityBot',
            allow: '/',
        },
        {
            userAgent: 'CCBot',
            allow: '/',
        },
        {
            userAgent: 'anthropic-ai',
            allow: '/',
        },
        {
            userAgent: 'ClaudeBot',
            allow: '/',
        },
        {
            userAgent: 'OAI-SearchBot',
            allow: '/',
        },
        {
            userAgent: 'ChatGPT-User',
            allow: '/',
        },
        {
            userAgent: 'cohere-ai',
            allow: '/',
        },
        {
            userAgent: '*',
            allow: [
                '/',
                '/docs',
                '/llms.txt',
                '/llms-full.txt',
            ],
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
        }
    ]

    return {
        rules: rules,
        sitemap: `${NICHE.baseUrl}/sitemap.xml`,
        host: NICHE.baseUrl,
    }
}
