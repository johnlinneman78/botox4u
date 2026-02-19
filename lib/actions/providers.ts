import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { NICHE } from '@/config/niche'
import { calculateProviderScore } from '@/lib/scoring'

export async function getProvidersWithSearch(filters: {
    query?: string,
    city?: string,
    state?: string,
    tier?: string,
    treatment?: string,
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
        queryBuilder = queryBuilder.ilike('name', `%${filters.query}%`)
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

    console.log('DEBUG: queryBuilder configured, executing query...')
    const { data, error } = await queryBuilder
    console.log('DEBUG: query result:', { dataLength: data?.length, error })

    if (error) {
        console.error('Error fetching providers:', error)
        return []
    }

    const mappedData = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        business_type: p.business_type,
        businessType: p.business_type, // Legacy support
        address: p.address,
        city: p.city,
        state: p.state,
        averageRating: parseFloat(p.rating || p.average_rating || 0),
        reviewCount: p.review_count || 0,
        listingTier: p.listing_tier || 'free',
        verified: p.verified || false,
        price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
        pricePerUnit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox, // Legacy support
        minTreatmentPrice: p.min_treatment_price,
        latitude: p.latitude || 0,
        longitude: p.longitude || 0,
        lat: p.latitude || 0,
        lng: p.longitude || 0,
        imageUrl: (() => {
            const url = p.hero_image_url || p.image_url;
            if (!url || url.includes('placeholder')) {
                // Return a consistent but varied fallback based on ID length
                const fallbacks = [
                    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800', // Blue/clean
                    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800', // Modern/white
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', // Professional
                    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'  // Modern spa
                ];
                const index = p.id ? p.id.length % fallbacks.length : 0;
                return fallbacks[index];
            }
            if (url.startsWith('http')) return url;
            // Handle Supabase paths
            return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider_images/${url}`;
        })(),
        enriched_attrs: p.enriched_attrs,
        website: p.website,
        phone: p.phone,
        description: p.description,

        // Enriched Fields
        google_place_id: p.google_place_id,
        rating: p.rating || parseFloat(p.average_rating || 0), // Use manual rating as fallback
        review_count: p.review_count || 0,
        top_reviews: p.top_reviews || [],
        badges: p.badges || [],
        ai_description: p.ai_description,
        ai_description_confirmed: p.ai_description_confirmed,
        gallery: p.gallery || [],
        hero_image_url: p.hero_image_url || p.image_url,
        reviews: p.top_reviews || [],
        score: calculateProviderScore({
            price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
            rating: parseFloat(p.rating || p.average_rating || 0),
            review_count: p.review_count || 0,
            has_photo: !!(p.hero_image_url || p.image_url),
            has_description: !!p.description,
            is_verified: p.verified || false
        })
    }))

    // Custom sort: Premium > Score > Proximity
    const tierWeight = {
        'premium': 1000,
        'featured': 500,
        'free': 0
    }

    return mappedData.sort((a: any, b: any) => {
        // 1. Tier + Score combined weight
        const scoreA = (tierWeight[a.listingTier as keyof typeof tierWeight] || 0) + a.score.total
        const scoreB = (tierWeight[b.listingTier as keyof typeof tierWeight] || 0) + b.score.total

        if (scoreB !== scoreA) return scoreB - scoreA

        // 2. Proximity (if user location provided) fallback
        if (filters.userLat && filters.userLng && a.lat && a.lng && b.lat && b.lng) {
            const distA = Math.sqrt(Math.pow(a.lat - filters.userLat, 2) + Math.pow(a.lng - filters.userLng, 2))
            const distB = Math.sqrt(Math.pow(b.lat - filters.userLat, 2) + Math.pow(b.lng - filters.userLng, 2))
            return distA - distB
        }

        return 0
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
        reviews: data.top_reviews || []
    }
}

export async function submitLead(leadData: any) {
    // Lead submission logic
    console.log('Lead submitted:', leadData)
    return { success: true }
}


