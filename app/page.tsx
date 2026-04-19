import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'
import HomeClient from '@/components/home/HomeClient'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `${NICHE.name} Injectors & MedSpas | ${NICHE.siteName}`,
  description: `Compare local injectors using Clarity Score™ — independent data on injection quality, credentials, and real pricing. Find natural results, ranked by data.`,
  alternates: {
    canonical: `https://${NICHE.domain}/`,
  }
}

export const revalidate = 3600 // Cache for 1 hour

export default async function HomePage() {
  const supabase = await createClient()

  // "Providers Indexed" = count of all non-deleted provider rows
  const { count: providersIndexedCount } = await supabase
    .from('providers')
    .select('id', { count: 'exact', head: true })

  // "NPI-Verified" = count where npi_verified = true
  const { count: npiVerifiedCount } = await supabase
    .from('providers')
    .select('id', { count: 'exact', head: true })
    .eq('npi_verified', true)

  // "Cities Verified" = distinct cities with at least 1 NPI-verified provider
  const { data: verifiedCities } = await supabase
    .from('providers')
    .select('city')
    .eq('npi_verified', true)

  const citiesVerifiedCount = new Set((verifiedCities || []).map(row => row.city)).size

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <HomeClient 
        providersIndexed={providersIndexedCount || 0}
        npiVerified={npiVerifiedCount || 0}
        citiesVerified={citiesVerifiedCount}
      />
    </>
  )
}
