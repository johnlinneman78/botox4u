import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'
import { Suspense } from 'react'

import { Metadata } from 'next'

import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
  title: `${NICHE.siteName} | Compare Verified ${NICHE.name} Prices & ${NICHE.providerTypePlural.charAt(0).toUpperCase() + NICHE.providerTypePlural.slice(1)} Near You`,
  description: `Find the best ${NICHE.name} ${NICHE.providerTypePlural} with transparent pricing. Compare top-rated clinics in ${NICHE.cities.slice(0, 3).map(c => c.name).join(', ')}. Real prices, verified reviews, and expert ${NICHE.providerTypePlural}.`,
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCities />
      <TransparencyBlock />
      <Suspense fallback={<div className="h-96 flex items-center justify-center bg-gray-50">Loading Featured Providers...</div>}>
        <FeaturedProviders />
      </Suspense>
      <HowItWorks />
    </>
  )
}
