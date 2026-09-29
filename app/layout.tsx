import type { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { Suspense } from 'react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'
import Script from 'next/script'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `Best ${NICHE.name} Injectors & MedSpas Near You | ${NICHE.siteName}`,
  description: `Compare local injectors using Clarity Score™ — independent data on injection quality, credentials, and real pricing. Find natural results, ranked by data.`,
  keywords: `${NICHE.name.toLowerCase()} near me, best fillers, medspa rankings, injector scores, natural ${NICHE.name.toLowerCase()}, lip filler, daxxify, polynucleotides, aesthetic directory`,
  metadataBase: new URL(`https://${NICHE.domain}`),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: `${NICHE.siteName} — Find & Compare the Best ${NICHE.name} Injectors Near You`,
    description: `Compare Botox and filler providers by credentials, published pricing and patient reviews. Independent, and rankings can't be bought.`,
    type: 'website',
    url: `https://${NICHE.domain}`,
    siteName: NICHE.siteName,
  }
}

import { ExitIntentModal } from '@/components/ui/ExitIntentModal'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": NICHE.siteName,
              "url": `https://${NICHE.domain}`,
              "description": `Find and compare ${NICHE.name.toLowerCase()} injectors ranked by Clarity Score™`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Portland",
                "addressRegion": "OR",
                "addressCountry": "US"
              }
            })
          }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }} suppressHydrationWarning>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="KXz5/TWsizsa5WSiUjnpWA"
          async
          strategy="afterInteractive"
        />
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
        </Suspense>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ExitIntentModal />
      </body>
    </html>
  )
}
