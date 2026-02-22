import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'
import FounderQuote from '@/components/home/FounderQuote'
import AestheticsNews from '@/components/home/AestheticsNews'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: `Find Your Perfect Injector | ${NICHE.siteName}`,
  description: "We score every provider on natural results, real pricing, and verified credentials — so you can compare in minutes.",
  alternates: {
    canonical: '/',
  }
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      {/* 1. Hero */}
      <Hero />

      {/* 2. Condensed score preview (3 top providers) */}
      <Suspense fallback={<div className="py-24 flex items-center justify-center bg-gray-50">Loading Top Providers...</div>}>
        <FeaturedProviders />
      </Suspense>

      {/* 3. How the Injector Index Score Works */}
      <HowItWorks />

      {/* 4. City grid */}
      <FeaturedCities />

      {/* 5. Aesthetics News & Guides */}
      <AestheticsNews />

      {/* 6. Founder quote section */}
      <FounderQuote />
    </>
  )
}
