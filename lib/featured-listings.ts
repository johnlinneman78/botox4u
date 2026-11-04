// Free featured listings for claimed providers.
//
// This is NOT a paid tier and it does NOT change a provider's Clarity
// Score. A provider listed here is pinned to the TOP of the ranked list
// on their city page, clearly labeled as a free claimed listing, ahead
// of the score/rating order — because they are a provider who actually
// claimed their listing and gave us their information. Everyone else
// keeps their normal order below them. Nothing here is sold:
// Georgetown Allure Med Spa is the first provider to claim and manage
// a listing, and this top spot is a free thank-you for that, decided
// by John on Nov 3, 2026. Adding another provider to this list is a
// deliberate owner decision, never automatic and never paid for
// through checkout.

export const FEATURED_CLAIMED_LISTINGS: Array<{ slug: string; note: string }> = [
    {
        slug: 'georgetown-allure-medical-spa-washington-dc',
        note: 'First provider to claim and manage their listing',
    },
]

export function featuredClaimedFor(providers: Array<{ slug?: string }>) {
    const slugs = new Set(FEATURED_CLAIMED_LISTINGS.map((f) => f.slug))
    return providers.filter((p) => p.slug && slugs.has(p.slug))
}

export function featuredNoteFor(slug: string): string {
    return FEATURED_CLAIMED_LISTINGS.find((f) => f.slug === slug)?.note || 'Claimed listing'
}

export function isFeaturedClaimed(slug?: string): boolean {
    return !!slug && FEATURED_CLAIMED_LISTINGS.some((f) => f.slug === slug)
}

// Featured claimed listings first, everyone else in their original order.
export function orderFeaturedFirst<T extends { slug?: string }>(providers: T[]): T[] {
    const featured = providers.filter((p) => isFeaturedClaimed(p.slug))
    const rest = providers.filter((p) => !isFeaturedClaimed(p.slug))
    return [...featured, ...rest]
}
