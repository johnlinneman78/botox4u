import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'
import CompetitiveComparison from '@/components/home/CompetitiveComparison'
import AestheticsNews from '@/components/home/AestheticsNews'
import TreatmentTrends from '@/components/home/TreatmentTrends'
import InjectorMatchQuiz from '@/components/home/InjectorMatchQuiz'
import TreatmentGuides from '@/components/home/TreatmentGuides'
import ProcessThreeStep from '@/components/home/ProcessThreeStep'
import ApiIntelligence from '@/components/home/ApiIntelligence'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: `${NICHE.name} Injectors & MedSpas | ${NICHE.siteName}`,
  description: `Compare local injectors using TrueScore™ — independent data on injection quality, credentials, and real pricing. Find natural results, ranked by data.`,
  alternates: {
    canonical: `https://${NICHE.domain}/`,
  }
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />

      {/* 1. Hero — Strategic Entry */}
      <Hero />

      {/* 2. How It Works — 3-Step Process */}
      <ProcessThreeStep />

      {/* 3. Top Scoring Providers (geo-personalized) */}
      <Suspense fallback={
        <div className="py-24 flex items-center justify-center bg-[#0d1420] text-gray-600">
          Loading top providers…
        </div>
      }>
        <FeaturedProviders />
      </Suspense>

      {/* 4. Featured Cities Grid */}
      <FeaturedCities />

      {/* 5. The TrueScore™ Explained (Detailed Analytics) */}
      <HowItWorks />

      {/* 6. Why Trust Us — Competitive Comparison */}
      <CompetitiveComparison />

      {/* 7. API & Intelligence (Developer Ecosystem) */}
      <ApiIntelligence />

      {/* 8. Injector Match Quiz (Lead Capture) */}
      <InjectorMatchQuiz />

      {/* 9. Treatment Guides (Volume-First) */}
      <TreatmentGuides />

      {/* 10. Intelligence & Guides (Blog) */}
      <AestheticsNews />
    </>
  )
}
