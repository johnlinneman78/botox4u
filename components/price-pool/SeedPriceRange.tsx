'use client'

import { useEffect, useState } from 'react'
import { contributorKey } from '@/lib/price-pool-seed'

// Seed price range display — Asheville, Austin, Scottsdale × Botox, Lip Filler.
// Rules built into this component, not just in copy:
// - Below 20 approved reports: no range, no median. It says how many
//   reports are in and how many more are needed for a provisional range.
// - 20-99: range + median, labelled "Early range" in plain words.
// - 100+: same numbers, no early label.
// - Breakdown (by quantity, by month/year) shows ONLY after this browser
//   has submitted a price report for this city + treatment. That is the
//   give-to-get rule. No gift card, no draw, no cash per report in this
//   seed — that piece was explicitly left out by John on Oct 28.
// - Never shows a single report, a clinic name, or an exact day.

interface Aggregate {
    city: string
    state: string
    treatment: string
    unitLabel: string
    count: number
    status: 'collecting' | 'provisional' | 'full'
    neededForProvisional?: number
    minPerUnit?: number | null
    maxPerUnit?: number | null
    medianPerUnit?: number | null
    lastUpdated?: string | null
    breakdownByQuantity?: Array<{ bucket: string; count: number; medianPerUnit: number }>
    breakdownByMonth?: Array<{ month: string; count: number; medianPerUnit: number }>
}

export function SeedPriceRange({
    citySlug,
    state,
    treatmentKey,
}: {
    citySlug: 'asheville' | 'austin' | 'scottsdale'
    state: string
    treatmentKey: 'botox' | 'lip-filler'
}) {
    const [data, setData] = useState<Aggregate | null>(null)
    const [loading, setLoading] = useState(true)
    const [isContributor, setIsContributor] = useState(false)

    useEffect(() => {
        try {
            setIsContributor(localStorage.getItem(contributorKey(citySlug, treatmentKey)) === '1')
        } catch {
            setIsContributor(false)
        }
        fetch(`/api/price-pool?city=${citySlug}&state=${state}&treatment=${treatmentKey}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                setData(json)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [citySlug, state, treatmentKey])

    if (loading) return null
    if (!data) return null

    if (data.status === 'collecting') {
        return (
            <div className="rounded-[2rem] border border-[#3D2B1F]/10 bg-[#FAF8F5] p-6 md:p-8">
                <p className="font-display text-xl md:text-2xl font-medium text-[#3D2B1F] leading-snug">
                    No price range for {data.treatment} in {data.city} yet.
                </p>
                <p className="text-[#3D2B1F]/70 leading-relaxed mt-3">
                    {data.count} reviewed {data.count === 1 ? 'report' : 'reports'} so far. We show a range at 20, and a
                    full range at 100. {data.neededForProvisional} more to go for the first range.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-[2rem] border border-[#3D2B1F]/10 bg-[#FAF8F5] p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3D2B1F]/60">
                {data.status === 'provisional' ? 'Early range — based on real paid prices' : 'Price range — based on real paid prices'}
            </p>
            <p className="font-display text-2xl md:text-3xl font-medium text-[#3D2B1F] leading-snug mt-3">
                {data.treatment} in {data.city}: ${data.minPerUnit} to ${data.maxPerUnit} {data.unitLabel}
            </p>
            <p className="text-[#3D2B1F]/70 leading-relaxed mt-3">
                Median ${data.medianPerUnit} {data.unitLabel}, based on {data.count} reviewed reports
                {data.lastUpdated ? `, last updated ${data.lastUpdated}` : ''}.
                {data.status === 'provisional'
                    ? ' This is an early range. It will tighten as more reports come in, and it becomes the full range at 100 reports.'
                    : ''}
            </p>

            {isContributor ? (
                <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2B1F]">Full breakdown — unlocked because you shared</h3>
                    <div>
                        <p className="font-bold text-[#3D2B1F]">By amount</p>
                        <ul className="mt-2 space-y-1 text-[#3D2B1F]/80">
                            {(data.breakdownByQuantity ?? []).map((b) => (
                                <li key={b.bucket}>
                                    {b.bucket}: median ${b.medianPerUnit} {data.unitLabel} ({b.count} reports)
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-[#3D2B1F]">By month</p>
                        <ul className="mt-2 space-y-1 text-[#3D2B1F]/80">
                            {(data.breakdownByMonth ?? []).map((b) => (
                                <li key={b.month}>
                                    {b.month}: median ${b.medianPerUnit} {data.unitLabel} ({b.count} reports)
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-[#3D2B1F]/70 leading-relaxed mt-6">
                    Want the full breakdown by amount and by month? Share what you paid, anonymously, and it unlocks
                    here. The range above stays free for everyone.
                </p>
            )}
        </div>
    )
}
