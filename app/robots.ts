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
                '/llms.txt',
                '/llms-full.txt',
            ],
            disallow: [
                '/api/',
                '/_next/',
                '/admin/',
                // $-anchored: these are single utility pages. Without the
                // anchor, robots.txt prefix matching also blocked real
                // provider pages whose slugs start with the same word
                // (e.g. /provider/new-york-clinic-20 was blocked by
                // '/provider/new'). Googlebot supports the $ end-anchor.
                '/provider/login$',
                '/provider/signup$',
                '/provider/dashboard$',
                '/provider/verify$',
                '/provider/claim$',
                '/provider/new$',
                '/provider/*/intelligence-brief',
                '/claim/',
                '/search$',
                '/unsubscribe$',
                '/*?price=',
                '/*?rating=',
                '/*?sort=',
                '/*?filter=',
                '/*?page=',
                '/*?q=',
                '/*?verify=',
            ],
        }
    ]

    return {
        rules: rules,
        sitemap: `${NICHE.baseUrl}/sitemap.xml`,
        host: NICHE.baseUrl,
    }
}
