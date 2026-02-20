export interface EnrichedProvider {
    id: string;
    // Base fields from providers table
    name: string;
    slug: string;
    city: string;
    state: string;
    business_type: string;
    price_per_unit: number | null;
    min_treatment_price?: number | null;
    listing_tier?: string;

    // Enriched fields
    google_place_id: string | null;
    rating: number | null;
    review_count: number | null;
    hero_image_url: string | null;
    gallery: string[];
    top_reviews: Review[];
    ai_description: string | null;
    ai_description_confirmed: boolean;
    badges: string[];
    services_offered?: string[];
    enriched_at: Date | string;

    // UI derivation & UI-specific fields
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
    listingTier: string;
    verified: boolean;
    website?: string | null;
    phone?: string | null;
    description?: string | null;
    pricePerUnit?: number | null;
    minTreatmentPrice?: number | null;
    enriched_attrs?: any;
    reviews?: Review[];

    score?: {
        grade: string;
        points: number;
        total: string; // Legacy support
        breakdown: {
            resultsQuality: number;
            price: number;
            trust: number;
            safety: number;
            transparency: number;
            responsiveness: number;
        };
    };

    // NPI Verification fields
    npi_number?: string | null;
    npi_verified?: boolean;
    npi_license_type?: string | null;
    npi_specialty?: string | null;
    npi_verified_at?: string | Date | null;
    allergan_tier?: string; // 'Diamond', 'Platinum', 'Top 500', etc.

    // Warning flags
    warning_flag?: boolean;
    warning_reason?: string | null;
    score_results_quality?: number;
    positive_keyword_count?: number;
    negative_keyword_count?: number;
    has_real_photo?: boolean;
}

export interface Review {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    source: 'google' | 'yelp';
    relative_time_description: string;
    profile_photo_url: string;
    author_url: string;
}

export interface PlaceDetails {
    place_id: string;
    rating: number;
    user_ratings_total: number;
    reviews: google.maps.places.PlaceReview[];
    photos: google.maps.places.PlacePhoto[];
}

export interface EnrichmentConfig {
    googleApiKey: string;
    yelpApiKey?: string;
    openaiApiKey: string;
    dryRun: boolean;
}
