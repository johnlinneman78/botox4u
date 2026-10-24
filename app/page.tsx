import { Metadata } from 'next'
import { headers } from 'next/headers'
import { NICHE } from '@/config/niche'
import { JsonLd, generateWebSiteSchema } from '@/components/seo/JsonLd'
import HomeClient from '@/components/home/HomeClient'
import { createPublicClient } from '@/lib/supabase/public'
import { findCityBotoxPrice } from '@/lib/city-botox-prices'

export const metadata: Metadata = {
  title: `${NICHE.name} Injectors & MedSpas | ${NICHE.siteName}`,
  description: `Compare local Botox and filler providers by credentials, published pricing and patient reviews. Independent, and rankings can't be bought.`,
  alternates: {
    canonical: '/',
  }
}

export const revalidate = 3600 // Cache for 1 hour

export default async function HomePage() {
  // Hero price line: resolve the visitor's city from the hosting
  // platform's geo header (Vercel sends x-vercel-ip-city, URL-encoded).
  // Only a city with a VERIFIED range in lib/city-botox-prices.ts gets
  // a city line; everyone else gets the range-free fallback. Reading
  // headers() makes this page dynamic, which is the price of a
  // location-aware hero. A malformed header falls back, never crashes.
  let heroCity: string | null = null
  let heroRange: string | null = null
  try {
    const rawCity = (await headers()).get('x-vercel-ip-city')
    const match = findCityBotoxPrice(rawCity ? decodeURIComponent(rawCity) : null)
    if (match) {
      heroCity = match.city
      heroRange = match.range
    }
  } catch {
    // Fallback hero below; geo must never break the homepage.
  }

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
        heroCity={heroCity}
        heroRange={heroRange}
      />
    </>
  )
}
