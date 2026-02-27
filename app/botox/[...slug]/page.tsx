import { Metadata } from 'next'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, STATE_MAP, TREATMENTS, getStateName } from '@/lib/constants'
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
import { Star } from 'lucide-react'
import { JsonLd, generateBreadcrumbSchema, generateItemListSchema, generateFAQPageSchema } from '@/components/seo/JsonLd'
import { GeolocationSorter } from '@/components/providers/GeolocationSorter'

interface CatchAllPageProps {
    params: Promise<{ slug: string[] }>
    searchParams?: Promise<{ lat?: string; lng?: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    let cityName = ''
    let stateCode = ''
    let treatmentName = ''

    if (slug.length === 1) {
        // Hyphenated city-state pattern: "los-angeles-ca"
        const parts = slug[0].split('-')
        stateCode = parts[parts.length - 1].toUpperCase()
        cityName = parts.slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    } else if (slug.length === 2) {
        // Hierarchical pattern: "ca/los-angeles"
        stateCode = slug[0].toUpperCase()
        cityName = slug[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    } else if (slug.length === 3) {
        // Treatment hierarchical patterns: "botox/ca/los-angeles"
        const treatment = TREATMENTS.find(t => t.slug === slug[0])
        treatmentName = treatment?.name || ''
        stateCode = slug[1].toUpperCase()
        cityName = slug[2].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    if (!cityName || !stateCode) return { title: 'Location Not Found' }

    if (treatmentName) {
        return {
            title: `${treatmentName} in ${cityName}, ${stateCode} | Prices & Top Clinicians`,
            description: `Compare ${treatmentName} costs in ${cityName}. Find verified ${treatmentName} providers, read reviews, and see before / after results.`,
            alternates: {
                canonical: `https://www.injectorindex.com/${NICHE.baseSlug}/${slug[0]}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`,
            },
            robots: { index: true, follow: true }
        }
    }

    return {
        title: `Best ${NICHE.name} in ${cityName}, ${stateCode} | Natural Results & Pricing`,
        description: NICHE.metaDescriptionTemplate.replace(/{city}/g, cityName),
        alternates: {
            canonical: `https://www.injectorindex.com/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`,
        },
        robots: { index: true, follow: true }
    }
}

export default async function CatchAllBotoxPage({ params, searchParams }: CatchAllPageProps) {
    const sParams = await searchParams
    const userLat = sParams?.lat ? parseFloat(sParams.lat) : undefined
    const userLng = sParams?.lng ? parseFloat(sParams.lng) : undefined
    const resolvedParams = await params
    const slug = resolvedParams.slug

    let cityName = ''
    let stateCode = ''
    let treatmentSlug = ''
    let treatmentName = ''
    let breadcrumbState = ''

    if (slug.length === 1) {
        // Pattern: /botox/los-angeles-ca
        const parts = slug[0].split('-')
        stateCode = parts[parts.length - 1].toUpperCase()
        cityName = parts.slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    } else if (slug.length === 2) {
        // Pattern: /botox/ca/los-angeles
        stateCode = slug[0].toUpperCase()
        cityName = slug[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    } else if (slug.length === 3) {
        // Pattern: /botox/botox/ca/los-angeles
        treatmentSlug = slug[0]
        const treatment = TREATMENTS.find(t => t.slug === treatmentSlug)
        if (!treatment) notFound()
        treatmentName = treatment.name
        stateCode = slug[1].toUpperCase()
        cityName = slug[2].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    } else {
        notFound()
    }

    // Basic validation of state code
    if (stateCode.length !== 2) {
        // Not a state code, maybe it's a full state name?
        // Let's try to find it in STATE_MAP
        const code = STATE_MAP[stateCode.toLowerCase()]
        if (code) stateCode = code
    }

    const providers = await getProvidersWithSearch({
        city: cityName,
        state: stateCode,
        treatment: treatmentSlug || undefined,
        userLat,
        userLng
    })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    if (!providers.length && !stats) {
        // If we found absolutely nothing, it might be a truly invalid URL
        // However, we often show empty city pages, so we only 404 if the state is invalid
        if (!REVERSE_STATE_MAP[stateCode]) notFound()
    }

    const mapCenter = providers.find((p: any) => !!p.lat && !!p.lng) || { lat: 34.0522, lng: -118.2437 }
    const itemListSchema = generateItemListSchema(providers, cityName)
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Directory', item: `/${NICHE.baseSlug}` },
        { name: stateSlug || stateCode, item: `/${NICHE.baseSlug}/state/${stateSlug || stateCode.toLowerCase()}` },
        { name: cityName, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}` }
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
            <GeolocationSorter />
            <JsonLd data={itemListSchema} />
            <JsonLd data={breadcrumbs} />
            <JsonLd data={faqSchema} />
            {/* Breadcrumbs */}
            <div className="bg-[#101827] border-b border-white/[0.06]">
                <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-medium text-white/60">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/${NICHE.baseSlug}`} className="hover:text-white transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <>
                            <Link href={`/${NICHE.baseSlug}/state/${stateSlug}`} className="hover:text-white transition-colors capitalize">
                                {stateSlug.replace(/-/g, ' ')}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-white">{cityName} {treatmentName ? `- ${treatmentName}` : ''}</span>
                </div>
            </div>

            {treatmentName ? (
                <CityHero
                    city={cityName}
                    state={stateCode}
                    treatmentName={treatmentName}
                    providerCount={providers.length}
                />
            ) : (
                <Hero
                    city={cityName}
                    state={stateCode}
                    userLat={userLat}
                    userLng={userLng}
                />
            )}

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                {stats && !treatmentName && (
                    <CityStats
                        city={cityName}
                        avgCost={stats.avgCost}
                        providerCount={stats.providerCount}
                        avgRating={stats.avgRating}
                    />
                )}

                {treatmentName && <TransparencyBlock city={cityName} />}

                <div className="mt-8">
                    <CityMap
                        providers={providers}
                        citySlug={`${cityName.toLowerCase().replace(/ /g, '-')}-${stateCode.toLowerCase()}`}
                        userLat={userLat}
                        userLng={userLng}
                    />
                </div>

                {!treatmentName && (
                    <div className="mb-12">
                        <PriceMeter
                            avgCost={stats?.avgCost || 15}
                            city={cityName}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2" id="listings">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-display font-bold text-white">
                                {treatmentName ? `Best ${treatmentName} Providers in ${cityName}` : `Verified Providers in ${cityName}`}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {/* Top Rated Section for Treatments */}
                            {treatmentName && providers.filter((p: any) => p.averageRating >= 4.8).length > 0 && (
                                <div className="mb-12 bg-[#d4af37]/5 p-6 rounded-3xl border border-[#d4af37]/15">
                                    <div className="flex items-center gap-2 mb-6 text-[#d4af37] font-bold text-sm uppercase tracking-widest">
                                        <Star className="w-4 h-4 fill-[#d4af37]" />
                                        Excellence Awards: Top Rated in {cityName}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {providers
                                            .filter((p: any) => p.averageRating >= 4.8)
                                            .slice(0, 2)
                                            .map((provider: any) => (
                                                <EnhancedProviderCard key={`top-${provider.id}`} provider={provider} />
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className={treatmentName ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                                {providers.length > 0 ? (
                                    providers.map((provider: any) => (
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
                            title={treatmentName ? `${treatmentName} Pricing Guide: ${cityName}` : `Typical ${NICHE.name} Costs in ${cityName} by Area`}
                            rows={treatmentName ? [
                                { label: 'Average Cost', units: 'Per Session', costRange: `$${(stats?.avgCost || 14) * 20}`, notes: `Based on local ${cityName} averages.` },
                                { label: 'Specialist Rate', units: 'Top Rated', costRange: `$${(stats?.avgCost || 14) * 1.2 * 20}`, notes: `Clinics with 5+ years experience.` }
                            ] : NICHE.calculator.treatmentAreas.map(area => ({
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
                            providerName={treatmentName ? `${treatmentName} in ${cityName}` : `Providers in ${cityName}`}
                        />
                        <PromoteClinicCard city={cityName} />
                    </div>
                </div>

                {!treatmentName && (
                    <div className="mt-20">
                        <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">
                            Treatment Options in {cityName}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TREATMENTS.map((treatment) => (
                                <Link
                                    key={treatment.slug}
                                    href={`/${NICHE.baseSlug}/${treatment.slug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`}
                                    className="group bg-white/[0.02] p-8 rounded-2xl border border-white/[0.06] hover:border-[#d4af37]/20 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all"
                                >
                                    <h4 className="font-display font-bold text-xl text-white group-hover:text-[#d4af37] transition-colors mb-2">
                                        {treatment.name}
                                    </h4>
                                    <div className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
                                        View Prices & Providers <span className="text-lg">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-20 mb-12">
                    <h3 className="text-2xl font-display font-bold text-white mb-8">
                        Explore Nearby Cities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {nearbyCities.map((city) => (
                            <Link
                                key={city.city}
                                href={`/${NICHE.baseSlug}/${city.state.toLowerCase()}/${city.city.toLowerCase().replace(/ /g, '-')}`}
                                className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] hover:border-[#d4af37]/20 hover:shadow-md hover:shadow-[#d4af37]/5 transition-all text-center"
                            >
                                <div className="font-bold text-white text-sm mb-1">{city.city}</div>
                                <div className="text-xs text-gray-600">{city.count} {city.count === 1 ? 'Clinic' : 'Clinics'}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <CityFAQ city={cityName} avgCost={stats?.avgCost || 14} />

                {/* Complete Provider Directory for 100% Indexation */}
                <div className="mt-20 pt-12 border-t border-white/[0.05]">
                    <h3 className="text-xl font-display font-bold text-white mb-6">Complete Provider Directory: {cityName}</h3>
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
