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
        naturalIntegrity: number
        regenRatio: number
        price: number
        trust: number
        safety: number
        transparency: number
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
 * Calculates the II-Score based on Version 3.0 (February 2026 Strategic Pivot)
 * Prioritizes Regenerative Medicine and Natural Result Integrity
 */
export function calculateProviderScore(factors: ScoringFactors, cityAveragePrice: number = NICHE.priceRange.min + 5): ScoreBreakdown {
    // 1. Natural Results Integrity (35 pts) - UP from 30
    // Based on "Neo-Romantic" results (subtle, natural, conservative)
    let naturalIntegrityScore = factors.results_quality_score || 0
    naturalIntegrityScore = Math.min(35, Math.max(0, naturalIntegrityScore))

    // 2. Regen-Ratio™ & Advancement (15 pts) - NEW for 2026
    // Rewards Polynucleotides, Exosomes, and Biostimulators
    let regenScore = 0
    if (factors.regen_treatments_count) {
        if (factors.regen_treatments_count >= 3) regenScore = 10
        else if (factors.regen_treatments_count >= 1) regenScore = 5
    }
    // Advancement Bonus (Daxxify, AI)
    if (factors.offers_long_acting_tox) regenScore += 3
    if (factors.uses_ai_diagnostics) regenScore += 2
    regenScore = Math.min(15, regenScore)

    // 3. Fair Pricing Score (15 pts) - DOWN from 25
    let priceScore = 0
    if (factors.price_per_unit) {
        const ratio = factors.price_per_unit / cityAveragePrice
        if (ratio <= 0.85) priceScore = 15
        else if (ratio <= 1.05) priceScore = 12
        else if (ratio <= 1.25) priceScore = 8
        else priceScore = 0
    }

    // 4. Credential Integrity (15 pts) - DOWN from 20
    let safetyScore = factors.npi_verified ? 15 : 0

    // 5. Patient Trust & Sentiment (10 pts) - DOWN from 15
    let trustScore = 0
    if (factors.review_count) {
        let volumeScore = 0
        if (factors.review_count >= 200) volumeScore = 7
        else if (factors.review_count >= 50) volumeScore = 4
        else volumeScore = 2

        let ratingScore = 0
        if (factors.rating && factors.rating >= 4.7) ratingScore = 3
        else if (factors.rating && factors.rating >= 4.4) ratingScore = 2

        trustScore = volumeScore + ratingScore
    }

    // 6. Transparency & Presence (10 pts)
    let transparencyScore = 0
    if (factors.price_per_unit) transparencyScore += 4
    if (factors.has_photo) transparencyScore += 3
    if (factors.website) transparencyScore += 3
    transparencyScore = Math.min(10, transparencyScore)

    const totalPoints = Math.min(100, 
        naturalIntegrityScore + 
        regenScore + 
        priceScore + 
        trustScore + 
        safetyScore + 
        transparencyScore
    )

    return {
        grade: getGrade(totalPoints),
        points: totalPoints,
        total: getGrade(totalPoints),
        breakdown: {
            naturalIntegrity: naturalIntegrityScore,
            regenRatio: regenScore,
            price: priceScore,
            trust: trustScore,
            safety: safetyScore,
            transparency: transparencyScore
        }
    }
}
