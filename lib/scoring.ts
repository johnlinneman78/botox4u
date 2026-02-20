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
}

export interface ScoreBreakdown {
    grade: string
    points: number
    total: string // For legacy support/compatibility (grade)
    breakdown: {
        resultsQuality: number
        price: number
        trust: number
        safety: number
        transparency: number
        responsiveness: number
    }
}

/**
 * Converts a numeric score (0-100) to a letter grade
 */
export function getGrade(score: number): string {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 60) return 'C'
    return 'D'
}

/**
 * Calculates the Botox-4U Score based on Version 2 (February 2026)
 */
export function calculateProviderScore(factors: ScoringFactors, cityAveragePrice: number = NICHE.priceRange.min + 5): ScoreBreakdown {
    let resultsQualityScore = factors.results_quality_score || 0 // Baseline 0
    let priceScore = 0
    let trustScore = 0
    let safetyScore = 0
    let transparencyScore = 0
    let responsivenessScore = factors.responsiveness_score || 0 // Baseline 0

    // 1. Results Quality Score (Max 30 pts)
    // Passed in from sentiment analysis script or neutralized
    resultsQualityScore = Math.min(30, Math.max(0, resultsQualityScore))

    // 2. Fair Pricing Score (Max 25 pts)
    if (factors.price_per_unit) {
        const ratio = factors.price_per_unit / cityAveragePrice
        if (ratio <= 0.80) priceScore = 25
        else if (ratio <= 0.90) priceScore = 20
        else if (ratio <= 1.00) priceScore = 17
        else if (ratio <= 1.10) priceScore = 13
        else if (ratio <= 1.25) priceScore = 8
        else priceScore = 3
    }

    // 3. Trust Score (Max 20 pts)
    if (factors.review_count) {
        if (factors.review_count >= 500) trustScore = 20
        else if (factors.review_count >= 200) trustScore = 16
        else if (factors.review_count >= 100) trustScore = 12
        else if (factors.review_count >= 50) trustScore = 8
        else if (factors.review_count >= 20) trustScore = 4
        else trustScore = 2
    }

    // 4. Safety & Credentials Score (Max 15 pts)
    if (factors.npi_verified) safetyScore += 8
    if (factors.rating && factors.rating >= 4.7) safetyScore += 4
    if (factors.review_count && factors.review_count >= 100) safetyScore += 3
    safetyScore = Math.min(15, safetyScore)

    // 5. Transparency Score (Max 7 pts)
    if (factors.price_per_unit) transparencyScore += 4
    if (factors.has_photo) transparencyScore += 1
    if (factors.has_description) transparencyScore += 1
    if (factors.website) transparencyScore += 1
    transparencyScore = Math.min(7, transparencyScore)

    // 6. Responsiveness Score (Max 3 pts)
    responsivenessScore = Math.min(3, responsivenessScore)

    const totalPoints = Math.min(100, resultsQualityScore + priceScore + trustScore + safetyScore + transparencyScore + responsivenessScore)

    return {
        grade: getGrade(totalPoints),
        points: totalPoints,
        total: getGrade(totalPoints),
        breakdown: {
            resultsQuality: resultsQualityScore,
            price: priceScore,
            trust: trustScore,
            safety: safetyScore,
            transparency: transparencyScore,
            responsiveness: responsivenessScore
        }
    }
}
