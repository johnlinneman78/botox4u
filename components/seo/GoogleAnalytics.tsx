'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!pathname) return

        const url = pathname + searchParams.toString()

        // Push to dataLayer for GA4
        if (typeof window.gtag === 'function') {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: url,
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
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    )
}

// Add gtag to window type definition
declare global {
    interface Window {
        gtag: (command: string, id: string, config: any) => void
    }
}
