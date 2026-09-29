import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'
import HomeClient from '@/components/home/HomeClient'
import { createPublicClient } from '@/lib/supabase/public'

export const metadata: Metadata = {
  title: `${NICHE.name} Injectors & MedSpas | ${NICHE.siteName}`,
  description: `Compare local Botox and filler providers by credentials, published pricing and patient reviews. Independent, and rankings can't be bought.`,
  alternates: {
    canonical: '/',
  }
}

export const revalidate = 3600 // Cache for 1 hour

export default async function HomePage() {
  const supabase = createPublicClient()

  let providersIndexed = 0
  let npiVerified = 0
  let citiesVerified = 0

  if (supabase) {
    // "Providers Indexed" = all provider rows
    const all = await supabase
      .from('providers')
      .select('id', { count: 'exact', head: true })
    if (all.error) console.error('[home] provider count failed:', all.error.message)
    providersIndexed = all.count || 0

    // "NPI-Verified" = rows with a confirmed NPI match, and the cities they're in
    const verified = await supabase
      .from('providers')
      .select('city')
      .eq('npi_verified', true)
    if (verified.error) console.error('[home] NPI-verified query failed:', verified.error.message)
    npiVerified = verified.data?.length || 0
    citiesVerified = new Set((verified.data || []).map(row => row.city)).size
  }

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <HomeClient 
        providersIndexed={providersIndexed}
        npiVerified={npiVerified}
        citiesVerified={citiesVerified}
      />
    </>
  )
}
