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
  title: `InjectorIndex — Find Natural Results Injectors | Botox, PNs & Daxxify Near You`,
  description: `Injector Index: Defining the Neo-Romantic era of medical aesthetics through data-driven clinic audits and regenerative intelligence. Compare Polynucleotides, Daxxify, and bio-stimulator providers ranked by Regen-Ratio™. Real pricing. Verified credentials. Zero pay-to-rank.`,
  keywords: `neo-romantic aesthetics, regenerative medicine, polynucleotides, daxxify, bio-stimulators, facial harmony, undetectable results, aesthetic intelligence, nurse injectors near me, II-Score, Regen-Ratio, clinical data`,
  metadataBase: new URL(`https://${NICHE.domain}`),
  openGraph: {
    title: `${NICHE.siteName} — Leading the Neo-Romantic Aesthetic Movement in Regenerative Medicine`,
    description: `The first aesthetic directory powered by regenerative intelligence. Ranked by Regen-Ratio™, natural integrity, and 2026 clinical innovation. Polynucleotides, Daxxify, bio-stimulators — the future of facial harmony.`,
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

