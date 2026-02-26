import type { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { Suspense } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { StickyBar } from '@/components/navigation/StickyBar'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: `InjectorIndex — Find & Compare the Best Botox Injectors Near You`,
  description: `Compare 500+ injectors across 22 cities. See TrueScores, real pricing, and verified credentials. Find natural results, ranked by data, not ads.`,
  keywords: `botox near me, best fillers, medspa rankings, injector scores, natural botox, lip filler, daxxify, polynucleotides, aesthetic directory`,
  metadataBase: new URL(`https://${NICHE.domain}`),
  openGraph: {
    title: `InjectorIndex — Find & Compare the Best Botox Injectors Near You`,
    description: `Compare 500+ injectors across 22 cities. See TrueScores, real pricing, and verified credentials. Find natural results, ranked by data.`,
    type: 'website',
    url: `https://${NICHE.domain}`,
    siteName: NICHE.siteName,
  },
  alternates: {
    canonical: `https://${NICHE.domain}`,
  },
}

import ExitIntentModal from '@/components/ux/ExitIntentModal'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#0d1420] text-gray-100">
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
        </Suspense>
        <Header />
        <main className="min-h-screen">{children}</main>
        <StickyBar />
        <ExitIntentModal />
        <Footer />
      </body>
    </html>
  )
}

