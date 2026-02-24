import { calculateProviderScore } from './scoring'
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
    regenStatus: 'Regen-Forward ✅' | 'Mixed Protocol ⚠️' | 'Filler-Heavy 🔴'
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
    // 1. II-Score & Market Position
    const iiScore = clinicData?.score?.points || 0
    let marketPosition = 'Below market average'
    if (iiScore >= 85) marketPosition = 'Top 15%'
    else if (iiScore >= 70) marketPosition = 'Above market average'

    // 2. Regen-Ratio™
    // If clinicData has services_offered, calculate. Otherwise use 0 or default.
    const services = clinicData?.services_offered || []
    const regenCount = services.filter((s: string) =>
        REGEN_TREATMENTS.some(rt => s.toLowerCase().includes(rt.toLowerCase().split('/')[0].toLowerCase()))
    ).length
    const totalInjectableCount = (services.length || 1) // Avoid div by zero
    const regenRatioPercent = Math.round((regenCount / Math.max(1, totalInjectableCount)) * 100)

    let regenStatus: AuditResult['regenStatus'] = 'Filler-Heavy 🔴'
    if (regenRatioPercent > 40) regenStatus = 'Regen-Forward ✅'
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
    const naturalIntegrity = clinicData?.score?.breakdown?.naturalIntegrity || 0 // 0-35 scale
    let alignment: AuditResult['naturalAlignment'] = 'Moderate Match ⚠️'

    if (patientInput.primaryGoal === 'Natural, subtle enhancement') {
        if (naturalIntegrity >= 28) alignment = 'Strong Match ✅'
        else if (naturalIntegrity < 20) alignment = 'Misaligned ⚠️'
    } else {
        // For visible transformation, lower natural integrity might actually be "strong match" in their eyes but we still grade by safety
        alignment = 'Moderate Match ⚠️'
    }

    // 5. Innovation Score & Offerings
    const innovationScore = (clinicData?.score?.breakdown?.regenRatio || 0) / 1.5 // Rough mapping
    const offerings = INNOVATION_ITEMS.map(item => {
        let checked = false
        if (item.key === 'offers_long_acting_tox') checked = !!clinicData?.offers_long_acting_tox
        if (item.key === 'uses_ai_diagnostics') checked = !!clinicData?.uses_ai_diagnostics
        // Check services for others
        if (services.some((s: string) => s.toLowerCase().includes(item.label.toLowerCase().split(' ')[0]))) checked = true
        return { name: item.label, checked }
    })

    // 6. Recommendations
    let recommendations = "This clinic meets 2026 biological standards with strong Natural Integrity and fair market pricing. Proceed with confidence."
    if (regenRatioPercent < 20 && patientInput.primaryGoal === 'Natural, subtle enhancement') {
        recommendations = `⚠️ This clinic's menu is ${100 - regenRatioPercent}% traditional HA filler. For your goal of natural, subtle results, consider providers with Regen-Ratios above 35% in ${patientInput.city}.`
    } else if (priceResult.status === 'premium' && regenRatioPercent > 40) {
        recommendations = `⚠️ This clinic offers cutting-edge regenerative treatments but prices ${priceResult.percentageDiff}% above market average. Consider requesting an itemized quote.`
    } else if (naturalIntegrity < 15) {
        recommendations = `🔴 Patient reviews flag 'overdone' and 'frozen' at higher-than-average rates. For natural results, explore providers with Natural Integrity scores above 8.0.`
    }

    return {
        iiScore: Number((iiScore / 10).toFixed(1)),
        marketPosition,
        regenRatio: regenRatioPercent,
        regenRatioPercent,
        regenStatus,
        priceBenchmark: priceResult,
        naturalAlignment: alignment,
        innovationScore: Math.min(10, Math.round(innovationScore)),
        offerings,
        recommendations,
        alternatives: [] // To be populated by caller using search
    }
}
