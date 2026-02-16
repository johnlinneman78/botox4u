export interface Provider {
    id: string
    name: string
    slug: string
    businessType: string
    address: string
    city: string
    state: string
    zip: string
    phone: string
    website: string
    averageRating: number
    reviewCount: number
    listingTier: 'free' | 'featured' | 'premium'
    verified: boolean
    pricePerUnit?: number
    minTreatmentPrice?: number
    imageUrl?: string
    description: string
    services: { name: string; price: string }[]
    credentials: string[]
}

export const mockProviders: Provider[] = [
    {
        id: '1',
        name: 'Beverly Hills Aesthetic Institute',
        slug: 'beverly-hills-aesthetic-institute',
        businessType: 'Medspa',
        address: '435 N Bedford Dr, Suite 210',
        city: 'Beverly Hills',
        state: 'CA',
        zip: '90210',
        phone: '310.555.0123',
        website: 'https://example.com',
        averageRating: 4.9,
        reviewCount: 124,
        listingTier: 'premium',
        verified: true,
        pricePerUnit: 18,
        minTreatmentPrice: 350,
        description: 'Led by board-certified experts, we specialize in high-precision facial rejuvenation. Our focus is on natural-looking results using the latest injectable techniques.',
        services: [
            { name: 'Botox Cosmetic', price: '$18/unit' },
            { name: 'Lip Fillers', price: 'From $700' },
        ],
        credentials: ['Board Certified', 'Allergan Top 100'],
    },
    {
        id: '2',
        name: 'Miami Beauty Injectables',
        slug: 'miami-beauty-injectables',
        businessType: 'Clinic',
        address: '1000 Brickell Ave',
        city: 'Miami',
        state: 'FL',
        zip: '33131',
        phone: '305.555.0123',
        website: 'https://example.com',
        averageRating: 4.8,
        reviewCount: 89,
        listingTier: 'featured',
        verified: true,
        pricePerUnit: 14,
        minTreatmentPrice: 280,
        description: 'Specializing in South Florida aesthetics. We provide gentle, effective treatments for a youthful appearance.',
        services: [
            { name: 'Botox', price: '$14/unit' },
            { name: 'Dermal Fillers', price: 'From $600' },
        ],
        credentials: ['Certified Injectors'],
    },
    {
        id: '3',
        name: 'Dallas Botox Pros',
        slug: 'dallas-botox-pros',
        businessType: 'Dermatology',
        address: '2100 Ross Ave',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        phone: '214.555.0123',
        website: 'https://example.com',
        averageRating: 4.7,
        reviewCount: 56,
        listingTier: 'free',
        verified: false,
        pricePerUnit: 12,
        minTreatmentPrice: 240,
        description: 'Affordable, high-quality botox treatments in the heart of Dallas.',
        services: [
            { name: 'Botox', price: '$12/unit' },
        ],
        credentials: ['State Licensed'],
    },
]
