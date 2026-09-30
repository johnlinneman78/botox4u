import { NICHE } from '@/config/niche'

export interface AuditPatientInput {
    email: string
    providerId?: string
    providerName: string
    city: string
    state: string
    treatmentTypes: string[]
    primaryGoal: string
    priceQuoted?: string
    foundThrough?: string
}

export interface AuditResult {
    iiScore: number
    marketPosition: string
    regenRatio: number
    regenRatioPercent: number
    regenStatus: 'Innovation-Forward ✅' | 'Mixed Protocol ⚠️' | 'Traditional-Heavy 🔴'
    priceBenchmark: {
        quoted?: number
        average: number
        status: string
        label: string
        percentageDiff?: number
    }
    naturalAlignment: 'Strong Match ✅' | 'Moderate Match ⚠️' | 'Misaligned ⚠️'
    innovationScore: number
    offerings: { name: string; checked: boolean }[]
    recommendations: string
    alternatives: any[]
    stats: {
        rating: number
        reviewCount: number
        lastReviewDays: string
        treatmentCount: number
        regenRatio: string
    }
    breakdown: {
        satisfaction: number
        activity: number
        credentials: number
        pricing: number
        innovation: number
        range: number
    }
}

const REGEN_TREATMENTS = [
    'Polynucleotides (Rejuran/Plinest)',
    'Daxxify',
    'Sculptra/Radiesse',
    'Exosomes',
    'PRF/PRP'
]

const INNOVATION_ITEMS = [
    { key: 'offers_long_acting_tox', label: 'Daxxify (6-9 month neurotoxin)' },
    { key: 'uses_ai_diagnostics', label: 'AI skin mapping' },
    { key: 'polynucleotides', label: 'Polynucleotides (Rejuran/Plinest)' },
    { key: 'ultrasound', label: 'Ultrasound-guided injections' },
    { key: 'biostimulators', label: 'Sculptra/biostimulators' }
]

export function calculateClinicAudit(
    patientInput: AuditPatientInput,
    clinicData: any,
    cityStats: any
): AuditResult {
    // 1. Clarity Score™ & Market Position
    const rawPoints = clinicData?.score?.points || 0
    const iiScore = Number((rawPoints / 10).toFixed(1))
    let marketPosition = 'Below market average'
    if (iiScore >= 8.5) marketPosition = 'Top 15%'
    else if (iiScore >= 7.0) marketPosition = 'Above market average'

    // 2. Clinical Quality Ratio™
    const services = clinicData?.services_offered || []
    const regenCount = services.filter((s: string) =>
        REGEN_TREATMENTS.some(rt => s.toLowerCase().includes(rt.toLowerCase().split('/')[0].toLowerCase()))
    ).length
    const totalInjectableCount = Math.max(1, services.length)
    const regenRatioPercent = Math.round((regenCount / totalInjectableCount) * 100)

    let regenStatus: AuditResult['regenStatus'] = 'Traditional-Heavy 🔴'
    if (regenRatioPercent > 40) regenStatus = 'Innovation-Forward ✅'
    else if (regenRatioPercent >= 20) regenStatus = 'Mixed Protocol ⚠️'

    // 3. Price Benchmark
    const cityAvg = cityStats?.avgCost || (NICHE.priceRange.min + 5)
    let priceResult: AuditResult['priceBenchmark'] = {
        average: cityAvg,
        status: 'neutral',
        label: 'Fair Market Pricing ✅'
    }

    if (patientInput.priceQuoted) {
        const quoted = parseFloat(patientInput.priceQuoted.replace(/[^0-9.]/g, ''))
        if (!isNaN(quoted)) {
            const diff = ((quoted - cityAvg) / cityAvg) * 100
            priceResult.quoted = quoted
            priceResult.percentageDiff = Math.abs(Math.round(diff))

            if (diff > 25) {
                priceResult.status = 'premium'
                priceResult.label = 'Premium Pricing 🔴'
            } else if (diff > 10) {
                priceResult.status = 'above'
                priceResult.label = 'Above Market ⚠️'
            } else if (diff < -10) {
                priceResult.status = 'below'
                priceResult.label = 'Below Market 🟡'
            } else {
                priceResult.label = 'Fair Market Pricing ✅'
            }
        }
    }

    // 4. Natural Results Alignment
    const naturalIntegrity = clinicData?.score?.breakdown?.naturalIntegrity || 0
    let alignment: AuditResult['naturalAlignment'] = 'Moderate Match ⚠️'

    if (patientInput.primaryGoal === 'Natural, subtle enhancement') {
        if (naturalIntegrity >= 28) alignment = 'Strong Match ✅'
        else if (naturalIntegrity < 20) alignment = 'Misaligned ⚠️'
    } else {
        alignment = 'Moderate Match ⚠️'
    }

    // 5. Stats
    const lastReviewAt = clinicData?.last_review_at || clinicData?.updated_at
    let lastReviewDays = 'Recently'
    if (lastReviewAt) {
        const days = Math.floor((new Date().getTime() - new Date(lastReviewAt).getTime()) / (1000 * 60 * 60 * 24))
        lastReviewDays = days < 30 ? `${days}d` : '30d+'
    }

    const stats = {
        rating: clinicData?.rating || 4.5,
        reviewCount: clinicData?.review_count || 0,
        lastReviewDays,
        treatmentCount: services.length,
        regenRatio: (regenRatioPercent / 10).toFixed(1)
    }

    // 6. Breakdown (Target 100 points total for the UI report)
    // Map our existing scores to the 6 report categories (v2 names)
    const breakdown = {
        satisfaction: Math.round(((clinicData?.score?.breakdown?.trust || 8) / 10) * 20),
        activity: lastReviewDays.includes('d') && parseInt(lastReviewDays) < 15 ? 18 : 12,
        credentials: Math.round(((clinicData?.score?.breakdown?.safety || 10) / 15) * 20),
        pricing: patientInput.priceQuoted ? 8 : 4,
        innovation: Math.round((regenRatioPercent / 100) * 20),
        range: clinicData?.website ? 8 : 4
    }

    // 7. Recommendations
    let recommendations = "This clinic meets 2026 biological standards with strong Natural Integrity and fair market pricing. Proceed with confidence."
    if (regenRatioPercent < 20 && patientInput.primaryGoal === 'Natural, subtle enhancement') {
        recommendations = `⚠️ This clinic's menu is ${100 - regenRatioPercent}% traditional HA filler. For your goal of natural, subtle results, consider providers with Clinical Quality scores above 35% in ${patientInput.city}.`
    } else if (priceResult.status === 'premium' && regenRatioPercent > 40) {
        recommendations = `⚠️ This clinic offers cutting-edge regenerative treatments but prices ${priceResult.percentageDiff}% above market average. Consider requesting an itemized quote.`
    } else if (naturalIntegrity < 15) {
        recommendations = `🔴 Patient reviews flag 'overdone' and 'frozen' at higher-than-average rates. For natural results, explore providers with Natural Integrity scores above 8.0.`
    }

    return {
        iiScore,
        marketPosition,
        regenRatio: regenRatioPercent,
        regenRatioPercent,
        regenStatus,
        priceBenchmark: priceResult,
        naturalAlignment: alignment,
        innovationScore: Math.min(10, Math.round((clinicData?.score?.breakdown?.regenRatio || 0) / 1.5)),
        offerings: INNOVATION_ITEMS.map(item => ({
            name: item.label,
            checked: !!(clinicData?.[item.key] || services.some((s: string) => s.toLowerCase().includes(item.label.toLowerCase().split(' ')[0])))
        })),
        recommendations,
        alternatives: [],
        stats,
        breakdown
    }
}
