import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { NICHE } from '@/config/niche'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Static Routes
    const staticRoutes = [
        { url: 'https://www.botox-4u.com', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
        { url: 'https://www.botox-4u.com/about', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: 'https://www.botox-4u.com/find-providers', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    ]

    // 2. Provider Routes
    const { data: providers } = await supabase.from('providers').select('slug').limit(1000)
    const providerRoutes = (providers || []).map((p) => ({
        url: `https://www.botox-4u.com/provider/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // 3. City Routes (P3 Cities)
    const p3Cities = [
        { city: 'New York', state: 'NY' },
        { city: 'Los Angeles', state: 'CA' },
        { city: 'Miami', state: 'FL' },
        { city: 'Chicago', state: 'IL' },
        { city: 'Dallas', state: 'TX' },
        { city: 'Houston', state: 'TX' },
        { city: 'Scottsdale', state: 'AZ' },
        { city: 'San Francisco', state: 'CA' },
        { city: 'Portland', state: 'OR' },
        { city: 'Atlanta', state: 'GA' },
        { city: 'Denver', state: 'CO' },
        { city: 'Phoenix', state: 'AZ' },
        { city: 'San Diego', state: 'CA' },
        { city: 'Nashville', state: 'TN' },
        { city: 'Austin', state: 'TX' },
        { city: 'Las Vegas', state: 'NV' },
        { city: 'Charlotte', state: 'NC' },
        { city: 'Seattle', state: 'WA' },
        { city: 'Boston', state: 'MA' },
        { city: 'Tampa', state: 'FL' },
    ]

    const cityRoutes = p3Cities.map((c) => ({
        url: `https://www.botox-4u.com/${NICHE.baseSlug}/${c.state.toLowerCase()}/${c.city.toLowerCase().replace(/ /g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...staticRoutes, ...providerRoutes, ...cityRoutes]
}
