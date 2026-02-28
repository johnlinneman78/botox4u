import type { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { Suspense } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { StickyBar } from '@/components/navigation/StickyBar'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: `Best Botox Injectors & MedSpas Near You | InjectorIndex`,
  description: `Compare local injectors using TrueScore™ — independent data on injection quality, credentials, and real pricing. Find natural results, ranked by data.`,
  keywords: `botox near me, best fillers, medspa rankings, injector scores, natural botox, lip filler, daxxify, polynucleotides, aesthetic directory`,
  metadataBase: new URL('https://www.injectorindex.com'),
  openGraph: {
    title: `InjectorIndex — Find & Compare the Best Botox Injectors Near You`,
    description: `Compare 500+ injectors across 22 cities. See TrueScores, real pricing, and verified credentials. Find natural results, ranked by data.`,
    type: 'website',
    url: 'https://www.injectorindex.com',
    siteName: NICHE.siteName,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "InjectorIndex",
              "url": "https://www.injectorindex.com",
              "description": "Find and compare botox injectors ranked by TrueScore™",
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
      <body className="font-sans antialiased bg-[#0d1420] text-gray-100">
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="KXz5/TWsizsa5WSiUjnpWA"
          async
          strategy="afterInteractive"
        />
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
        </Suspense>
        <Header />
        <main className="min-h-screen">{children}</main>
        <StickyBar />
        <Footer />
      </body>
    </html>
  )
}

