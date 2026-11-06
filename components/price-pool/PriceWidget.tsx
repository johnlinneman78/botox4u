'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PriceReportWidget } from '@/components/providers/PriceReportWidget'
import { SEED_CITIES, contributorKey } from '@/lib/price-pool-seed'

// Price widget — the first thing a visitor sees.
//
// One job: answer "what should this treatment cost in my city?" with
// real numbers, or say honestly that there are none yet.
//
// Two datasets, never mixed:
// - Patient-reported ranges, from /api/price-pool (seed cities only:
//   Asheville, Austin, Scottsdale) or from /api/price-report-count
//   (everywhere else — a count only, never a range). A range appears
//   only at 20+ approved reports ("Early range"), full at 100+.
//   Below 20 the widget says so and asks for a report.
// - Clinic-published average, from /api/city-price: the mean of
//   per-unit prices clinics in that city actually publish. Labeled as
//   exactly that. When no clinic publishes a price, it says so — never
//   a guessed number, never another city's average.
//
// The share form opens inline, preselected to the city + treatment the
// visitor just picked. The copy never promises anonymity as a technical
// guarantee — the supported statement is that an individual report is
// never published.

export interface PriceWidgetCity {
    name: string
    slug: string // e.g. 'fl/miami'
    state?: string // e.g. 'FL' — carried for callers that have it; the widget itself keys off slug
}

const TREATMENTS = [
    { key: 'botox', label: 'Botox', shortLabel: 'Botox', unitLabel: 'per unit' },
    { key: 'lip-filler', label: 'Lip Filler', shortLabel: 'lip filler', unitLabel: 'per syringe' },
] as const

type TreatmentKey = (typeof TREATMENTS)[number]['key']

interface PoolAggregate {
    status: 'collecting' | 'provisional' | 'full'
    count: number
    neededForProvisional?: number
    minPerUnit?: number | null
    maxPerUnit?: number | null
    medianPerUnit?: number | null
    lastUpdated?: string | null
    breakdownByQuantity?: Array<{ bucket: string; count: number; medianPerUnit: number }>
    breakdownByMonth?: Array<{ month: string; count: number; medianPerUnit: number }>
}

interface CityPrice {
    avgCost: number | null
    pricedProviderCount: number
    providerCount: number
}

function citySlugParts(slug: string): { state: string; city: string } {
    const [state, city] = slug.split('/')
    return { state: (state || '').toUpperCase(), city: city || '' }
}

export function PriceWidget({
    cities,
    defaultCitySlug = null,
    fixedCity = null,
    initialAvgCost,
    initialProviderCount,
}: {
    cities: PriceWidgetCity[]
    defaultCitySlug?: string | null
    fixedCity?: PriceWidgetCity | null
    /** City page already knows these — pass them to skip a fetch. */
    initialAvgCost?: number | null
    initialProviderCount?: number | null
}) {
    const [citySlug, setCitySlug] = useState(fixedCity ? fixedCity.slug : defaultCitySlug ?? '')
    const [treatmentKey, setTreatmentKey] = useState<TreatmentKey>('botox')
    const [pool, setPool] = useState<PoolAggregate | null>(null)
    const [cityPrice, setCityPrice] = useState<CityPrice | null>(
        fixedCity && initialAvgCost !== undefined
            ? { avgCost: initialAvgCost, pricedProviderCount: 0, providerCount: initialProviderCount ?? 0 }
            : null
    )
    const [loading, setLoading] = useState(false)
    const [unavailable, setUnavailable] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)
    const [isContributor, setIsContributor] = useState(false)

    const selectedCity = fixedCity ?? cities.find((c) => c.slug === citySlug) ?? null
    const treatment = TREATMENTS.find((t) => t.key === treatmentKey) ?? TREATMENTS[0]
    const shareLabel = `Share your ${treatment.shortLabel} price`

    useEffect(() => {
        if (!selectedCity) {
            setPool(null)
            setCityPrice(fixedCity && initialAvgCost !== undefined ? { avgCost: initialAvgCost, pricedProviderCount: 0, providerCount: initialProviderCount ?? 0 } : null)
            setLoading(false)
            setUnavailable(false)
            return
        }
        const { state, city } = citySlugParts(selectedCity.slug)
        const isSeed = SEED_CITIES.some((c) => c.slug === city && c.state === state)
        try {
            setIsContributor(localStorage.getItem(contributorKey(city, treatmentKey)) === '1')
        } catch {
            setIsContributor(false)
        }
        setLoading(true)
        setUnavailable(false)
        setShareOpen(false)

        const pricePromise =
            fixedCity && initialAvgCost !== undefined
                ? Promise.resolve({ avgCost: initialAvgCost, pricedProviderCount: 0, providerCount: initialProviderCount ?? 0 } as CityPrice)
                : fetch(`/api/city-price?city=${encodeURIComponent(selectedCity.name)}&state=${state}`)
                      .then((r) => (r.ok ? r.json() : null))
                      .then((json) => (json ? { avgCost: json.avgCost, pricedProviderCount: json.pricedProviderCount ?? 0, providerCount: json.providerCount ?? 0 } : null))

        const poolPromise: Promise<PoolAggregate | null> = isSeed
            ? fetch(`/api/price-pool?city=${city}&state=${state}&treatment=${treatmentKey}`)
                  .then((r) => (r.ok ? r.json() : null))
                  .catch(() => null)
            : fetch(`/api/price-report-count?city=${encodeURIComponent(selectedCity.name)}&state=${state}&treatment=${treatmentKey}`)
                  .then((r) => (r.ok ? r.json() : null))
                  .then((json) => (json ? { status: 'collecting' as const, count: json.count } : null))
                  .catch(() => null)

        Promise.all([pricePromise, poolPromise])
            .then(([price, poolData]) => {
                setCityPrice(price)
                setPool(poolData)
                if (!price && !poolData) setUnavailable(true)
                setLoading(false)
            })
            .catch(() => {
                setUnavailable(true)
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity?.slug, treatmentKey])

    const cityPageHref = selectedCity ? `/injectors/${selectedCity.slug}` : '/find-providers'
    const hasRange = pool && pool.status !== 'collecting' && pool.minPerUnit != null && pool.maxPerUnit != null

    return (
        <section id="check-prices" className="scroll-mt-28">
            <div
                className="rounded-[2rem] border border-[#3D2B1F]/10 bg-[#FAF8F5] p-6 md:p-10"
                style={{ boxShadow: 'var(--shadow-lg)' }}
            >
                <h2
                    className="font-display font-medium leading-tight"
                    style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-espresso)' }}
                >
                    Check treatment prices near you
                </h2>
                <p className="font-body mt-2 leading-relaxed" style={{ fontSize: '15px', color: 'var(--color-stone)' }}>
                    Choose your city and treatment to see available patient-reported price ranges. Based on moderated
                    patient reports. Individual reports are never published.
                </p>

                {/* Selectors */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {fixedCity ? (
                        <span
                            className="font-body text-sm font-medium px-4 py-3 rounded-2xl border border-[#3D2B1F]/15 bg-white"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            {fixedCity.name}
                        </span>
                    ) : (
                        <select
                            className="flex-1 bg-white font-body text-sm px-4 py-3 rounded-2xl border border-[#3D2B1F]/15 outline-none cursor-pointer"
                            style={{ color: 'var(--color-stone)' }}
                            value={citySlug}
                            onChange={(e) => setCitySlug(e.target.value)}
                            aria-label="Your city"
                        >
                            <option value="" disabled>
                                Choose your city ▾
                            </option>
                            {cities.map((city) => (
                                <option key={city.slug} value={city.slug}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <div className="flex gap-2" role="group" aria-label="Treatment">
                        {TREATMENTS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTreatmentKey(t.key)}
                                aria-pressed={treatmentKey === t.key}
                                className="flex-1 sm:flex-none font-body text-sm font-medium px-5 py-3 rounded-full border transition-all"
                                style={{
                                    borderColor: treatmentKey === t.key ? 'var(--color-espresso)' : 'var(--color-border)',
                                    background: treatmentKey === t.key ? 'var(--color-espresso)' : 'white',
                                    color: treatmentKey === t.key ? 'var(--color-linen)' : 'var(--color-stone)',
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="mt-6">
                    {!selectedCity ? (
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Pick a city and a treatment above. We&apos;ll show you what people actually paid, or tell
                            you honestly if there isn&apos;t enough data yet.
                        </p>
                    ) : loading ? (
                        <p className="font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                            Checking prices in {selectedCity.name}…
                        </p>
                    ) : unavailable ? (
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Price data is unavailable right now. Try again shortly, or browse providers in{' '}
                            <Link href={cityPageHref} className="underline">
                                {selectedCity.name}
                            </Link>
                            .
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Patient-reported range */}
                                <div
                                    className="rounded-2xl border p-5 md:p-6"
                                    style={{ background: 'white', borderColor: 'var(--color-border)' }}
                                >
                                    <p
                                        className="font-body text-[10px] font-bold uppercase tracking-[0.15em]"
                                        style={{ color: 'var(--color-taupe)' }}
                                    >
                                        Patient-reported · {treatment.label} in {selectedCity.name}
                                    </p>
                                    {hasRange ? (
                                        <>
                                            <p
                                                className="font-display font-medium mt-3 leading-tight"
                                                style={{ fontSize: '28px', color: 'var(--color-espresso)' }}
                                            >
                                                ${pool!.minPerUnit}–${pool!.maxPerUnit} {treatment.unitLabel}
                                            </p>
                                            <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                                {pool!.status === 'provisional' ? 'Early range' : 'Price range'} · median $
                                                {pool!.medianPerUnit} {treatment.unitLabel} · {pool!.count} reviewed reports
                                                {pool!.lastUpdated ? ` · last updated ${pool!.lastUpdated}` : ''}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p
                                                className="font-display font-medium mt-3 leading-snug"
                                                style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                                            >
                                                Not enough reports to publish a range yet.
                                            </p>
                                            <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                                {pool ? (
                                                    <>
                                                        {pool.count} reviewed {pool.count === 1 ? 'report' : 'reports'} so far.
                                                        We publish a range at 20, and a full range at 100.{' '}
                                                        {pool.neededForProvisional != null && pool.neededForProvisional > 0
                                                            ? `${pool.neededForProvisional} more to go for the first range.`
                                                            : ''}
                                                    </>
                                                ) : (
                                                    <>No reviewed reports for this city and treatment yet.</>
                                                )}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Clinic-published average */}
                                <div
                                    className="rounded-2xl border p-5 md:p-6"
                                    style={{ background: 'white', borderColor: 'var(--color-border)' }}
                                >
                                    <p
                                        className="font-body text-[10px] font-bold uppercase tracking-[0.15em]"
                                        style={{ color: 'var(--color-taupe)' }}
                                    >
                                        Average of published clinic prices
                                    </p>
                                    {treatmentKey === 'botox' ? (
                                        cityPrice && cityPrice.avgCost != null ? (
                                            <>
                                                <p
                                                    className="font-display font-medium mt-3 leading-tight"
                                                    style={{ fontSize: '28px', color: 'var(--color-espresso)' }}
                                                >
                                                    ${cityPrice.avgCost} per unit
                                                </p>
                                                <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                                    Based on {cityPrice.pricedProviderCount || 'the'} clinics in{' '}
                                                    {selectedCity.name} that publish a per-unit price. This is what clinics
                                                    list, not what patients paid.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p
                                                    className="font-display font-medium mt-3 leading-snug"
                                                    style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                                                >
                                                    No clinic in {selectedCity.name} has published a price yet.
                                                </p>
                                                <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                                    That&apos;s why the patient-reported range matters. It&apos;s the only real
                                                    price data here until clinics publish.
                                                </p>
                                            </>
                                        )
                                    ) : (
                                        <p className="font-body text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                            Clinic-published averages are tracked for Botox per unit. Pick Botox above to
                                            see this city&apos;s average.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Contributor breakdown (seed cities, provisional/full only) */}
                            {hasRange && isContributor && pool!.breakdownByQuantity && pool!.breakdownByQuantity.length > 0 && (
                                <div className="mt-4 rounded-2xl border p-5 md:p-6" style={{ background: 'white', borderColor: 'var(--color-border)' }}>
                                    <h3 className="font-body text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-espresso)' }}>
                                        Full breakdown, unlocked because you shared
                                    </h3>
                                    <div className="mt-3">
                                        <p className="font-body font-bold text-sm" style={{ color: 'var(--color-espresso)' }}>By amount</p>
                                        <ul className="mt-2 space-y-1 font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                                            {pool!.breakdownByQuantity.map((b) => (
                                                <li key={b.bucket}>
                                                    {b.bucket}: median ${b.medianPerUnit} {treatment.unitLabel} ({b.count} reports)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {(pool!.breakdownByMonth ?? []).length > 0 && (
                                        <div className="mt-4">
                                            <p className="font-body font-bold text-sm" style={{ color: 'var(--color-espresso)' }}>By month</p>
                                            <ul className="mt-2 space-y-1 font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                                                {pool!.breakdownByMonth!.map((b) => (
                                                    <li key={b.month}>
                                                        {b.month}: median ${b.medianPerUnit} {treatment.unitLabel} ({b.count} reports)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                            {hasRange && !isContributor && (
                                <p className="font-body text-sm mt-4 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                    Want the full breakdown by amount and by month? Share what you paid and it unlocks here.
                                    The range above stays free for everyone.
                                </p>
                            )}

                            {/* CTA row */}
                            <div id="share-price" className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 scroll-mt-28">
                                <button
                                    type="button"
                                    onClick={() => setShareOpen((v) => !v)}
                                    className="rounded-full font-body text-sm font-bold px-6 py-3.5 transition-all hover:-translate-y-0.5"
                                    style={{ background: 'var(--color-espresso)', color: 'var(--color-linen)' }}
                                >
                                    {shareLabel}
                                </button>
                                {!fixedCity && (
                                    <Link
                                        href={cityPageHref}
                                        className="font-body text-sm font-medium underline underline-offset-4"
                                        style={{ color: 'var(--color-espresso)' }}
                                    >
                                        See providers in {selectedCity.name} →
                                    </Link>
                                )}
                                <Link
                                    href="/quiz"
                                    className="font-body text-sm underline underline-offset-4"
                                    style={{ color: 'var(--color-gold)' }}
                                >
                                    Or see your price estimate →
                                </Link>
                            </div>

                            {/* Share form */}
                            {shareOpen && (
                                <div id="price-report" className="mt-6 scroll-mt-28">
                                    <PriceReportWidget
                                        key={`${selectedCity.slug}-${treatmentKey}`}
                                        initialCity={selectedCity.name}
                                        initialTreatment={treatmentKey}
                                    />
                                </div>
                            )}

                            {/* Why strip */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    {
                                        step: '1. You report',
                                        text: `What you paid, ${treatment.unitLabel === 'per unit' ? 'per unit' : 'per syringe'}. About 30 seconds.`,
                                    },
                                    {
                                        step: '2. We combine',
                                        text: 'Your report goes to a review queue. We publish only combined ranges. No single price is ever shown on its own.',
                                    },
                                    {
                                        step: '3. Everyone can see',
                                        text: 'The next patient sees real ranges before booking, and clinics feel the pressure to publish.',
                                    },
                                ].map((s) => (
                                    <div key={s.step} className="rounded-2xl border p-4" style={{ background: 'white', borderColor: 'var(--color-border)' }}>
                                        <p className="font-body text-sm font-bold" style={{ color: 'var(--color-espresso)' }}>{s.step}</p>
                                        <p className="font-body text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-stone)' }}>{s.text}</p>
                                    </div>
                                ))}
                            </div>

                            <details className="mt-4">
                                <summary
                                    className="font-body text-sm font-medium cursor-pointer underline underline-offset-4"
                                    style={{ color: 'var(--color-espresso)' }}
                                >
                                    What happens after you submit?
                                </summary>
                                <p className="font-body text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: 'var(--color-stone)' }}>
                                    We review your price report before including it in the local dataset. Once a city and
                                    treatment have at least 20 approved reports, we can publish an early range. At 100
                                    approved reports, it becomes a full range. We never publish your individual report.
                                </p>
                            </details>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}
