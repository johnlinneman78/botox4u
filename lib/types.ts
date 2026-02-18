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
    businessType: string
    city: string
    state: string
    address?: string
    phone?: string
    website?: string
    averageRating: number
    reviewCount: number
    listingTier: 'free' | 'featured' | 'premium'
    verified: boolean
    lat?: number
    lng?: number
    pricePerUnit?: number
    minTreatmentPrice?: number
    imageUrl?: string
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
    created_at?: string
    outreach_status?: 'not_sent' | 'sent' | 'responded' | 'claimed'
    date_sent?: string
}
