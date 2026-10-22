'use client'

/**
 * Thin wrapper over GA4 with strict allowlists.
 *
 * Safe to call anywhere: if analytics isn't loaded (no NEXT_PUBLIC_GA_ID, ad blocker, server render)
 * these are no-ops.
 */
export type AnalyticsEvent =
    | 'lead_submitted'          // patient sent an inquiry to a provider
    | 'lead_form_start'         // patient interacted with lead form
    | 'quiz_completed'          // finished the injector match quiz
    | 'quiz_email_submitted'    // gave an email for quiz results
    | 'provider_outbound_click' // clicked through to a provider's own site
    | 'provider_phone_click'    // tapped a provider phone number
    | 'provider_maps_click'     // clicked through to Google Maps
    | 'provider_search'         // user executed a search or filtered providers
    | 'newsletter_signup'
    | 'claim_started'           // a provider began claiming a listing
    | 'calculator_used'
    | 'price_guide_download'

/**
 * Strict parameter allowlist per event.
 * Any key not explicitly defined here is dropped immediately.
 */
import { resolveKnownCity, isKnownState } from '@/lib/constants/locations'

export const EVENT_PARAM_ALLOWLIST: Record<AnalyticsEvent, readonly string[]> = {
    lead_submitted: ['provider_id', 'provider_name', 'provider_slug', 'provider_city', 'provider_state', 'treatment'],
    lead_form_start: ['provider_id', 'provider_name', 'provider_slug', 'provider_city', 'provider_state'],
    quiz_completed: ['result_tier', 'recommended_treatment'],
    quiz_email_submitted: ['success'],
    provider_outbound_click: ['provider_id', 'provider_name', 'provider_slug', 'provider_city', 'provider_state', 'destination_domain', 'source'],
    provider_phone_click: ['provider_id', 'provider_name', 'provider_slug', 'provider_city', 'provider_state', 'source'],
    provider_maps_click: ['provider_id', 'provider_name', 'provider_slug', 'provider_city', 'provider_state', 'source'],
    provider_search: ['search_city', 'search_state', 'filter_tier', 'filter_type', 'filter_view', 'has_search_query', 'location_resolved', 'result_count', 'source'],
    newsletter_signup: ['source'],
    claim_started: ['provider_id', 'provider_name', 'provider_slug'],
    calculator_used: ['treatment_type', 'total_units', 'estimated_range'],
    price_guide_download: ['city', 'guide_slug'],
} as const

/**
 * Validates parameter values:
 * - Rejects arbitrary nested objects and arrays
 * - Rejects non-primitive types
 * - Rejects personal information (emails, phone numbers)
 * - Rejects raw geographic coordinates (single decimal or comma-separated pairs)
 * - Restricts max string length to 80 chars
 * - Rejects injection characters (<, >, {, })
 */
export function isValidParamValue(val: unknown): val is string | number | boolean {
    if (val === null || val === undefined) return false
    if (typeof val === 'object') return false
    if (typeof val === 'boolean') return true
    if (typeof val === 'number') return !isNaN(val) && isFinite(val)

    if (typeof val === 'string') {
        const trimmed = val.trim()
        if (trimmed.length === 0 || trimmed.length > 80) return false
        // PII email check
        if (trimmed.includes('@')) return false
        // Phone number check (formatted 10-digit phone or 10-11 consecutive digits)
        if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(trimmed) || /\b\d{10,11}\b/.test(trimmed)) return false
        // Geographic coordinate check (single coordinate e.g. 45.5152 or pair e.g. 45.5152,-122.6784)
        if (/^-?\d{1,3}\.\d{3,}/.test(trimmed) || /-?\d{1,3}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}/.test(trimmed)) return false
        // Script / tag injection check
        if (/[<>{}]/.test(trimmed)) return false
        return true
    }

    return false
}

export function filterEventParams(event: AnalyticsEvent, params: Record<string, unknown>): Record<string, string | number | boolean> {
    const allowedKeys = EVENT_PARAM_ALLOWLIST[event]
    if (!allowedKeys) return {}

    const safeParams: Record<string, string | number | boolean> = {}
    for (const key of allowedKeys) {
        const val = params[key]
        if (!isValidParamValue(val)) continue

        // Field-specific validation for provider_search
        if (event === 'provider_search') {
            if (key === 'search_city') {
                const resolved = resolveKnownCity(val)
                if (resolved) {
                    safeParams['search_city'] = resolved.slug
                    safeParams['location_resolved'] = true
                } else {
                    // Do not forward arbitrary unverified city text
                    safeParams['location_resolved'] = false
                    safeParams['has_search_query'] = true
                }
                continue
            }
            if (key === 'search_state') {
                if (typeof val === 'string' && isKnownState(val)) {
                    safeParams['search_state'] = val.trim().toUpperCase()
                }
                continue
            }
        }

        safeParams[key] = typeof val === 'string' ? val.trim() : val
    }
    return safeParams
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return
    try {
        const safeParams = filterEventParams(event, params)
        window.gtag?.('event', event, safeParams)
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
