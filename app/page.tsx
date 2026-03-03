import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: `${NICHE.name} Injectors & MedSpas | ${NICHE.siteName}`,
  description: `Compare local injectors using Clarity Score™ — independent data on injection quality, credentials, and real pricing. Find natural results, ranked by data.`,
  alternates: {
    canonical: `https://${NICHE.domain}/`,
  }
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <HomeClient />
    </>
  )
}
