'use client'

/**
 * Thin wrapper over GA4. Safe to call anywhere: if analytics isn't loaded
 * (no NEXT_PUBLIC_GA_ID, ad blocker, server render) these are no-ops.
 *
 * Keep event names in this file so GA4 reports stay consistent. In GA4,
 * mark `lead_submitted`, `quiz_completed` and `provider_outbound_click`
 * as key events to see conversions by landing page and by channel.
 */
export type AnalyticsEvent =
    | 'lead_submitted'          // patient sent an inquiry to a provider
    | 'quiz_completed'          // finished the injector match quiz
    | 'quiz_email_submitted'    // gave an email for quiz results
    | 'provider_outbound_click' // clicked through to a provider's own site
    | 'provider_phone_click'    // tapped a provider phone number
    | 'provider_maps_click'     // clicked through to Google Maps
    | 'newsletter_signup'
    | 'claim_started'           // a provider began claiming a listing
    | 'calculator_used'
    | 'price_guide_download'

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return
    try {
        window.gtag?.('event', event, params)
    } catch {
        // analytics must never break the page
    }
}

/** Context we attach to provider-related events so reports group usefully. */
export function providerParams(p: {
    slug?: string | null
    name?: string | null
    city?: string | null
    state?: string | null
    score?: number | null
}) {
    return {
        provider_slug: p.slug ?? undefined,
        provider_name: p.name ?? undefined,
        provider_city: p.city ?? undefined,
        provider_state: p.state ?? undefined,
        clarity_score: typeof p.score === 'number' ? p.score : undefined,
    }
}
