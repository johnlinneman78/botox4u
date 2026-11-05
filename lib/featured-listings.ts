// Featured providers — John's decision, Nov 4, 2026.
//
// Featured is a PAID placement: a clearly labeled sponsored section
// ABOVE the unpaid results on a city page, with a Featured tag. It
// never changes a provider's Clarity Score, and it is never granted
// just because a provider gave us information — a correction, a
// description, or a logo is part of their free listing, not agreement
// to be featured.
//
// SPONSORED-SECTION RULE (John, Nov 4, 2026): featured providers
// render in their own labeled section above the unpaid list, never
// mixed into the ranked order. The section carries this disclosure:
// "Providers may purchase a clearly labeled advertising position.
// Payment never changes their Clarity Score, verification status,
// or position within the unpaid results." The unpaid list below
// keeps its independent order.
//
// ORDERING: multiple sponsored spots order by acceptance date. Until
// trial tracking lands, list order here IS acceptance order —
// Georgetown (grandfathered, Nov 3, 2026) first, then trial
// providers in the order they accepted.
//
// PARKED Nov 5, 2026 (John's decision): provider pricing is paused
// until there is more feedback, data, and engagement. No new free
// featured trials, no paid plans, no pricing ask in provider replies.
// The launch offer below is on hold, not dead: restore it from git
// history when pricing returns. Georgetown's grandfathered free spot
// is unchanged by the park.
//
// LAUNCH OFFER (ON HOLD): the first 10 providers get a free featured trial of
// 30 days. After 30 days the spot drops off unless the provider
// chooses the paid plan. No card up front, no surprise charge, and no
// trial starts without the provider actually accepting the offer.
// The paid price is not set yet.
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
        why: 'Grandfathered founding spot, promised Nov 3, 2026, no trial clock',
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

// Split a city list into the sponsored section and the unpaid list.
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
