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
    treatment_slugs?: string[]
    enriched_attrs?: {
        offers_masseter_botox?: boolean
        offers_gummy_smile?: boolean
        offers_hyperhidrosis?: boolean
        price_per_unit_stated?: number
        new_patient_special?: string
        injector_credentials?: string[]
        years_in_business?: number
    }
    created_at: string
    outreach_status?: 'not_sent' | 'sent' | 'responded' | 'claimed'
    date_sent?: string
}
