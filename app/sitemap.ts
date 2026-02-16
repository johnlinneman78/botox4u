import { MetadataRoute } from 'next'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'
import { REVERSE_STATE_MAP, TREATMENTS } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://botox-4u.com'
    const cookieStore = await cookies()

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/find-providers',
        '/calculator',
        '/botox',
        '/provider/login',
        '/provider/register',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const supabase = await getSupabaseServer(cookieStore)

    // 2. Fetch Providers for sitemap
    const { data: providers } = await supabase
        .from('providers')
        .select('slug, updated_at')

    const providerRoutes = (providers || []).map((p: any) => ({
        url: `${baseUrl}/provider/${p.slug}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    // 3. Generate City Data
    const { data: locations } = await supabase
        .from('providers')
        .select('city, state')

    const uniqueLocations = Array.from(new Set((locations || []).map((c: any) => `${c.city.toLowerCase().replace(/ /g, '-')}:${c.state.toLowerCase()}`)))

    // City Routes
    const cityRoutes = (uniqueLocations as string[]).map(loc => {
        const [city, state] = loc.split(':')
        return {
            url: `${baseUrl}/botox/${city}-${state}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }
    })

    // 4. Generate Treatment-City Routes (Programmatic SEO Powerhouse)
    const treatmentCityRoutes = []
    for (const treatment of TREATMENTS) {
        for (const loc of (uniqueLocations as string[])) {
            const [city, state] = loc.split(':')
            treatmentCityRoutes.push({
                url: `${baseUrl}/botox/${treatment.slug}/${state}/${city}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            })
        }
    }

    // 5. Generate State Routes
    const uniqueStateCodes = Array.from(new Set((locations || []).map((s: any) => s.state.toUpperCase())))
    const stateRoutes = uniqueStateCodes.map(code => ({
        url: `${baseUrl}/botox/state/${REVERSE_STATE_MAP[code]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    })).filter(route => !!route.url.split('/').pop() && route.url.split('/').pop() !== 'undefined')

    return [
        ...staticRoutes,
        ...providerRoutes,
        ...cityRoutes,
        ...treatmentCityRoutes,
        ...stateRoutes
    ]
}
