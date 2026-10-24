'use server'

import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { createClient } from '@/lib/supabase/client'
import { NICHE } from '@/config/niche'
import { scoreProvider } from '../scoring'

const REGEN_TREATMENTS = [
    'Polynucleotides (PNs)',
    'Daxxify / Long-Acting Tox',
    'Plant-Derived Exosomes',
    'Biostimulators (Sculptra)',
    'Lacrifill / Ocular Surface',
    'PRF / PRP',
    'NAD+ IV Therapy',
    'Microneedling',
    'Morpheus8 / RF Microneedling',
    'Laser Resurfacing',
    'Chemical Peels',
    'IPL / Photofacial',
    'LED Light Therapy'
]

const ADVANCED_TOXINS = ['Daxxify', 'RelabotulinumtoxinA', 'Daxxify / Long-Acting Tox']
const AI_DIAGNOSTICS = ['AI Skin Analysis', 'Visia Skin Analysis', '3D Facial Imaging']

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
    style?: string, // e.g. "natural"
    maxPrice?: number,
    type?: string, // institutional | artisan
    view?: string, // specialist | general
    limit?: number,
    sort?: 'priority' | 'distance',
    userLat?: number,
    userLng?: number
} = {}) {
    console.log('DEBUG: getProvidersWithSearch started', filters)
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    let queryBuilder = supabase
        .from('providers')
        .select(`
            id, name, slug, business_type, address, city, state, 
            listing_tier, verified, price_per_unit,
            lat, lng, hero_image_url,
            rating, average_rating, review_count, 
            services_offered, credentials, description,
            npi_verified, npi_number, allergan_tier,
            score_results_quality,
            warning_flag, warning_reason, treatment_slugs,
            style_tags,
            practitioners:provider_practitioners(name:full_name, credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date, npi_number)
        `)
        // .eq('display_status', 'live') // Disabled until migration is confirmed to be run
        // Ranking never depends on what a provider pays (see /pricing, /about).
        .order('rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false, nullsFirst: false })

    if (filters.query) {
        const q = filters.query.trim()
        const qLower = q.toLowerCase()

        // Base search conditions for text columns - optimized for GIN index with pg_trgm
        let orConditions = [
            `name.ilike.%${q}%`,
            `city.ilike.%${q}%`,
            `state.ilike.%${q}%`,
            `business_type.ilike.%${q}%`,
            `description.ilike.%${q}%`,
            `credentials.ilike.%${q}%`
        ]

        // Add array contains conditions.
        // NOTE: do not filter on `badges` here. It is not part of the
        // providers select used anywhere in the app, and a PostgREST filter
        // on a column the production table does not expose errors the WHOLE
        // search request, so every text search returned zero results
        // (the /claim clinic lookup showed "No clinic found" for real
        // clinics). Name/city/description matching covers clinic search.
        orConditions.push(`treatment_slugs.cs.{"${qLower}"}`)
        orConditions.push(`services_offered.cs.{"${q}"}`)

        // Smart Acronym Fallback: If query is short (2-4 chars), try matching word initials
        // e.g., "HS7" matches "Houston Studios 77"
        if (q.length >= 2 && q.length <= 4) {
            const initialsQuery = q.split('').join('%') + '%'
            orConditions.push(`name.ilike.${initialsQuery}`)
        }

        queryBuilder = queryBuilder.or(orConditions.join(','))

        // Background Logging: Log search query for analytics and data gap identifying
        // This is non-blocking to keep search fast
        const logSearch = async () => {
            try {
                const { data: countData } = await (await createClient()).from('providers').select('id', { count: 'exact', head: true }).or(orConditions.join(','))
                await (await createClient()).from('search_logs').insert({
                    query: q,
                    result_count: countData?.length || 0,
                    metadata: { filters: JSON.stringify(filters) }
                })
            } catch (e) {
                console.warn('Search logging failed:', e)
            }
        }
        logSearch().catch(console.error)
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
    if (filters.style) {
        // style_tags is a text[] column in Supabase
        queryBuilder = queryBuilder.contains('style_tags', [filters.style.toLowerCase()])
    }
    if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('price_per_unit', filters.maxPrice)
    }
    if (filters.type === 'artisan') {
        queryBuilder = queryBuilder.in('business_type', ARTISANS)
    } else if (filters.type === 'institutional') {
        queryBuilder = queryBuilder.in('business_type', INSTITUTIONS)
    }

    console.log('DEBUG: queryBuilder configured, executing query...', { city: filters.city, state: filters.state })
    const { data, error } = await queryBuilder
    console.log('DEBUG: query result:', { dataLength: data?.length, error, firstItem: data?.[0]?.name })

    if (error) {
        console.error('Error fetching providers:', error)
        return []
    }

    const mappedData = (data || []).map((p: any) => {
        const servicesOffered = p.services_offered || []
        const regenCount = (servicesOffered || []).filter((s: string) => REGEN_TREATMENTS.includes(s)).length
        const hasAdvancedTox = (servicesOffered || []).some((s: string) => ADVANCED_TOXINS.includes(s) || (p.services_offered_raw || []).includes(s))
        const hasAI = (servicesOffered || []).some((s: string) => AI_DIAGNOSTICS.includes(s))

        const scoreBreakdown = scoreProvider(p)

        const clarityScore = scoreBreakdown.points   // null = not enough data
        const innovationBalance = calculateRegenRatio(servicesOffered)
        const fillerCount = servicesOffered.filter((s: string) => FILLER_TREATMENTS.includes(s)).length

        // Rank by Clarity Score only. It never includes payment, treatment
        // count or business type. Providers without enough data sort last.
        const priority_score = clarityScore ?? -1

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
            latitude: p.lat || 0,
            longitude: p.lng || 0,
            lat: p.lat || 0,
            lng: p.lng || 0,
            imageUrl: (() => {
                const url = p.hero_image_url || p.image_url;
                if (!url || url.includes('placeholder') || url.includes('unsplash.com')) return null;
                if (url.startsWith('http')) return url;
                return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider_images/${url}`;
            })(),
            score: scoreBreakdown,
            score_total: clarityScore,
            clarityScore,
            innovation_balance: innovationBalance,
            priority_score,
            is_specialist: true,
            relegated: false,
            warning_flag: p.warning_flag || false,
            has_real_photo: !!(p.hero_image_url || p.image_url),
            services_offered: servicesOffered,
            practitioners: p.practitioners || []
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

    // No "safety floor" filter: every real provider is listed, ranked by
    // Clarity Score. Hiding low-data providers would punish clinics we
    // simply haven't verified yet.
    let finalProviders = deduplicated

    // INTELLIGENT FALLBACK: If 0 results for specific filters, try broadening the search
    if (finalProviders.length === 0) {
        // 1. Try city-wide but remove treatment/query filters
        if (filters.city && (filters.treatment || filters.query)) {
            console.log('FALLBACK: City search empty with filters. Retrying city-wide.')
            return getProvidersWithSearch({ city: filters.city, state: filters.state, limit: filters.limit })
        }
        // 2. Try state-wide
        if (filters.state && !filters.city) {
            console.log('FALLBACK: State search empty. Retrying state-wide broad.')
            return getProvidersWithSearch({ state: filters.state, limit: filters.limit })
        }
        // 3. Absolute broad search (Last resort)
        if (Object.keys(filters).some(k => (filters as any)[k] && k !== 'limit')) {
            console.log('FALLBACK: No matching results found. Showing top national providers.')
            return getProvidersWithSearch({ limit: filters.limit })
        }
    }

    // 5. Final Sort & Limit
    // Ranking is never affected by payment: paid tiers change what a profile
    // shows, never where it ranks. (See config/niche.js pricing tiers:
    // "Does not change your ranking or Clarity Score".)
    const sorted = finalProviders.sort((a: any, b: any) => {
        // Distance Sort requested: evaluate proximity first
        if (filters.sort === 'distance' && filters.userLat && filters.userLng && a.lat && a.lng && b.lat && b.lng) {
            const distA = Math.sqrt(Math.pow(a.lat - filters.userLat, 2) + Math.pow(a.lng - filters.userLng, 2))
            const distB = Math.sqrt(Math.pow(b.lat - filters.userLat, 2) + Math.pow(b.lng - filters.userLng, 2))
            return distA - distB
        }

        // Priority Sort requested
        if (filters.sort === 'priority') {
            return (b.priority_score || 0) - (a.priority_score || 0)
        }

        // Default: Priority Score -> Clarity Score™ -> Reviews
        if (Math.abs((b.priority_score || 0) - (a.priority_score || 0)) > 0.1) {
            return (b.priority_score || 0) - (a.priority_score || 0)
        }

        return (b.clarityScore || 0) - (a.clarityScore || 0)
    })

    if (filters.limit) {
        return sorted.slice(0, filters.limit)
    }

    return sorted
}

export async function getTopScoringProviders(limit: number = 6, userLat?: number, userLng?: number, userCity?: string, userState?: string) {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return []

    let finalProviders: any[] = []

    // 1. Try Localized First (City Match)
    if (userCity) {
        const { data: cityData } = await supabase
            .from('providers')
            .select('*, practitioners:provider_practitioners(name:full_name, credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date, npi_number)')
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
            .select('*, practitioners:provider_practitioners(name:full_name, credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date, npi_number)')
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
            .select('*, practitioners:provider_practitioners(name:full_name, credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date, npi_number)')
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
            const servicesOffered = p.services_offered || []
            const regenCount = (servicesOffered || []).filter((s: string) => REGEN_TREATMENTS.includes(s)).length
            const hasAdvancedTox = (servicesOffered || []).some((s: string) => ADVANCED_TOXINS.includes(s))
            const hasAI = (servicesOffered || []).some((s: string) => AI_DIAGNOSTICS.includes(s))

            const scoreBreakdown = scoreProvider(p)

            mapped.push({
                id: p.id,
                name: p.name,
                slug: p.slug,
                business_type: p.business_type,
                city: p.city,
                state: p.state,
                lat: p.lat || 0,
                lng: p.lng || 0,
                rating: p.rating || parseFloat(p.average_rating || 0),
                review_count: p.review_count || 0,
                score_total: scoreBreakdown.points,
                points: scoreBreakdown.points,
                price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
                imageUrl: (() => {
                    const url = p.hero_image_url || p.image_url;
                    if (!url || url.includes('placeholder') || url.includes('unsplash.com')) return null;
                    return url;
                })(),
                website: p.website,
                listingTier: p.listing_tier || 'free',
                npi_verified: p.npi_verified || false,
                score_results_quality: p.score_results_quality || 0,
                has_real_photo: !!(p.hero_image_url || p.image_url),
                score: scoreBreakdown,
                clarityScore: scoreBreakdown.points,
                practitioners: p.practitioners || []
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
        return (b.points ?? -1) - (a.points ?? -1)
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

    const prices = data.map((p: any) => Number(p.price_per_unit)).filter(p => !isNaN(p) && p > 0)
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
        .select('*, practitioners:provider_practitioners(name:full_name, credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date, npi_number)')
        .eq('slug', slug)
        .single()

    if (!data) return null

    const services = data.services_offered || []
    const regenCount = services.filter((s: string) => REGEN_TREATMENTS.includes(s)).length
    const hasAdvancedTox = services.some((s: string) => ADVANCED_TOXINS.includes(s))
    const hasAI = services.some((s: string) => AI_DIAGNOSTICS.includes(s))

    const score = scoreProvider(data)

    return {
        ...data,
        businessType: data.business_type,
        averageRating: parseFloat(data.rating || data.average_rating || 0),
        reviewCount: data.review_count || 0,
        listingTier: data.listing_tier || 'free',
        imageUrl: (() => {
            const url = data.hero_image_url || data.image_url;
            if (!url || url.includes('placeholder') || url.includes('unsplash.com')) return null;
            if (url.startsWith('http')) return url;
            return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider_images/${url}`;
        })(),

        // NPI Fields
        npi_number: data.npi_number,
        npi_verified: data.npi_verified,
        npi_license_type: data.npi_license_type,
        npi_specialty: data.npi_specialty,
        npi_verified_at: data.npi_verified_at,
        allergan_tier: data.allergan_tier,

        score,
        score_total: score.points,
        clarityScore: score.points,
        pricePerUnit: data.price_per_unit || data.botox_price_per_unit || data.enriched_attrs?.price_per_unit_botox,
        price_per_unit: data.price_per_unit || data.botox_price_per_unit || data.enriched_attrs?.price_per_unit_botox,

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


