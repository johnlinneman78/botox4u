'use client'

import { useState } from 'react'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { DividerPhoto } from '@/components/redesign/DividerPhoto'

// The unpaid provider list for a city page, with the sponsored section
// kept separate above it (see lib/featured-listings.ts — featured
// providers never mix into the unpaid order).
//
// Filter pills (redesign, Nov 6, 2026): All providers, Botox, Lip
// Filler, Published prices only, NPI verified. Botox and Lip Filler
// use the same derivation as the treatment tags on the cards
// (enriched_attrs / published per-unit price), so a pill never shows
// a provider the card does not tag. Featured providers are never
// filtered: a sponsored placement is a placement, not a price claim.
//
// Heading copy: "Providers in {city}" — directory inclusion is not
// verification, and the list is never described as verified as a whole.
// Per-practitioner NPI matching is shown on each card.

interface CityProviderListProps {
    city: string
    featured: any[]
    unpaid: any[]
    /** City's published-price average — passed to cards so a clinic with no
        own price shows the labeled city average instead of a blank. */
    cityAvgCost?: number | null
    /** Ambiance divider photo shown between the filters and the cards
        (redesign preview: one wide image per section break). */
    divider?: { src: string; alt: string; caption?: string }
}

type FilterKey = 'all' | 'botox' | 'lip-filler' | 'prices' | 'npi'

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All providers' },
    { key: 'botox', label: 'Botox' },
    { key: 'lip-filler', label: 'Lip Filler' },
    { key: 'prices', label: 'Published prices only' },
    { key: 'npi', label: 'NPI verified' },
]

export function CityProviderList({ city, featured, unpaid, cityAvgCost, divider }: CityProviderListProps) {
    const [filter, setFilter] = useState<FilterKey>('all')

    const hasPublishedPrice = (p: any) => p.pricePerUnit != null || p.price_per_unit != null
    const hasBotox = (p: any) =>
        p.enriched_attrs?.price_per_unit_botox != null || p.pricePerUnit != null || p.price_per_unit != null
    const hasLipFiller = (p: any) => p.enriched_attrs?.offers_lip_flip === true
    const hasNpiVerified = (p: any) =>
        p.npi_verified === true || (p.practitioners || []).some((pr: any) => pr.is_npi_verified === true)

    const matches = (p: any) => {
        if (filter === 'botox') return hasBotox(p)
        if (filter === 'lip-filler') return hasLipFiller(p)
        if (filter === 'prices') return hasPublishedPrice(p)
        if (filter === 'npi') return hasNpiVerified(p)
        return true
    }
    const visibleUnpaid = unpaid.filter(matches)
    const pricedCount = unpaid.filter(hasPublishedPrice).length

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filter providers">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        type="button"
                        aria-pressed={filter === f.key}
                        onClick={() => setFilter(f.key)}
                        className="min-h-[44px] px-[18px] rounded-full border text-sm font-medium transition-colors"
                        style={{
                            borderColor: 'var(--color-border)',
                            background: filter === f.key ? 'var(--color-espresso)' : '#fff',
                            color: filter === f.key ? '#fff' : 'var(--color-espresso)',
                        }}
                    >
                        {f.label}
                        {f.key === 'prices' && pricedCount > 0 ? ` (${pricedCount})` : ''}
                    </button>
                ))}
            </div>

            <p className="text-sm mb-6" style={{ color: 'var(--color-stone)' }}>
                <b style={{ color: 'var(--color-espresso)' }}>{visibleUnpaid.length} providers</b> in {city},
                ranked by Clarity Score.
            </p>

            {divider && (
                <DividerPhoto src={divider.src} alt={divider.alt} caption={divider.caption} />
            )}

            {/* Sponsored section: featured providers render here, ABOVE the
                unpaid results, in their own clearly labeled section —
                never mixed into the ranked order. The Featured tag on each
                card is in addition to this label. */}
            {featured.length > 0 && (
                <section aria-label="Sponsored providers" className="mb-12">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-stone)' }}>
                            Sponsored · Featured
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-stone)' }}>
                            Providers may purchase a clearly labeled advertising position. Payment never changes their Clarity Score, verification status, or position within the unpaid results.
                        </p>
                    </div>
                    <div className="space-y-8">
                        {featured.map((provider: any) => (
                            <div key={provider.id}>
                                <EnhancedProviderCard provider={provider} cityAvgCost={cityAvgCost} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Unpaid results, in their independent order. */}
            <div className="space-y-8">
                {visibleUnpaid.length > 0 ? (
                    visibleUnpaid.slice(0, 100).map((provider: any) => (
                        <div key={provider.id}>
                            <EnhancedProviderCard provider={provider} cityAvgCost={cityAvgCost} />
                        </div>
                    ))
                ) : unpaid.length === 0 ? (
                    <div
                        className="p-16 text-center rounded-3xl border shadow-sm"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <h3
                            className="text-2xl font-display font-medium mb-4"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            No providers listed in {city} yet
                        </h3>
                        <p className="max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            We haven&apos;t listed any providers in {city} yet. Check back soon, or share a price you
                            paid here and help start the local range.
                        </p>
                    </div>
                ) : (
                    <div
                        className="p-12 text-center rounded-3xl border shadow-sm"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <p className="leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            No provider in {city} matches that filter. Turn the filter off to see the full list.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
