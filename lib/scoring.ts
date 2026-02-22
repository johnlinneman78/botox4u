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
    if (score === 0) return 'Pending'
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 60) return 'C'
    return 'Pending' // Change from 'D' to 'Pending' for anything below 60
}

/**
 * Calculates the Botox-4U Score based on Version 2.2 (February 2026)
 * Follows the 5-Signal weighted approach + Warning Flags
 */
export function calculateProviderScore(factors: ScoringFactors, cityAveragePrice: number = NICHE.priceRange.min + 5): ScoreBreakdown {
    // 1. Natural Results Language (30 pts)
    // Derived from sentiment analysis of patient reviews
    let resultsQualityScore = factors.results_quality_score || 0
    resultsQualityScore = Math.min(30, Math.max(0, resultsQualityScore))

    // 2. Fair Pricing Score (25 pts)
    let priceScore = 0
    if (factors.price_per_unit) {
        const ratio = factors.price_per_unit / cityAveragePrice
        if (ratio <= 0.80) priceScore = 25
        else if (ratio <= 0.95) priceScore = 22
        else if (ratio <= 1.05) priceScore = 18
        else if (ratio <= 1.20) priceScore = 12
        else if (ratio <= 1.50) priceScore = 5
        else priceScore = 0
    }

    // 3. Credential Integrity (20 pts)
    let safetyScore = factors.npi_verified ? 20 : 0

    // 4. Patient Trust & Sentiment (15 pts)
    // Combination of review volume and star rating
    let trustScore = 0
    if (factors.review_count) {
        let volumeScore = 0
        if (factors.review_count >= 500) volumeScore = 10
        else if (factors.review_count >= 200) volumeScore = 8
        else if (factors.review_count >= 100) volumeScore = 6
        else if (factors.review_count >= 50) volumeScore = 4
        else volumeScore = 2

        let ratingScore = 0
        if (factors.rating && factors.rating >= 4.8) ratingScore = 5
        else if (factors.rating && factors.rating >= 4.5) ratingScore = 4
        else if (factors.rating && factors.rating >= 4.0) ratingScore = 2

        trustScore = volumeScore + ratingScore
    }

    // 5. Transparency (10 pts)
    let transparencyScore = factors.price_per_unit ? 10 : 0

    // 6. Responsiveness (Optional/Bonus or part of Trust)
    let responsivenessScore = factors.responsiveness_score || 0
    responsivenessScore = Math.min(5, responsivenessScore)

    const totalPoints = Math.min(100, resultsQualityScore + priceScore + trustScore + safetyScore + transparencyScore + responsivenessScore)

    // Warning Flag Logic
    let warning_flag = false
    let warning_reason = null

    if (factors.rating && factors.rating < 4.0) {
        warning_flag = true
        warning_reason = 'Average rating below 4.0'
    } else if (factors.price_per_unit && factors.price_per_unit > (cityAveragePrice * 2)) {
        warning_flag = true
        warning_reason = 'Pricing significantly above city average'
    } else if (factors.npi_verified === false) {
        // Only flag if explicitly checked and failed, not just pending
        // warning_flag = true
        // warning_reason = 'Unverified medical credentials'
    }

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
