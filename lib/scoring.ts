/**
 * Clarity Score™ (v4, 2026-11-04)
 *
 * One question: "How much can a patient confirm about this provider before
 * booking?" Every point comes from data we actually hold and can show.
 * Paid plans, manufacturer tiers and the number of treatments sold never
 * add points. /methodology describes exactly this; keep the two in sync.
 *
 *   Patient reviews    40  rating adjusted for review volume (25),
 *                          review volume (15)
 *   Price transparency 10  a published per-unit price
 *   Contact details     7  website (4), phone (3)
 *
 * Raw total: 57. The published score rescales it to 100:
 *   points = round((reviews + pricing + access) / 57 * 100)
 * Rescaling keeps the ratios among the remaining parts, it does NOT keep
 * the old v3 weights (which were 40/40/10/10) and it does NOT keep the old
 * ranking order: v3 scores and v4 scores are different methodologies and
 * must never be compared as improvement or deterioration.
 *
 * Deliberately NOT in the score:
 * - NPI verification (John's Nov 4, 2026 ruling). An NPI match is shown as
 *   a separate "NPI Verified" badge on the listing, with the check date.
 *   No badge is not a penalty, and an unchecked record is not a zero.
 *   NPI match also does not validate state licensure; license checks are
 *   separate and must say so when shown.
 * - Booking links. Booking display is not a paid product (cut Nov 5,
 *   2026), so there is nothing to score. A stored booking_url adds
 *   nothing, and a booking display adds nothing either.
 *
 * If a provider has fewer than 5 reviews, there isn't enough data to
 * score fairly: points = null ("Not enough data").
 */

export interface ScoreBreakdown {
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

export const SCORE_MAX: ScoreBreakdown = { reviews: 40, pricing: 10, access: 7 }

/** Raw (unscaled) maximum: reviews 40 + pricing 10 + contact 7. */
export const SCORE_RAW_MAX = 57

// Bayesian prior: a clinic with few reviews is pulled toward a typical rating
const PRIOR_RATING = 4.3
const PRIOR_WEIGHT = 20

export function getGrade(points: number | null): string {
    if (points === null) return 'Not enough data'
    if (points >= 85) return 'A'
    if (points >= 70) return 'B'
    if (points >= 55) return 'C'
    return 'D'
}

/** Score a provider row as it comes from Supabase. */
export function scoreProvider(p: any): ClarityScore {
    const notes: string[] = []

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

    // ── Contact details (7) ─────────────────────────────────────────────
    // Website + phone only. Booking links are deliberately excluded: booking
    // display is paid, and scoring it would tie payment to the score.
    const access = (p?.website ? 4 : 0) + (p?.phone ? 3 : 0)
    if (p?.website) notes.push('Website listed')
    if (p?.phone) notes.push('Phone listed')

    const breakdown: ScoreBreakdown = {
        reviews: Math.round(reviews),
        pricing,
        access,
    }

    const raw = breakdown.reviews + breakdown.pricing + breakdown.access
    const enoughData = count >= 5
    const points = enoughData
        ? Math.min(100, Math.round((raw / SCORE_RAW_MAX) * 100))
        : null

    return { points, grade: getGrade(points), breakdown, notes }
}

/** "72/100" or "Not enough data" for display. Never invents a number. */
export function formatScore(points: number | null | undefined): string {
    return typeof points === 'number' && !Number.isNaN(points) ? `${Math.round(points)}/100` : 'Not enough data'
}
