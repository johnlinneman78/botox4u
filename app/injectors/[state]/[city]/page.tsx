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
    const stateCode = state.toUpperCase()
    const stateName = STATE_MAP[stateCode] || stateCode
    const title = `Best Botox Injectors in ${cityName}, ${stateName} (2026) | Ranked by TrueScore™`
    const description = `Compare top-rated Botox injectors in ${cityName}, ${stateName}. Ranked by TrueScore™ — an independent clinical algorithm based on injection quality, verified credentials, and real pricing data. No paid rankings.`
    const url = `https://www.injectorindex.com/${NICHE.baseSlug}/${state.toLowerCase()}/${city.toLowerCase()}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: 'InjectorIndex',
            type: 'website',
        },
        alternates: {
            canonical: url
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
        { name: stateSlug || stateCode, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}` },
        { name: cityName, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}` }
    ])

    const avg = stats?.avgCost || 15;
    const faqSchema = generateFAQPageSchema(
        cityName,
        stateCode,
        stats?.avgCost ? stats.avgCost - 2 : (NICHE.priceRange.min + 2),
        stats?.avgCost ? stats.avgCost + 2 : (NICHE.priceRange.max - 2),
        providers.length
    )

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

                {/* City Market Intelligence — LLM-indexable narrative content for local SEO */}
                <section className="mt-16 bg-white/[0.02] rounded-3xl border border-white/[0.06] p-8 md:p-12">
                    <div className="text-center mb-10">
                        <p className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-3">Market Intelligence</p>
                        <h2 className="text-3xl font-display font-bold text-white">
                            Botox in {cityName}: 2026 Market Report
                        </h2>
                    </div>
                    <div className="max-w-3xl mx-auto prose prose-invert prose-sm">
                        <p className="text-gray-400 leading-relaxed">
                            {cityName} has <strong className="text-white">{providers.length}+ indexed aesthetic injectors</strong> on InjectorIndex,
                            with an average Botox price of <strong className="text-white">${stats?.avgCost || 14} per unit</strong> as of March 2026.
                            {(stats?.avgCost || 14) > 15
                                ? ` This places ${cityName} above the national average of $14/unit, reflecting the city's premium aesthetic market.`
                                : (stats?.avgCost || 14) < 13
                                    ? ` This is below the national average of $14/unit, making ${cityName} one of the more affordable major markets for cosmetic injectables.`
                                    : ` This is near the national average of $14/unit, offering patients competitive pricing across a range of provider types.`
                            }
                        </p>
                        {providers.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-white mb-3">
                                    Top-Ranked Injectors in {cityName}
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-4">
                                    Based on TrueScore™ clinical rankings — which evaluate injection quality, verified credentials,
                                    innovation adoption, and treatment range — the highest-scoring providers in {cityName} include:
                                </p>
                                <ul className="space-y-2">
                                    {providers.slice(0, 3).map((p: any, i: number) => (
                                        <li key={p.id} className="text-gray-400">
                                            <Link href={`/provider/${p.slug}`} className="text-[#d4af37] hover:underline font-semibold">
                                                {p.name}
                                            </Link>
                                            {p.trueScore || p.score_total ? (
                                                <span> — TrueScore™ {Math.round(p.trueScore || p.score_total)}</span>
                                            ) : null}
                                            {p.price_per_unit ? (
                                                <span> · ${p.price_per_unit}/unit</span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-white mb-3">
                                Pricing Context
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                A typical full-face Botox treatment in {cityName} (40–60 units) costs between
                                ${Math.round((stats?.avgCost || 14) * 40)} and ${Math.round((stats?.avgCost || 14) * 60)}.
                                Prices vary based on provider credentials, clinic location, and the specific brand of neurotoxin used (Botox, Dysport, Xeomin, Jeuveau, or Daxxify).
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/blog/how-much-does-botox-cost-2026"
                                className="text-sm text-[#d4af37] hover:underline"
                            >
                                📊 Full 2026 Pricing Report →
                            </Link>
                            <Link
                                href="/blog/how-to-find-good-botox-injector"
                                className="text-sm text-[#d4af37] hover:underline"
                            >
                                🔍 How to Find a Provider You Can Trust →
                            </Link>
                            <Link
                                href="/methodology"
                                className="text-sm text-[#d4af37] hover:underline"
                            >
                                📐 How TrueScore™ Works →
                            </Link>
                        </div>
                    </div>
                </section>


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
