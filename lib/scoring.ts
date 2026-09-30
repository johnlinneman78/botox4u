/**
 * Clarity Score™ (v3, 2026-09-29)
 *
 * One question: "How much can a patient confirm about this provider before
 * booking?" Every point comes from data we actually hold and can show.
 * Paid plans, manufacturer tiers and the number of treatments sold never
 * add points. /methodology describes exactly this; keep the two in sync.
 *
 *   Credentials        40  NPI match confirmed (20), injector license type
 *                          (up to 15), 5+ years licensed (5)
 *   Patient reviews    40  rating adjusted for review volume (25),
 *                          review volume (15)
 *   Price transparency 10  a published per-unit price
 *   Contact & booking  10  website (4), phone (3), online booking link (3)
 *
 * If a provider has fewer than 5 reviews AND no confirmed NPI match, there
 * isn't enough data to score fairly: points = null ("Not enough data").
 */

export interface ScoreBreakdown {
    credentials: number
    reviews: number
    pricing: number
    access: number
}

export interface ClarityScore {
    points: number | null
    grade: string
    breakdown: ScoreBreakdown
    /** Plain-English reasons shown on the profile */
    notes: string[]
}

export const SCORE_MAX: ScoreBreakdown = { credentials: 40, reviews: 40, pricing: 10, access: 10 }

// Bayesian prior: a clinic with few reviews is pulled toward a typical rating
const PRIOR_RATING = 4.3
const PRIOR_WEIGHT = 20

type Practitioner = {
    credentials?: string | null
    taxonomy?: string | null
    is_npi_verified?: boolean | null
    npi_enumeration_date?: string | null
}

function licensePoints(text: string): { points: number; label: string } {
    const t = ` ${text.toUpperCase().replace(/[.,/]/g, ' ')} `
    if (/\s(MD|DO)\s/.test(t) || /PHYSICIAN/.test(t)) return { points: 15, label: 'physician (MD/DO)' }
    if (/\s(NP|FNP|DNP|APRN|CRNA|NP-C|FNP-C|AGNP)\s|NURSE PRACTITIONER/.test(t)) return { points: 12, label: 'nurse practitioner' }
    if (/\s(PA|PA-C)\s|PHYSICIAN ASSISTANT/.test(t)) return { points: 12, label: 'physician assistant' }
    if (/\s(RN|BSN)\s|REGISTERED NURSE/.test(t)) return { points: 8, label: 'registered nurse' }
    return { points: 0, label: '' }
}

export function getGrade(points: number | null): string {
    if (points === null) return 'Not enough data'
    if (points >= 85) return 'A'
    if (points >= 70) return 'B'
    if (points >= 55) return 'C'
    return 'D'
}

/** Score a provider row as it comes from Supabase (with optional practitioners). */
export function scoreProvider(p: any): ClarityScore {
    const notes: string[] = []

    // ── Credentials (40) ────────────────────────────────────────────────
    let credentials = 0
    const practitioners: Practitioner[] = Array.isArray(p?.practitioners) ? p.practitioners : []
    const npiConfirmed = !!p?.npi_verified || practitioners.some(x => x?.is_npi_verified)
    if (npiConfirmed) {
        credentials += 20
        notes.push('NPI registry match confirmed')
    } else {
        notes.push('Credentials not yet confirmed against the NPI registry')
    }

    let best = { points: 0, label: '' }
    const licenseSources = [
        p?.npi_license_type,
        ...practitioners.filter(x => x?.is_npi_verified).flatMap(x => [x?.credentials, x?.taxonomy]),
    ].filter(Boolean) as string[]
    if (npiConfirmed) {
        for (const s of licenseSources) {
            const l = licensePoints(s)
            if (l.points > best.points) best = l
        }
    }
    if (best.points) {
        credentials += best.points
        notes.push(`Injector licensed as a ${best.label}`)
    }

    const enumerationYears = practitioners
        .filter(x => x?.is_npi_verified && x?.npi_enumeration_date)
        .map(x => (Date.now() - new Date(x.npi_enumeration_date as string).getTime()) / (365.25 * 24 * 3600 * 1000))
    if (enumerationYears.some(y => y >= 5)) {
        credentials += 5
        notes.push('Licensed for 5+ years')
    }

    // ── Reviews (40) ────────────────────────────────────────────────────
    const rating = Number(p?.rating ?? p?.average_rating ?? 0) || 0
    const count = Math.max(0, Number(p?.review_count ?? 0) || 0)
    let reviews = 0
    if (rating > 0 && count > 0) {
        const adjusted = (rating * count + PRIOR_RATING * PRIOR_WEIGHT) / (count + PRIOR_WEIGHT)
        const ratingPts = Math.max(0, Math.min(25, (adjusted - 4.0) * 25))
        const volumePts = Math.max(0, Math.min(15, 5 * Math.log10(count)))
        reviews = ratingPts + volumePts
        notes.push(`${rating.toFixed(1)}★ from ${count.toLocaleString()} reviews`)
    }

    // ── Price transparency (10) ─────────────────────────────────────────
    const price = p?.price_per_unit ?? p?.botox_price_per_unit ?? p?.enriched_attrs?.price_per_unit_botox
    const pricing = price ? 10 : 0
    notes.push(price ? `Publishes pricing ($${price}/unit)` : 'No published per-unit price')

    // ── Contact & booking (10) ──────────────────────────────────────────
    const access = (p?.website ? 4 : 0) + (p?.phone ? 3 : 0) + (p?.booking_url ? 3 : 0)

    const breakdown: ScoreBreakdown = {
        credentials: Math.round(credentials),
        reviews: Math.round(reviews),
        pricing,
        access,
    }

    const enoughData = npiConfirmed || count >= 5
    const points = enoughData
        ? Math.min(100, breakdown.credentials + breakdown.reviews + breakdown.pricing + breakdown.access)
        : null

    return { points, grade: getGrade(points), breakdown, notes }
}

/** "72/100" or "Not enough data" for display. Never invents a number. */
export function formatScore(points: number | null | undefined): string {
    return typeof points === 'number' && !Number.isNaN(points) ? `${Math.round(points)}/100` : 'Not enough data'
}
