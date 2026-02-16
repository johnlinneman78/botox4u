import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'National Botox Directory - Find Top Providers & Compare Costs',
  description: 'Find the best Botox injectors near you. Compare prices, read reviews, and book consultations with verified providers across the United States.',
  keywords: 'botox, botox near me, botox cost, botox injector, cosmetic injections, dermal fillers',
  openGraph: {
    title: 'National Botox Directory - Find Top Providers & Compare Costs',
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
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
