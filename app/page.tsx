import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'
import AestheticsNews from '@/components/home/AestheticsNews'
import TreatmentTrends from '@/components/home/TreatmentTrends'
import NewsletterAudit from '@/components/home/NewsletterAudit'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: `InjectorIndex — Regen-First Injector Intelligence | PNs, Daxxify & More`,
  description: `Find injectors ranked by Regen-Ratio™ — track Polynucleotides, Daxxify, and natural results. The independent index for aesthetic medicine.`,
  alternates: {
    canonical: '/',
  }
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />

      {/* 1. Hero — Neo-Romantic, Regen-First */}
      <Hero />

      {/* 2. Top Scoring Providers (geo-personalized) */}
      <Suspense fallback={
        <div className="py-24 flex items-center justify-center bg-[#0d1420] text-gray-600">
          Loading top providers…
        </div>
      }>
        <FeaturedProviders />
      </Suspense>

      {/* 3. 2026 Treatment Hierarchy (PNs, Daxxify, Exosomes, Sculptra) */}
      <TreatmentTrends />

      {/* 4. II-Score™ Methodology */}
      <HowItWorks />

      {/* 5. Free Clinic Audit + Newsletter Signup */}
      <NewsletterAudit />

      {/* 6. City Grid */}
      <FeaturedCities />

      {/* 7. Intelligence & Guides */}
      <AestheticsNews />
    </>
  )
}
