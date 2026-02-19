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
