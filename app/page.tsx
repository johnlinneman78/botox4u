import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'

import { Suspense } from 'react'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCities />
      <TransparencyBlock />
      {/* <Suspense fallback={<div className="h-96 flex items-center justify-center bg-gray-50">Loading Featured Providers...</div>}>
        <FeaturedProviders />
      </Suspense> */}
      <HowItWorks />
    </>
  )
}
