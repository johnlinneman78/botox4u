import { Metadata } from 'next'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, STATE_MAP, TREATMENTS } from '@/lib/constants'
import { CityStats } from '@/components/city/CityStats'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { CityFAQ } from '@/components/city/CityFAQ'
import { PriceMeter } from '@/components/city/PriceMeter'
import { PromoteClinicCard } from '@/components/providers/PromoteClinicCard'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { CityHero } from '@/components/city/CityHero'
import Hero from '@/components/Hero'
import CityMap from '@/components/CityMap'
import { LeadForm } from '@/components/providers/LeadForm'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd, generateBreadcrumbSchema, generateItemListSchema, generateFAQPageSchema } from '@/components/seo/JsonLd'
import { GeolocationSorter } from '@/components/providers/GeolocationSorter'
import { Suspense } from 'react'

interface CityPageProps {
    params: Promise<{ state: string; city: string }>
    searchParams?: Promise<{ lat?: string; lng?: string }>
}

export async function generateStaticParams() {
    return [
        { state: 'or', city: 'portland' },
        { state: 'wa', city: 'seattle' },
        { state: 'ny', city: 'new-york' },
        { state: 'ca', city: 'los-angeles' },
        { state: 'ca', city: 'san-francisco' },
        { state: 'fl', city: 'miami' },
        { state: 'il', city: 'chicago' },
        { state: 'tx', city: 'dallas' },
        { state: 'tx', city: 'houston' },
        { state: 'ma', city: 'boston' },
        { state: 'az', city: 'scottsdale' },
        { state: 'ga', city: 'atlanta' },
        { state: 'co', city: 'denver' },
    ]
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { state, city } = await params
    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const title = `Best Botox Injectors in ${cityName} | InjectorIndex`
    const description = `Find and compare top-rated botox injectors in ${cityName}. Ranked by TrueScore™.`
    const url = `https://www.injectorindex.com/botox/${state.toLowerCase()}/${city.toLowerCase()}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
        }
    }
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
    const sParams = await searchParams
    const userLat = sParams?.lat ? parseFloat(sParams.lat) : undefined
    const userLng = sParams?.lng ? parseFloat(sParams.lng) : undefined
    const { state, city } = await params

    const stateCode = state.toUpperCase()
    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    const providers = await getProvidersWithSearch({
        city: cityName,
        state: stateCode,
        userLat,
        userLng
    })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    if (!providers.length && !stats) {
        notFound()
    }

    const mapProviders = providers.map((p: any) => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        slug: p.slug,
        listingTier: p.listingTier,
        rating: p.averageRating,
        trueScore: p.trueScore || p.score_total
    }));

    const itemListSchema = generateItemListSchema(providers.slice(0, 50), cityName)
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Directory', item: `/${NICHE.baseSlug}` },
        { name: stateSlug || stateCode, item: `/${NICHE.baseSlug}/state/${stateSlug || stateCode.toLowerCase()}` },
        { name: cityName, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}` }
    ])

    const avg = stats?.avgCost || 15;
    const faqSchema = generateFAQPageSchema(
        cityName,
        stateCode,
        Math.floor(avg - 2),
        Math.ceil(avg + 2),
        stats?.providerCount || providers.length
    );

    return (
        <main className="bg-[#0d1420] min-h-screen pb-20">
            <Suspense fallback={null}>
                <GeolocationSorter />
            </Suspense>
            <JsonLd data={itemListSchema} />
            <JsonLd data={breadcrumbs} />
            <JsonLd data={faqSchema} />

            <div className="bg-[#101827] border-b border-white/[0.06]">
                <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-medium text-white/60">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/${NICHE.baseSlug}`} className="hover:text-white transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <>
                            <Link href={`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`} className="hover:text-white transition-colors capitalize">
                                {stateSlug.replace(/-/g, ' ')}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-white">{cityName}</span>
                </div>
            </div>

            <Hero
                city={cityName}
                state={stateCode}
                userLat={userLat}
                userLng={userLng}
            />

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                {stats && (
                    <CityStats
                        city={cityName}
                        avgCost={stats.avgCost}
                        providerCount={stats.providerCount}
                        avgRating={stats.avgRating}
                    />
                )}

                <div className="mt-8">
                    <CityMap
                        providers={mapProviders}
                        citySlug={`${city}-${state.toLowerCase()}`}
                        userLat={userLat}
                        userLng={userLng}
                    />
                </div>

                <div className="mb-12">
                    <PriceMeter
                        avgCost={stats?.avgCost || 15}
                        city={cityName}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2" id="listings">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-2xl font-display font-bold text-white">
                                Verified Providers in {cityName}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-6">
                                {providers.length > 0 ? (
                                    providers.slice(0, 100).map((provider: any) => (
                                        <EnhancedProviderCard key={provider.id} provider={provider} />
                                    ))
                                ) : (
                                    <div className="bg-white/[0.02] p-12 text-center rounded-3xl border border-white/[0.06] col-span-full">
                                        <h3 className="text-2xl font-display font-bold text-white mb-4">Verifying Providers in {cityName}</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                                            We're currently verifying pricing and reviews for clinics in {cityName}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <CostComparisonTable
                            id="pricing-guide"
                            title={`Typical ${NICHE.name} Costs in ${cityName} by Area`}
                            rows={NICHE.calculator.treatmentAreas.map(area => ({
                                label: area.label,
                                units: `${area.minUnits || area.defaultUnits}-${area.maxUnits || area.defaultUnits * 1.5} Units`,
                                costRange: `$${(stats?.avgCost || 14) * (area.minUnits || area.defaultUnits)} - $${(stats?.avgCost || 14) * (area.maxUnits || area.defaultUnits * 1.5)}`,
                                notes: area.description || ''
                            }))}
                            footer={`*Pricing estimates in ${cityName} are based on a local average of $${stats?.avgCost || 14}/${NICHE.priceUnit.split(' ').slice(-1)}.`}
                        />
                    </div>

                    <div className="space-y-8">
                        <LeadForm
                            city={cityName}
                            state={stateCode}
                            providerName={`Providers in ${cityName}`}
                        />
                        <PromoteClinicCard city={cityName} />
                    </div>
                </div>

                <div className="mt-20 mb-12">
                    <div className="text-2xl font-display font-bold text-white mb-8">
                        Explore Nearby Cities
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {nearbyCities.map((city) => (
                            <Link
                                key={city.city}
                                href={`/${NICHE.baseSlug}/${city.state.toLowerCase()}/${city.city.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] hover:border-[#d4af37]/20 hover:shadow-md hover:shadow-[#d4af37]/5 transition-all text-center"
                            >
                                <div className="font-bold text-white text-sm mb-1">{city.city}</div>
                                <div className="text-xs text-gray-600">{city.count} {city.count === 1 ? 'Clinic' : 'Clinics'}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <CityFAQ city={cityName} avgCost={stats?.avgCost || 14} />

                <div className="mt-20 pt-12 border-t border-white/[0.05]">
                    <div className="text-xl font-display font-bold text-white mb-6">Complete Provider Directory: {cityName}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {providers.map((p: any) => (
                            <Link
                                key={`dir-${p.id}`}
                                href={`/provider/${p.slug}`}
                                className="text-sm text-gray-500 hover:text-[#d4af37] transition-colors truncate"
                            >
                                {p.name}
                            </Link>
                        ))}
                    </div>
                    {providers.length === 0 && (
                        <p className="text-sm text-gray-600 italic">No additional providers found in {cityName} at this time.</p>
                    )}
                    <p className="mt-8 text-[10px] text-gray-700 max-w-2xl">
                        This directory includes all observed and elite injectors in the {cityName} area. We continuously audit and add new clinics based on clinical excellence and pricing transparency.
                    </p>
                </div>

                <div className="mt-12">
                    <MedicalDisclaimer />
                </div>
            </div>
        </main>
    )
}
