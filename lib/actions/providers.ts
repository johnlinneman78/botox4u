'use server'

import { ProviderFilters } from '@/lib/types'

export async function getProviders(filters: ProviderFilters = {}) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    let query = supabase
        .from('providers')
        .select('*')
        .order('listing_tier', { ascending: false })
        .order('average_rating', { ascending: false })

    if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,city.ilike.%${filters.query}%,state.ilike.%${filters.query}%`)
    }

    if (filters.city) {
        query = query.ilike('city', filters.city)
    }

    if (filters.state) {
        query = query.ilike('state', filters.state)
    }

    if (filters.tier) {
        query = query.eq('listing_tier', filters.tier)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching providers:', error)
        return []
    }

    return data
}

export async function getProviderBySlug(slug: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('providers')
        .select('*, reviews(*)')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching provider with slug ${slug}:`, error)
        return null
    }

    return data
}

export async function getCityStats(city: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('providers')
        .select('price_per_unit, average_rating')
        .ilike('city', city)

    if (error || !data) return null

    const validPrices = data.map(p => Number(p.price_per_unit)).filter(p => !isNaN(p) && p > 0)
    const avgCost = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 15

    return {
        avgCost: Math.round(avgCost),
        providerCount: data.length,
        avgRating: data.reduce((a, b) => a + Number(b.average_rating), 0) / data.length || 0
    }
}

export async function getProviderDashboardData() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    // 1. Get the provider profile linked to this user
    const { data: provider, error: pError } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

    if (pError || !provider) {
        return { provider: null, leads: [], stats: { totalLeads: 0, profileViews: '1.2k' } }
    }

    // 2. Get latest leads
    const { data: leads, error: lError } = await supabase
        .from('leads')
        .select('*')
        .eq('provider_id', provider.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // 3. Simple stats
    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', provider.id)

    return {
        provider,
        leads: leads || [],
        stats: {
            totalLeads: totalLeads || 0,
            profileViews: '1.2k',
            avgRating: provider.average_rating
        }
    }
}

export async function updateProviderProfile(formData: FormData) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Not authenticated' }

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price_per_unit: formData.get('price_per_unit'),
        phone: formData.get('phone'),
        website: formData.get('website'),
        address: formData.get('address'),
        business_type: formData.get('business_type'),
    }

    const { error } = await supabase
        .from('providers')
        .update(rawData)
        .eq('user_id', session.user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    return { success: true }
}
