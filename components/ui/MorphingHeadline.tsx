'use client'

// Homepage hero headline: the location-aware price line (hero B).
//
// This used to cycle provider-type words (Injector, Botox Provider, Lip
// Filler Artist, ...). It now states one price line for the visitor's
// own city when that city's range is verified, and a range-free fallback
// otherwise. The city and range arrive as props resolved server-side in
// app/page.tsx from the hosting platform's geo headers; this component
// never guesses a city or a price on its own.
//
// NOTE (Oct 24 cleanup): the Portland range below is an Oct 2026 SEO
// research observation, NOT live clinic prices — the price database is
// empty. Do not copy it elsewhere as fact, and do not add more cities
// on this basis. It stays only because the owner ruled the live
// headline stays until pool data replaces it.
//
// Verified city: "In Portland, clinics publish Botox at $12–$17 a unit.
// Most people learn their price at the front desk."
// Anywhere else: "Clinics publish Botox prices. Most people learn their
// price at the front desk."

interface HeroPriceLineProps {
    city?: string | null
    range?: string | null
}

export function MorphingHeadline({ city, range }: HeroPriceLineProps) {
    const verified = city && range

    return (
        <h1
            className="font-display font-light text-balance"
            style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                color: 'var(--color-espresso)',
                lineHeight: 1.1,
            }}
        >
            {verified ? (
                <>
                    In <em style={{ color: 'var(--color-gold)' }}>{city}</em>, clinics publish
                    Botox at <em style={{ color: 'var(--color-gold)' }}>{range}</em> a unit.{' '}
                    Most people learn their price at the front desk.
                </>
            ) : (
                <>
                    Clinics publish Botox prices.{' '}
                    Most people learn their price at the front desk.
                </>
            )}
        </h1>
    )
}
