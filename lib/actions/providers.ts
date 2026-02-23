import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { NICHE } from '@/config/niche'
import { calculateProviderScore } from '@/lib/scoring'

const REGEN_TREATMENTS = [
    'Polynucleotides (PNs)',
    'Daxxify / Long-Acting Tox',
    'Plant-Derived Exosomes',
    'Biostimulators (Sculptra)',
    'PRF / PRP',
    'NAD+ IV Therapy',
    'Microneedling',
    'Morpheus8 / RF Microneedling',
    'Laser Resurfacing',
    'Chemical Peels',
    'IPL / Photofacial',
    'LED Light Therapy'
]

const FILLER_TREATMENTS = [
    'Lip filler',
    'Cheek / midface filler',
    'Jawline / chin filler',
    'Under-eye filler'
]

const ARTISANS = ['Regenerative Medicine', 'Nurse-Led Injection Studio']
const INSTITUTIONS = ['Medspa', 'Clinic', 'Dermatology', 'Plastic Surgery']

function calculateRegenRatio(services: string[]): number {
    const regenCount = (services || []).filter(s => REGEN_TREATMENTS.includes(s)).length
    const fillerCount = (services || []).filter(s => FILLER_TREATMENTS.includes(s)).length

    // Base: 0-100
    let score = (regenCount / REGEN_TREATMENTS.length) * 100

    // Boost: Significant regen focus AND 0 filler -> +10 points (visibility)
    if (regenCount >= 6 && fillerCount === 0) score += 10

    return Math.min(100, score)
}

export async function getProvidersWithSearch(filters: {
    query?: string,
    city?: string,
    state?: string,
    tier?: string,
    treatment?: string,
    type?: string, // institutional | artisan
    view?: string, // specialist | general
    userLat?: number,
    userLng?: number
} = {}) {
    console.log('DEBUG: getProvidersWithSearch started')
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    let queryBuilder = supabase
        .from('providers')
        .select('*')
        // .eq('display_status', 'live') // Disabled until migration is confirmed to be run
        .order('listing_tier', { ascending: false }) // Premium first
        .order('rating', { ascending: false }) // Changed from average_rating to rating

    if (filters.query) {
        // Expanded search across name, city, state, business type, treatments (text search), and description
        queryBuilder = queryBuilder.or(`name.ilike.%${filters.query}%,city.ilike.%${filters.query}%,state.ilike.%${filters.query}%,business_type.ilike.%${filters.query}%,treatment_slugs::text.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    }
    if (filters.city) {
        queryBuilder = queryBuilder.ilike('city', filters.city.trim())
    }
    if (filters.state) {
        queryBuilder = queryBuilder.ilike('state', filters.state.trim())
    }
    if (filters.tier) {
        queryBuilder = queryBuilder.eq('listing_tier', filters.tier)
    }
    if (filters.treatment) {
        // treatment_slugs is a text[] column in Supabase
        queryBuilder = queryBuilder.contains('treatment_slugs', [filters.treatment])
    }
    if (filters.type === 'artisan') {
        queryBuilder = queryBuilder.in('business_type', ARTISANS)
    } else if (filters.type === 'institutional') {
        queryBuilder = queryBuilder.in('business_type', INSTITUTIONS)
    }

    console.log('DEBUG: queryBuilder configured, executing query...')
    const { data, error } = await queryBuilder
    console.log('DEBUG: query result:', { dataLength: data?.length, error })

    if (error) {
        console.error('Error fetching providers:', error)
        return []
    }

    const mappedData = (data || []).map((p: any) => {
        const scoreBreakdown = calculateProviderScore({
            price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
            rating: parseFloat(p.rating || p.average_rating || 0),
            review_count: p.review_count || 0,
            has_photo: !!(p.hero_image_url || p.image_url),
            has_description: !!p.description,
            is_verified: p.verified || false,
            npi_verified: p.npi_verified || false,
            allergan_tier: p.allergan_tier,
            results_quality_score: p.score_results_quality,
            website: p.website,
            responsiveness_score: p.responsiveness_score
        })

        const iiScore = scoreBreakdown.points
        const servicesOffered = p.services_offered || []
        const regen_ratio = calculateRegenRatio(servicesOffered)
        const fillerCount = servicesOffered.filter((s: string) => FILLER_TREATMENTS.includes(s)).length
        const regenCount = servicesOffered.filter((s: string) => REGEN_TREATMENTS.includes(s)).length

        // Granularity Weighting (25%) -> Highlight specialized talent (Artisans) 
        const granularityBonus = ARTISANS.includes(p.business_type) ? 25 : 0

        // Final Priority Score calculation (40% Score / 35% Regen / 25% Granularity)
        let priority_score = (iiScore * 0.40) + (regen_ratio * 0.35) + (granularityBonus * 0.25)

        // 10+ Regen Boost (+10% visibility boost if 10+ regen treatments and 0 filler)
        if (regenCount >= 10 && fillerCount === 0) priority_score += 10

        return {
            ...p,
            id: p.id,
            name: p.name,
            slug: p.slug,
            business_type: p.business_type,
            businessType: p.business_type,
            address: p.address,
            city: p.city,
            state: p.state,
            averageRating: parseFloat(p.rating || p.average_rating || 0),
            reviewCount: p.review_count || 0,
            listingTier: p.listing_tier || 'free',
            verified: p.verified || false,
            price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
            pricePerUnit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
            minTreatmentPrice: p.min_treatment_price,
            latitude: p.latitude || 0,
            longitude: p.longitude || 0,
            lat: p.latitude || 0,
            lng: p.longitude || 0,
            imageUrl: (() => {
                const url = p.hero_image_url || p.image_url;
                if (!url || url.includes('placeholder')) {
                    const fallbacks = [
                        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
                    ];
                    const index = p.id ? p.id.length % fallbacks.length : 0;
                    return fallbacks[index];
                }
                if (url.startsWith('http')) return url;
                return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider_images/${url}`;
            })(),
            score: scoreBreakdown,
            score_total: iiScore,
            regen_ratio,
            priority_score,
            is_specialist: iiScore >= 60,
            relegated: iiScore < 60,
            warning_flag: p.warning_flag || false,
            has_real_photo: !!(p.hero_image_url || p.image_url),
            services_offered: servicesOffered
        }
    })

    // Deduplicate by slug and name+city to prevent showing the same clinic twice
    const deduplicated: any[] = [];
    const seenKeys = new Set<string>();

    mappedData.forEach(p => {
        const nameKey = `${p.name?.toLowerCase().trim()}|${p.city?.toLowerCase().trim()}`;
        if (!seenKeys.has(p.slug) && !seenKeys.has(nameKey)) {
            deduplicated.push(p);
            seenKeys.add(p.slug);
            seenKeys.add(nameKey);
        }
    });

    // Safety Floor Gatekeeper
    // Default to 'specialist' results (>= 60) if no explicit view is set
    const currentView = filters.view || 'specialist'
    let finalProviders = deduplicated
    if (currentView === 'specialist') {
        finalProviders = deduplicated.filter(p => p.is_specialist)
    } else if (currentView === 'general') {
        finalProviders = deduplicated.filter(p => p.relegated)
    }

    const tierWeight = {
        'featured': 1000,
        'premium': 1000,
        'verified': 500,
        'free': 0
    }

    return finalProviders.sort((a: any, b: any) => {
        // 1. Pinned Elite Featured (85+)
        const isPinnedA = a.listingTier === 'featured' && a.score_total >= 85
        const isPinnedB = b.listingTier === 'featured' && b.score_total >= 85
        if (isPinnedA && !isPinnedB) return -1
        if (!isPinnedA && isPinnedB) return 1

        // 2. Section: Featured first
        const weightA = tierWeight[a.listingTier as keyof typeof tierWeight] || 0
        const weightB = tierWeight[b.listingTier as keyof typeof tierWeight] || 0
        if (weightB !== weightA) return weightB - weightA

        // 3. II-Priority Score Sort (40/35/25)
        if (Math.abs(b.priority_score - a.priority_score) > 0.1) {
            return b.priority_score - a.priority_score
        }

        // 4. Proximity as tie-breaker (if within range)
        if (filters.userLat && filters.userLng && a.lat && a.lng && b.lat && b.lng) {
            const distA = Math.sqrt(Math.pow(a.lat - filters.userLat, 2) + Math.pow(a.lng - filters.userLng, 2))
            const distB = Math.sqrt(Math.pow(b.lat - filters.userLat, 2) + Math.pow(b.lng - filters.userLng, 2))
            if (Math.abs(distA - distB) > 0.05) {
                return distA - distB
            }
        }

        return b.score_total - a.score_total
    })
}

export async function getTopScoringProviders(limit: number = 6, userLat?: number, userLng?: number, userCity?: string, userState?: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    let finalProviders: any[] = []

    // 1. Try Localized First (City Match)
    if (userCity) {
        const { data: cityData } = await supabase
            .from('providers')
            .select('*')
            .not('score', 'is', null)
            .ilike('city', userCity)
            .order('score', { ascending: false })
            .limit(limit)

        if (cityData && cityData.length > 0) {
            finalProviders = cityData
        }
    }

    // 2. Fallback to Regional (State Match) if we don't have enough city matches
    if (finalProviders.length < limit && userState) {
        const remaining = limit - finalProviders.length
        const existingIds = finalProviders.map(p => p.id)

        const { data: stateData } = await supabase
            .from('providers')
            .select('*')
            .not('score', 'is', null)
            .eq('state', userState)
            .not('id', 'in', `(${existingIds.length ? existingIds.join(',') : '0'})`)
            .order('score', { ascending: false })
            .limit(remaining)

        if (stateData) {
            finalProviders = [...finalProviders, ...stateData]
        }
    }

    // 3. National Fallback
    if (finalProviders.length < limit) {
        const remaining = limit - finalProviders.length
        const existingIds = finalProviders.map(p => p.id)

        const { data: nationalData } = await supabase
            .from('providers')
            .select('*')
            .not('score', 'is', null)
            .not('id', 'in', `(${existingIds.length ? existingIds.join(',') : '0'})`)
            .order('score', { ascending: false })
            .limit(remaining)

        if (nationalData) {
            finalProviders = [...finalProviders, ...nationalData]
        }
    }

    // Deduplicate and map
    const mapped = [];
    const seenTopKeys = new Set<string>();

    for (const p of finalProviders) {
        const nameKey = `${p.name?.toLowerCase().trim()}|${p.city?.toLowerCase().trim()}`;
        if (!seenTopKeys.has(p.slug) && !seenTopKeys.has(nameKey)) {
            mapped.push({
                id: p.id,
                name: p.name,
                slug: p.slug,
                business_type: p.business_type,
                city: p.city,
                state: p.state,
                lat: p.latitude || p.lat || 0,
                lng: p.longitude || p.lng || 0,
                rating: p.rating || parseFloat(p.average_rating || 0),
                review_count: p.review_count || 0,
                score_total: p.score || 0,
                points: p.score || 0,
                price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
                imageUrl: p.hero_image_url || p.image_url || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
                website: p.website,
                listingTier: p.listing_tier || 'free',
                npi_verified: p.npi_verified || false,
                score_results_quality: p.score_results_quality || 0,
                has_real_photo: !!(p.hero_image_url || p.image_url),
                score: { points: p.score || 0 }
            });
            seenTopKeys.add(p.slug);
            seenTopKeys.add(nameKey);
        }
    }

    // Sort the final selection by proximity within its own tier (City -> State -> National)
    return mapped.sort((a, b) => {
        if (userLat && userLng && a.lat && a.lng && b.lat && b.lng) {
            const distA = Math.sqrt(Math.pow(a.lat - userLat, 2) + Math.pow(a.lng - userLng, 2))
            const distB = Math.sqrt(Math.pow(b.lat - userLat, 2) + Math.pow(b.lng - userLng, 2))

            // Proximity is a tie-breaker for providers in the same tier
            if (Math.abs(distA - distB) > 0.1) {
                return distA - distB
            }
        }
        return b.points - a.points
    })
}

export async function getCityStats(city: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return null

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, rating, average_rating, google_place_id')
        // .eq('display_status', 'live')
        .ilike('city', city.trim())

    if (error || !data || data.length === 0) return null

    const prices = data.map((p: any) => Number(p.price_per_unit || p.botox_price_per_unit)).filter(p => !isNaN(p) && p > 0)
    const ratings = data.map((p: any) => Number(p.rating || p.average_rating)).filter(r => !isNaN(r) && r > 0)

    // ANTI-ZERO GUARD: Ensure Scottsdale (and others) never show $0 or 0.0 rating
    const avgCost = prices.length > 0 ? prices.reduce((acc, p) => acc + p, 0) / prices.length : (NICHE.priceRange.min + 4)
    const avgRating = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r, 0) / ratings.length : 4.8

    return {
        avgCost: Math.round(avgCost) || (NICHE.priceRange.min + 4),
        avgRating: Number((avgRating || 4.8).toFixed(1)),
        providerCount: data.length || 0
    }
}

export async function getStateStats(state: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return null

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, city')
        .eq('state', state)

    if (error || !data || data.length === 0) return null

    const cities = new Set(data.map((p: any) => p.city))
    const avgCost = data.reduce((acc: number, curr: any) => acc + (Number(curr.price_per_unit) || 0), 0) / data.length

    return {
        avgCost: Math.round(avgCost),
        providerCount: data.length,
        cityCount: cities.size
    }
}

export async function getCitiesInState(state: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    const { data, error } = await supabase
        .from('providers')
        .select('city, state')
        .eq('state', state)

    if (error || !data) return []

    const cityCounts: Record<string, { city: string, state: string, count: number }> = {}
    data.forEach((p: any) => {
        if (!cityCounts[p.city]) {
            cityCounts[p.city] = { city: p.city, state: p.state, count: 0 }
        }
        cityCounts[p.city].count++
    })

    return Object.values(cityCounts).sort((a, b) => b.count - a.count)
}

export async function getNearbyCities(city: string, state: string, limit: number = 5) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    const { data, error } = await supabase
        .from('providers')
        .select('city, state')
        .eq('state', state)
        .neq('city', city)
        .limit(50)

    if (error || !data) return []

    const cityCounts: Record<string, { city: string, state: string, count: number }> = {}
    data.forEach((p: any) => {
        if (!cityCounts[p.city]) {
            cityCounts[p.city] = { city: p.city, state: p.state, count: 0 }
        }
        cityCounts[p.city].count++
    })

    return Object.values(cityCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
}

export async function getTreatmentStats(treatment: string, city: string, state: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return null

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, min_treatment_price')
        .eq('city', city)
        .eq('state', state)
        .contains('treatment_slugs', [treatment])

    if (error || !data || data.length === 0) return null

    const prices = data.map((p: any) => Number(p.price_per_unit || (NICHE.priceRange.min + 5)))
    const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length

    return {
        avgCost: Math.round(avg),
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        providerCount: data.length
    }
}

export async function getProviderBySlug(slug: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return null

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!data) return null

    return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        business_type: data.business_type,
        businessType: data.business_type, // Legacy support
        address: data.address,
        city: data.city,
        state: data.state,
        averageRating: parseFloat(data.rating || data.average_rating || 0),
        reviewCount: data.review_count || 0,
        listingTier: data.listing_tier || 'free',
        verified: data.verified || false,
        price_per_unit: data.price_per_unit || data.botox_price_per_unit,
        pricePerUnit: data.price_per_unit || data.botox_price_per_unit, // Legacy support
        minTreatmentPrice: data.min_treatment_price,
        imageUrl: (() => {
            const url = data.hero_image_url || data.image_url;
            if (!url || url.includes('placeholder')) {
                return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800';
            }
            if (url.startsWith('http')) return url;
            return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider_images/${url}`;
        })(),
        enriched_attrs: data.enriched_attrs,
        website: data.website,
        phone: data.phone,
        description: data.description,

        // Enriched Fields
        google_place_id: data.google_place_id,
        rating: data.rating || parseFloat(data.average_rating || 0), // Use manual rating as fallback
        review_count: data.review_count || 0,
        top_reviews: data.top_reviews || [],
        badges: data.badges || [],
        ai_description: data.ai_description,
        ai_description_confirmed: data.ai_description_confirmed,
        gallery: data.gallery || [],
        services_offered: data.services_offered || [],
        hero_image_url: data.hero_image_url || data.image_url,
        reviews: data.top_reviews || [],

        // NPI Fields
        npi_number: data.npi_number,
        npi_verified: data.npi_verified,
        npi_license_type: data.npi_license_type,
        npi_specialty: data.npi_specialty,
        npi_verified_at: data.npi_verified_at,
        allergan_tier: data.allergan_tier,

        score: calculateProviderScore({
            price_per_unit: data.price_per_unit || data.botox_price_per_unit || data.enriched_attrs?.price_per_unit_botox,
            rating: parseFloat(data.rating || data.average_rating || 0),
            review_count: data.review_count || 0,
            has_photo: !!(data.hero_image_url || data.image_url),
            has_description: !!data.description,
            is_verified: data.verified || false,
            npi_verified: data.npi_verified || false,
            allergan_tier: data.allergan_tier,
            results_quality_score: data.score_results_quality,
            website: data.website,
            responsiveness_score: data.responsiveness_score
        }),
        score_total: calculateProviderScore({
            price_per_unit: data.price_per_unit || data.botox_price_per_unit || data.enriched_attrs?.price_per_unit_botox,
            rating: parseFloat(data.rating || data.average_rating || 0),
            review_count: data.review_count || 0,
            has_photo: !!(data.hero_image_url || data.image_url),
            has_description: !!data.description,
            is_verified: data.verified || false,
            npi_verified: data.npi_verified || false,
            allergan_tier: data.allergan_tier,
            results_quality_score: data.score_results_quality,
            website: data.website,
            responsiveness_score: data.responsiveness_score
        }).points,

        // Warning & Scoring Fields
        warning_flag: data.warning_flag || false,
        warning_reason: data.warning_reason,
        score_results_quality: data.score_results_quality || 0,
        positive_keyword_count: data.positive_keyword_count || 0,
        negative_keyword_count: data.negative_keyword_count || 0,
    }
}

export async function getPlatformStats() {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return { providers: 0, cities: 0, reviews: 0 }

    // 1. Providers Count
    const { count: providersCount } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })

    // 2. Cities Count (Unique)
    // For smaller datasets, selecting all cities is fine. For larger, we'd use an RPC or a view.
    const { data: cityData } = await supabase
        .from('providers')
        .select('city')

    const uniqueCities = new Set(cityData?.map(p => p.city?.trim()).filter(Boolean))
    const citiesCount = uniqueCities.size

    // 3. Reviews Count (Sum)
    const { data: reviewData } = await supabase
        .from('providers')
        .select('review_count')

    const reviewsCount = reviewData?.reduce((acc, p) => acc + (p.review_count || 0), 0) || 0

    return {
        providers: providersCount || 0,
        cities: citiesCount || 0,
        reviews: reviewsCount || 0
    }
}


