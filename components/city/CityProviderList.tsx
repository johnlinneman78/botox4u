'use client'

import { useState } from 'react'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'

// The unpaid provider list for a city page, with the sponsored section
// kept separate above it (see lib/featured-listings.ts — featured
// providers never mix into the unpaid order).
//
// The "Published prices only" toggle filters the UNPAID list to providers
// with a published per-unit price (pricePerUnit / price_per_unit, both
// set by getProvidersWithSearch). Featured providers are never filtered:
// a sponsored placement is a placement, not a price claim.
//
// Heading copy: "Providers in {city}" — directory inclusion is not
// verification, and the list is never described as verified as a whole.
// Per-practitioner NPI matching is shown on each card.

interface CityProviderListProps {
    city: string
    featured: any[]
    unpaid: any[]
}

export function CityProviderList({ city, featured, unpaid }: CityProviderListProps) {
    const [pricesOnly, setPricesOnly] = useState(false)

    const hasPublishedPrice = (p: any) => p.pricePerUnit != null || p.price_per_unit != null
    const visibleUnpaid = pricesOnly ? unpaid.filter(hasPublishedPrice) : unpaid
    const pricedCount = unpaid.filter(hasPublishedPrice).length

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h2
                    className="text-3xl font-display font-medium"
                    style={{ color: 'var(--color-espresso)' }}
                >
                    Providers in {city}
                </h2>
                {unpaid.length > 0 && (
                    <label
                        className="flex items-center gap-2 cursor-pointer select-none font-body text-sm"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        <input
                            type="checkbox"
                            checked={pricesOnly}
                            onChange={(e) => setPricesOnly(e.target.checked)}
                            className="accent-[#8A6D3B] w-4 h-4"
                        />
                        Published prices only
                        {pricedCount > 0 && (
                            <span style={{ color: 'var(--color-taupe)' }}>({pricedCount})</span>
                        )}
                    </label>
                )}
            </div>

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
                                <EnhancedProviderCard provider={provider} />
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
                            <EnhancedProviderCard provider={provider} />
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
                            We haven&apos;t listed any providers in {city} yet. Check back soon — or share a price you
                            paid here and help start the local range.
                        </p>
                    </div>
                ) : (
                    <div
                        className="p-12 text-center rounded-3xl border shadow-sm"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <p className="leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            No provider in {city} has published a price yet. Turn the filter off to see the full list.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
