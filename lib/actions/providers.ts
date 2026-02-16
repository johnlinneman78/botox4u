import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'

export async function getProviders(filters: {
    city?: string,
    state?: string,
    tier?: string,
    treatment?: string
} = {}) {
    const supabase = await getSupabaseServer(await cookies())

    let query = supabase
        .from('providers')
        .select('*')

    if (filters.city) {
        query = query.eq('city', filters.city)
    }
    if (filters.state) {
        query = query.eq('state', filters.state)
    }
    if (filters.tier) {
        query = query.eq('listing_tier', filters.tier)
    }
    if (filters.treatment) {
        // treatment_slugs is a text[] column in Supabase
        query = query.contains('treatment_slugs', [filters.treatment])
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching providers:', error)
        return []
    }

    // Custom sort: Premium > Featured > Free
    const tierWeight = {
        'premium': 3,
        'featured': 2,
        'free': 1
    }

    return (data || []).sort((a: any, b: any) => {
        const weightA = tierWeight[a.listing_tier as keyof typeof tierWeight] || 0
        const weightB = tierWeight[b.listing_tier as keyof typeof tierWeight] || 0
        return weightB - weightA
    })
}

export async function getCityStats(city: string) {
    const supabase = await getSupabaseServer(await cookies())

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, average_rating')
        .eq('city', city)

    if (error || !data || data.length === 0) return null

    const avgCost = data.reduce((acc: number, curr: any) => acc + (Number(curr.price_per_unit) || 0), 0) / data.length
    const avgRating = data.reduce((acc: number, curr: any) => acc + (Number(curr.average_rating) || 0), 0) / data.length

    return {
        avgCost: Math.round(avgCost),
        avgRating: Number(avgRating.toFixed(1)),
        providerCount: data.length
    }
}

export async function getStateStats(state: string) {
    const supabase = await getSupabaseServer(await cookies())

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

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, min_treatment_price')
        .eq('city', city)
        .eq('state', state)
        .contains('treatment_slugs', [treatment])

    if (error || !data || data.length === 0) return null

    const prices = data.map((p: any) => Number(p.price_per_unit || 15))
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

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching provider:', error)
        return null
    }

    return data
}

export async function submitLead(leadData: any) {
    // Lead submission logic
    console.log('Lead submitted:', leadData)
    return { success: true }
}

export async function updateProviderProfile(formData: FormData) {
    'use server'

    const supabase = await getSupabaseServer(await cookies())

    try {
        const providerId = formData.get('provider_id') as string

        const updates = {
            name: formData.get('name') as string,
            business_type: formData.get('business_type') as string,
            description: formData.get('description') as string,
            price_per_unit: parseFloat(formData.get('price_per_unit') as string),
            phone: formData.get('phone') as string,
            website: formData.get('website') as string,
            address: formData.get('address') as string,
        }

        const { error } = await supabase
            .from('providers')
            .update(updates)
            .eq('id', providerId)

        if (error) {
            console.error('Error updating provider:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating provider profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}
