export interface ProviderFilters {
    query?: string
    city?: string
    state?: string
    tier?: string
}

export interface Provider {
    id: string
    user_id?: string
    name: string
    slug: string
    business_type: string
    city: string
    state: string
    address?: string
    phone?: string
    website?: string
    average_rating: number
    review_count: number
    listing_tier: 'free' | 'featured' | 'premium'
    verified: boolean
    price_per_unit?: number
    min_treatment_price?: number
    description?: string
    credentials?: string[]
    services_offered?: any[]
    created_at: string
}
