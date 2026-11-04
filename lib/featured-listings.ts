// Free featured rows for claimed listings.
//
// This is NOT a paid tier and it is NOT a ranking. A provider listed here
// is shown once, in a clearly labeled featured row above the ranked list
// on their city page, and they ALSO stay in the ranked list in their
// normal position, so their ranking and Clarity Score never move.
// Nothing here is sold: Georgetown Allure Med Spa is the first provider
// to claim and manage a listing, and this row is a free thank-you for
// that, decided by John on Nov 3, 2026. Adding another provider to this
// list is a deliberate owner decision, never automatic and never paid
// for through checkout.

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
