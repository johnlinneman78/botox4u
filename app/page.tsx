import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'
import VerificationStandard from '@/components/home/VerificationStandard'
import { Suspense } from 'react'

import { Metadata } from 'next'

import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
  title: `${NICHE.siteName} | Natural Results & Transparent ${NICHE.name} Pricing`,
  description: NICHE.copy.hero.subtext.replace('{city}', 'your city'),
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
      <VerificationStandard />
      <HowItWorks />
    </>
  )
}
