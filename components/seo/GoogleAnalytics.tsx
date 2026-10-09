'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * GA4 page views for an App Router site.
 *
 * The gtag library and its `config` call live in app/layout.tsx as plain
 * <script> tags in <head>, so they run before React hydrates. That config
 * sets `send_page_view: false`, which means GA sends no view of its own and
 * this component sends every one — including the first.
 *
 * Why not let GA send the first one automatically: Next.js client-side
 * navigation never reloads the page, so GA's automatic view fires once and
 * then never again. Sending them all from one place keeps every page equal
 * and avoids double-counting the landing page.
 *
 * A path is only recorded as sent once the hit is actually queued, so a hit
 * is never silently dropped if the library hasn't arrived yet.
 */
export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const lastPath = useRef<string | null>(null)

    useEffect(() => {
        if (!GA_MEASUREMENT_ID || !pathname) return
        const qs = searchParams?.toString()
        const url = qs ? `${pathname}?${qs}` : pathname
        if (lastPath.current === url) return

        try {
            const params = {
                page_path: url,
                page_location: window.location.href,
                page_title: document.title,
            }
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', params)
            } else {
                // Belt and braces: gtag.js drains anything already queued.
                window.dataLayer = window.dataLayer || []
                window.dataLayer.push(['event', 'page_view', { ...params, send_to: GA_MEASUREMENT_ID }])
            }
            lastPath.current = url
        } catch {
            // analytics must never break the page
        }
    }, [pathname, searchParams, GA_MEASUREMENT_ID])

    return null
}

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}
