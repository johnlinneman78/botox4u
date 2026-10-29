/**
 * Verified Aesthetics — price-pool seed, Oct 28, 2026 (John's ruling).
 *
 * Scope, exactly as ruled, and nothing more:
 * - Seed cities: Asheville NC, Austin TX, Scottsdale AZ. No other city
 *   gets a seed range from this module.
 * - Seed treatments: Botox (toxin, per unit) and Lip Filler (filler,
 *   per syringe). Sculptra/Radiesse are NOT in this seed.
 * - Gift/reward: NONE right now. No draw, no gift card, no cash per
 *   report. The only incentive in this seed is give-to-get: the range
 *   is free to everyone, the breakdown unlocks after you share a report.
 * - Thresholds, per city AND per treatment, counted separately:
 *   0-19 approved reports  -> status 'collecting', show NOTHING.
 *   20-99 approved reports -> status 'provisional', show range + median
 *                              with an "Early range" label.
 *   100+ approved reports  -> status 'full', same numbers, no early label.
 * - Aggregation rules, carried from the phase-1 design and never relaxed:
 *   Only status='approved' reports count. Pending and rejected reports
 *   never display. Flagged outliers never display.
 *   Only group numbers display: range, median, count, last-updated
 *   month/year. Never a single person's report, never "Clinic X paid $Y",
 *   never an exact treatment day. List prices published by clinics are
 *   a DIFFERENT dataset and are never mixed into a paid-price median.
 * - Breakdown (give-to-get only): by quantity bucket and by month/year,
 *   from fields price_reports actually collects. There is no neighborhood
 *   breakdown in this seed, because the form does not collect neighborhood.
 *   The gate is a soft, anonymous client-side unlock: after a successful
 *   report submission this browser is marked as a contributor. That is
 *   the point of give-to-get, not a security boundary, and the copy
 *   must never claim otherwise.
 */

export const SEED_PROVISIONAL_THRESHOLD = 20
export const SEED_FULL_THRESHOLD = 100

export interface SeedCity {
    slug: string
    name: string
    state: string
}

export interface SeedTreatment {
    key: 'botox' | 'lip-filler'
    label: string
    category: 'toxin' | 'filler'
    product: string
    unit: 'units' | 'syringes'
    unitLabel: string
}

export const SEED_CITIES: readonly SeedCity[] = [
    { slug: 'asheville', name: 'Asheville', state: 'NC' },
    { slug: 'austin', name: 'Austin', state: 'TX' },
    { slug: 'scottsdale', name: 'Scottsdale', state: 'AZ' },
] as const

export const SEED_TREATMENTS: readonly SeedTreatment[] = [
    { key: 'botox', label: 'Botox', category: 'toxin', product: 'botox', unit: 'units', unitLabel: 'per unit' },
    { key: 'lip-filler', label: 'Lip Filler', category: 'filler', product: 'lip filler', unit: 'syringes', unitLabel: 'per syringe' },
] as const

export type SeedStatus = 'collecting' | 'provisional' | 'full'

export function seedStatusForCount(count: number): SeedStatus {
    if (count >= SEED_FULL_THRESHOLD) return 'full'
    if (count >= SEED_PROVISIONAL_THRESHOLD) return 'provisional'
    return 'collecting'
}

export interface SeedReportRow {
    total_paid: number
    quantity: number
    treatment_date?: string | null
    submitted_at?: string | null
}

export interface SeedAggregate {
    city: string
    state: string
    treatment: string
    unitLabel: string
    count: number
    status: SeedStatus
    minPerUnit: number | null
    maxPerUnit: number | null
    medianPerUnit: number | null
    /** Month/year only, e.g. "Oct 2026". Never an exact day. */
    lastUpdated: string | null
    breakdownByQuantity: Array<{ bucket: string; count: number; medianPerUnit: number }>
    breakdownByMonth: Array<{ month: string; count: number; medianPerUnit: number }>
}

function median(values: number[]): number | null {
    if (values.length === 0) return null
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    const value = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    return Math.round(value * 100) / 100
}

function monthYear(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function quantityBucket(quantity: number, treatmentKey: string): string {
    if (treatmentKey === 'botox') {
        if (quantity < 20) return 'Under 20 units'
        if (quantity <= 40) return '20-40 units'
        return 'Over 40 units'
    }
    if (quantity < 1) return 'Under 1 syringe'
    if (quantity <= 1) return '1 syringe'
    return 'Over 1 syringe'
}

/**
 * Pure aggregate math, so it can be unit-tested without Supabase.
 * Callers must already have filtered to approved, non-outlier reports
 * for one city + one treatment. This function never sees names, emails,
 * clinic names, or exact days in its output.
 */
export function computeSeedAggregate(
    city: SeedCity,
    treatment: SeedTreatment,
    rows: SeedReportRow[],
): SeedAggregate {
    const perUnit = rows
        .map((r) => (r.quantity > 0 ? r.total_paid / r.quantity : null))
        .filter((v): v is number => v !== null && Number.isFinite(v) && v > 0)

    const byQuantity = new Map<string, number[]>()
    const byMonth = new Map<string, number[]>()
    let latest: string | null = null
    for (const row of rows) {
        const value = row.quantity > 0 ? row.total_paid / row.quantity : null
        if (value === null || !Number.isFinite(value) || value <= 0) continue
        const bucket = quantityBucket(row.quantity, treatment.key)
        byQuantity.set(bucket, [...(byQuantity.get(bucket) ?? []), value])
        const month = monthYear(row.treatment_date ?? row.submitted_at ?? null)
        if (month) byMonth.set(month, [...(byMonth.get(month) ?? []), value])
        const stamp = row.submitted_at ?? row.treatment_date ?? null
        if (stamp && (!latest || stamp > latest)) latest = stamp
    }

    return {
        city: city.name,
        state: city.state,
        treatment: treatment.label,
        unitLabel: treatment.unitLabel,
        count: perUnit.length,
        status: seedStatusForCount(perUnit.length),
        minPerUnit: perUnit.length ? Math.round(Math.min(...perUnit) * 100) / 100 : null,
        maxPerUnit: perUnit.length ? Math.round(Math.max(...perUnit) * 100) / 100 : null,
        medianPerUnit: median(perUnit),
        lastUpdated: monthYear(latest),
        breakdownByQuantity: [...byQuantity.entries()].map(([bucket, values]) => ({
            bucket,
            count: values.length,
            medianPerUnit: median(values) ?? 0,
        })),
        breakdownByMonth: [...byMonth.entries()].map(([month, values]) => ({
            month,
            count: values.length,
            medianPerUnit: median(values) ?? 0,
        })),
    }
}

export function isSeedCity(cityName: string, state: string): boolean {
    return SEED_CITIES.some(
        (c) => c.name.toLowerCase() === cityName.trim().toLowerCase() && c.state === state.trim().toUpperCase(),
    )
}

export function contributorKey(citySlug: string, treatmentKey: string): string {
    return `va-price-contributor:${citySlug}:${treatmentKey}`
}
