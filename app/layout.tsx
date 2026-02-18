import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Botox-4-U.com - Find Top Providers & Compare Costs',
  description: 'Find the best Botox injectors near you. Compare prices, read reviews, and book consultations with verified providers at Botox-4-U.com.',
  keywords: 'botox, botox near me, botox cost, botox injector, cosmetic injections, dermal fillers',
  openGraph: {
    title: 'Botox-4-U.com - Find Top Providers & Compare Costs',
    description: 'Find the best Botox injectors near you. Compare prices, read reviews, and book consultations.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
        </Suspense>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

