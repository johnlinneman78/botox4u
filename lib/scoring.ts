import { NICHE } from '@/config/niche'

export interface ScoringFactors {
    price_per_unit?: number
    rating?: number
    review_count?: number
    has_photo?: boolean
    has_description?: boolean
    is_verified?: boolean
}

export interface ScoreBreakdown {
    total: number
    price_points: number
    trust_points: number
    transparency_points: number
    responsiveness_points: number
}

/**
 * Calculates the Botox-4U Score based on the Algorithm Roadmap V1
 */
export function calculateProviderScore(factors: ScoringFactors, cityAveragePrice: number = NICHE.priceRange.min + 5): ScoreBreakdown {
    let pricePoints = 0
    let trustPoints = 0
    let transparencyPoints = 0
    let responsivenessPoints = 3 // Baseline responsiveness

    // 1. Price Competitiveness (Max 30 pts)
    if (factors.price_per_unit) {
        // Points awarded for being below or near average
        // Full points if at or below city min, scaling down as it approaches city max
        const priceDiff = cityAveragePrice - factors.price_per_unit
        if (priceDiff >= 2) {
            pricePoints = 30 // Significantly cheaper
        } else if (priceDiff >= 0) {
            pricePoints = 25 // Slightly cheaper or average
        } else if (Math.abs(priceDiff) <= 2) {
            pricePoints = 15 // Competitive/Fair
        } else {
            pricePoints = 5 // Premium priced
        }
    }

    // 2. Google Trust (Max 50 pts)
    // Rating (25 pts)
    if (factors.rating) {
        if (factors.rating >= 4.8) trustPoints += 25
        else if (factors.rating >= 4.5) trustPoints += 20
        else if (factors.rating >= 4.0) trustPoints += 15
        else trustPoints += 5
    }

    // Review Count Scale (25 pts)
    if (factors.review_count) {
        if (factors.review_count >= 500) trustPoints += 25
        else if (factors.review_count >= 200) trustPoints += 20
        else if (factors.review_count >= 50) trustPoints += 15
        else trustPoints += 5
    }

    // 3. Transparency (Max 15 pts)
    if (factors.has_photo) transparencyPoints += 5
    if (factors.has_description) transparencyPoints += 5
    if (factors.price_per_unit) transparencyPoints += 5

    // 4. Verification Bonus
    if (factors.is_verified) responsivenessPoints = 5

    return {
        total: Math.min(100, pricePoints + trustPoints + transparencyPoints + responsivenessPoints),
        price_points: pricePoints,
        trust_points: trustPoints,
        transparency_points: transparencyPoints,
        responsiveness_points: responsivenessPoints
    }
}
