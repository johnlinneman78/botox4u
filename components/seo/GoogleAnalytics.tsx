'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Strict query parameter allowlist for analytics collection.
 * Any free-form user query ('q') is excluded from analytics URLs to prevent PII leakage.
 */
export const ALLOWED_QUERY_KEYS = new Set([
    'city',
    'state',
    'tier',
    'type',
    'view',
    'sort',
    'treatment',
    'page',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
])

import { isKnownCity, isKnownState } from '@/lib/constants/locations'

/**
 * Field-specific validation for permitted query parameter values.
 * Rejects arbitrary strings, coordinates, emails, phones, and unapproved location strings.
 */
export function isSafeQueryParam(key: string, rawVal: string): boolean {
    const lowerKey = key.toLowerCase()
    if (!ALLOWED_QUERY_KEYS.has(lowerKey)) return false
    if (!rawVal || typeof rawVal !== 'string') return false

    const val = rawVal.trim()
    if (val.length === 0 || val.length > 60) return false

    // Blanket PII & Coordinate Rejections:
    if (val.includes('@')) return false
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(val) || /\b\d{10,11}\b/.test(val)) return false
    if (/^-?\d{1,3}\.\d{3,}/.test(val) || /-?\d{1,3}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}/.test(val)) return false
    if (/[<>{}"'`\\]/.test(val)) return false

    // Field-Specific Structural Validation:
    switch (lowerKey) {
        case 'city':
            // MUST be a recognized directory city from SUPPORTED_CITIES
            return isKnownCity(val)
        case 'state':
            // MUST be a recognized directory state code
            return isKnownState(val)
        case 'tier':
            // Controlled directory tiers
            return /^(all|top_tier|verified|community|featured|premium|free)$/i.test(val)
        case 'type':
            // Controlled provider types
            return /^(all|artisan|institutional)$/i.test(val)
        case 'view':
            // Controlled view modes
            return /^(specialist|general|grid|map)$/i.test(val)
        case 'sort':
            // Controlled sort orders
            return /^(priority|distance|rating|reviews|clarity)$/i.test(val)
        case 'treatment':
            // Alphanumeric slug with hyphens (e.g. botox, lip-filler, dermal-fillers)
            return /^[a-z0-9\-]{2,40}$/i.test(val)
        case 'page':
            // Integer page numbers only
            return /^\d{1,4}$/.test(val)
        case 'utm_source':
        case 'utm_medium':
        case 'utm_campaign':
        case 'utm_term':
        case 'utm_content':
        case 'gclid':
            // Standard campaign parameters (alphanumeric, hyphens, underscores, dots)
            return /^[a-zA-Z0-9_\-\.]{1,60}$/.test(val)
        default:
            return false
    }
}

export function sanitizeQueryParams(searchParams: URLSearchParams | null): string {
    if (!searchParams) return ''
    const cleanParams = new URLSearchParams()
    searchParams.forEach((val, key) => {
        const lowerKey = key.toLowerCase()
        if (isSafeQueryParam(lowerKey, val)) {
            cleanParams.append(lowerKey, val.trim())
        }
    })
    return cleanParams.toString()
}

export function sanitizeUrlString(rawUrl: string, fallbackOrigin = 'https://www.injectorindex.com'): string {
    if (!rawUrl) return ''
    try {
        const parsed = new URL(rawUrl, fallbackOrigin)
        const cleanQs = sanitizeQueryParams(parsed.searchParams)
        return cleanQs ? `${parsed.origin}${parsed.pathname}?${cleanQs}` : `${parsed.origin}${parsed.pathname}`
    } catch {
        return ''
    }
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const lastPathRef = useRef<string | null>(null)

    useEffect(() => {
        if (!GA_MEASUREMENT_ID || !pathname) return

        const cleanQs = sanitizeQueryParams(searchParams)
        const sanitizedPath = cleanQs ? `${pathname}?${cleanQs}` : pathname

        // Explicit deduplication: do not re-emit page_view if sanitized path has not changed
        if (lastPathRef.current === sanitizedPath) return

        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.injectorindex.com'
            const sanitizedLocation = `${origin}${sanitizedPath}`

            // Sanitize document.referrer before transmission
            const rawReferrer = typeof document !== 'undefined' ? document.referrer : ''
            const sanitizedReferrer = rawReferrer ? sanitizeUrlString(rawReferrer, origin) : undefined

            const params: Record<string, unknown> = {
                page_path: sanitizedPath,
                page_location: sanitizedLocation,
                page_title: typeof document !== 'undefined' ? document.title : '',
                send_to: GA_MEASUREMENT_ID,
            }
            if (sanitizedReferrer) {
                params.page_referrer = sanitizedReferrer
            }

            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', params)
            } else if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || []
                window.dataLayer.push(['event', 'page_view', params])
            }
            lastPathRef.current = sanitizedPath
        } catch {
            // analytics must never break the page
        }
    }, [pathname, searchParams, GA_MEASUREMENT_ID])

    return null
}
