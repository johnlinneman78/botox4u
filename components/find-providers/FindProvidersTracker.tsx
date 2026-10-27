'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

/**
 * Funnel step 1 for /find-providers (Oct 2026): a search or filter
 * result view. Fires once per page load with the search context and
 * result count, so GA4 can measure search -> profile click ->
 * outbound/maps/phone/quote, instead of the page showing 150 views
 * with 0 key events. Analytics must never break the page.
 */
export default function FindProvidersTracker({
    query,
    city,
    state,
    tier,
    type,
    view,
    resultCount,
}: {
    query?: string
    city?: string
    state?: string
    tier?: string
    type?: string
    view?: string
    resultCount: number
}) {
    const firedRef = useRef(false)
    useEffect(() => {
        if (firedRef.current) return
        firedRef.current = true
        track('provider_search', {
            search_city: city || undefined,
            search_state: state || undefined,
            filter_tier: tier || undefined,
            filter_type: type || undefined,
            filter_view: view || undefined,
            has_search_query: Boolean(query),
            result_count: resultCount,
            source: 'find-providers',
        })
    }, [query, city, state, tier, type, view, resultCount])
    return null
}
