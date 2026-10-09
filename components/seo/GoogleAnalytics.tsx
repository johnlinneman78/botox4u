'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * GA4 for an App Router site.
 *
 * Next.js client-side navigations don't reload the page, so GA's automatic
 * page_view only fires on the first load. We turn the automatic one off
 * (send_page_view: false) and send every page_view ourselves, including the
 * first, so counts aren't doubled on load and aren't missing on navigation.
 *
 * Set NEXT_PUBLIC_GA_ID (looks like G-XXXXXXXXXX) in Vercel and .env.local.
 * Without it this renders nothing at all.
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
        lastPath.current = url
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_path: url,
                page_location: window.location.href,
                page_title: document.title,
            })
        }
    }, [pathname, searchParams, GA_MEASUREMENT_ID])

    if (!GA_MEASUREMENT_ID) return null

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                    `,
                }}
            />
        </>
    )
}

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}
