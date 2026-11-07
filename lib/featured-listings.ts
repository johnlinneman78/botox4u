// Featured providers — John's decision, Nov 4, 2026; free per his
// Nov 6, 2026 rule (second-opinion ruling 4, Nov 7, 2026).
//
// Featured is a FREE placement: a clearly labeled featured section
// ABOVE the unpaid results on a city page, with a Featured tag.
// Clinics get featured when they ask. It never changes a
// provider's Clarity Score, and it is never granted just because
// a provider gave us information — a correction, a description,
// or a logo is part of their free listing, not agreement to be
// featured. The label is just "Featured" — never "Featured ·
// founding partner" (John, Nov 7, 2026).
//
// FEATURED-SECTION RULE (John, Nov 4, 2026): featured providers
// render in their own labeled section above the unpaid list, never
// mixed into the ranked order. The section carries this disclosure:
// "This spot is free. It never changes their Clarity Score or
// their position in the regular results." The unpaid list below
// keeps its independent order.
//
// ORDERING: multiple featured spots order by acceptance date. Until
// trial tracking lands, list order here IS acceptance order —
// Georgetown (grandfathered, Nov 3, 2026) first, then trial
// providers in the order they accepted.
//
// FREE (John, Nov 6, 2026): featured spots are free; a clinic gets
// featured when it asks. No trial term, no paid plan, no pricing ask
// in provider replies. Georgetown's grandfathered free spot is
// unchanged.
//
// LAUNCH OFFER (SUPERSEDED Nov 6, 2026 by the free-featured rule):
// the first-10 free 30-day trial is dead — there are no trials.
// Kept here as history only; do not restore it.
//
// GRANDFATHERED: Georgetown Allure Med Spa keeps its free featured
// spot with no clock — it was promised a free spot on Nov 3, 2026,
// before any trial term existed.
//
// A provider's own logo on their card is NOT part of featured: any
// provider-supplied logo shows on the card as part of the listing.

export const FEATURED_PROVIDERS: Array<{ slug: string; why: string }> = [
    {
        slug: 'georgetown-allure-medical-spa-washington-dc',
        why: 'Grandfathered free spot, promised Nov 3, 2026, no trial clock',
    },
]

export function isFeatured(slug?: string): boolean {
    return !!slug && FEATURED_PROVIDERS.some((f) => f.slug === slug)
}

// Featured providers first, everyone else in their original order.
export function orderFeaturedFirst<T extends { slug?: string }>(providers: T[]): T[] {
    const featured = providers.filter((p) => isFeatured(p.slug))
    const rest = providers.filter((p) => !isFeatured(p.slug))
    return [...featured, ...rest]
}

// Split a city list into the featured section and the unpaid list.
// Featured keeps FEATURED_PROVIDERS list order (acceptance order until
// trial tracking lands); the unpaid list keeps its independent order.
export function splitFeatured<T extends { slug?: string }>(providers: T[]): {
    featured: T[]
    rest: T[]
} {
    const order = new Map(FEATURED_PROVIDERS.map((f, i) => [f.slug, i]))
    const featured = providers
        .filter((p) => p.slug && order.has(p.slug))
        .sort((a, b) => (order.get(a.slug!) ?? 0) - (order.get(b.slug!) ?? 0))
    const rest = providers.filter((p) => !isFeatured(p.slug))
    return { featured, rest }
}
