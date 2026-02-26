import { NICHE } from '@/config/niche'

export interface ScoringFactors {
    price_per_unit?: number
    rating?: number
    review_count?: number
    has_photo?: boolean
    has_description?: boolean
    is_verified?: boolean
    npi_verified?: boolean
    allergan_tier?: string
    results_quality_score?: number
    website?: string
    responsiveness_score?: number
    // 2026 Factors
    regen_treatments_count?: number // Count of Ps, Exosomes, Sculptra
    offers_long_acting_tox?: boolean // Daxxify
    uses_ai_diagnostics?: boolean
}

export interface ScoreBreakdown {
    grade: string
    points: number
    total: string
    breakdown: {
        injectionQuality: number
        credentials: number
        innovation: number
        treatmentRange: number
    }
}

/**
 * Converts a numeric score (0-100) to a letter grade
 */
export function getGrade(score: number): string {
    if (score === 0) return 'Pending'
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 60) return 'C'
    return 'Pending'
}

/**
 * Calculates the TrueScore™ based on the 2026 Strategic Pivot
 * 1. Injection Quality (40%)
 * 2. Provider Credentials (25%)
 * 3. Innovation Adoption (20%)
 * 4. Treatment Range (15%)
 */
export function calculateProviderScore(factors: ScoringFactors, cityAveragePrice: number = NICHE.priceRange.min + 5): ScoreBreakdown {
    // 1. Injection Quality (40 pts)
    // Primary signal: natural, subtle, balanced results
    let injectionQuality = factors.results_quality_score || 0
    // If no quality score but high rating, give a baseline
    if (!injectionQuality && factors.rating && factors.rating >= 4.5) injectionQuality = 25
    else if (!injectionQuality && factors.rating && factors.rating >= 4.0) injectionQuality = 20
    injectionQuality = Math.min(40, injectionQuality)

    // 2. Provider Credentials (25 pts)
    // Verified NPI, board certifications (trust signals)
    let credentials = (factors.npi_verified || factors.is_verified) ? 20 : 10
    if (factors.allergan_tier && ['platinum', 'diamond', 'black_diamond'].includes(factors.allergan_tier.toLowerCase())) {
        credentials += 5
    }
    credentials = Math.min(25, credentials)

    // 3. Innovation Adoption (20 pts)
    // Rewards newest treatments (PNs, Exosomes, Daxxify, AI)
    let innovation = 0
    if (factors.regen_treatments_count) {
        if (factors.regen_treatments_count >= 3) innovation += 12
        else if (factors.regen_treatments_count >= 1) innovation += 8
    }
    if (factors.offers_long_acting_tox) innovation += 4
    if (factors.uses_ai_diagnostics) innovation += 4
    // Baseline for active providers
    if (innovation === 0 && (factors.regen_treatments_count === 0)) innovation = 5
    innovation = Math.min(20, innovation)

    // 4. Treatment Range (15 pts)
    // NEW: Breadth and depth (Traditional + Next-Gen)
    let treatmentRange = 5 // Baseline for listing
    if (factors.regen_treatments_count && factors.regen_treatments_count >= 1) {
        // High range if they offer traditional AND regen
        treatmentRange += 10
    } else if (factors.price_per_unit || factors.has_description) {
        // Moderate range for established traditional practices
        treatmentRange += 5
    }
    treatmentRange = Math.min(15, treatmentRange)

    const totalPoints = Math.min(100,
        injectionQuality +
        credentials +
        innovation +
        treatmentRange
    )

    return {
        grade: getGrade(totalPoints),
        points: totalPoints,
        total: getGrade(totalPoints),
        breakdown: {
            injectionQuality,
            credentials,
            innovation,
            treatmentRange
        }
    }
}

