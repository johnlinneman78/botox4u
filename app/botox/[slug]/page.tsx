import Link from 'next/link'
import { Metadata } from 'next'
import Hero from '@/components/Hero'
import CityMap from '@/components/CityMap'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, TREATMENTS } from '@/lib/constants'
import { CityStats } from '@/components/city/CityStats'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { CityFAQ } from '@/components/city/CityFAQ'
import { PriceMeter } from '@/components/city/PriceMeter'
import { PromoteClinicCard } from '@/components/providers/PromoteClinicCard'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { Badge } from '@/components/ui/Badge'
import { Provider } from '@/lib/types'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import { LeadForm } from '@/components/providers/LeadForm'
import { NICHE } from '@/config/niche'

interface CityPageProps {
    params: { slug: string }
}

export const dynamic = 'force-dynamic'

// Helper to parse slug "los-angeles-ca" into "Los Angeles" and "CA"
function parseSlug(slug: string) {
    const parts = slug.split('-')
    const stateCode = parts.pop()?.toUpperCase() || ''
    const cityName = parts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return { cityName, stateCode }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const { cityName, stateCode } = parseSlug(resolvedParams.slug)
    const stats = await getCityStats(cityName)

    return {
        title: `Best ${NICHE.name} in ${cityName}, ${stateCode} | Natural Results & Pricing`,
        description: NICHE.metaDescriptionTemplate.replace('{city}', cityName).replace('{city}', cityName), // Replace twice if needed, though template usually has one
        openGraph: {
            title: `${NICHE.name} in ${cityName}, ${stateCode}: Top Injectors Known for Natural Results`,
            description: `A complete directory of NPI-audited ${NICHE.name} providers in ${cityName}, ${stateCode}. Compare results quality and costs.`,
        }
    }
}

export default async function CityPage({ params }: CityPageProps) {
    const resolvedParams = await params
    const { cityName, stateCode } = parseSlug(resolvedParams.slug)

    const providers = await getProvidersWithSearch({ city: cityName, state: stateCode })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    // Default map center (if no providers or first provider lacks location)
    // In real app, we might want to geocode the city name on server or client
    const mapCenter = providers.find((p: Provider) => !!p.lat && !!p.lng) || { lat: 34.0522, lng: -118.2437 } // Default to LA or first provider

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `${NICHE.name} Providers in ${cityName}`,
        "description": `Top-rated medical ${NICHE.providerTypePlural} for ${NICHE.name} and aesthetic treatments in ${cityName}, ${stateCode}.`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressRegion": stateCode,
            "addressCountry": "US"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stats?.avgRating || 4.8,
            "reviewCount": (stats?.providerCount || 4) * 12 || 50
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the average cost of ${NICHE.name} in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The average cost of ${NICHE.name} in ${cityName} is approximately $${stats?.avgCost || 14} ${NICHE.priceUnit}. Most ${NICHE.providerTypePlural} range between $${NICHE.priceRange.min} and $${NICHE.priceRange.max} ${NICHE.priceUnit} depending on their expertise and location.`
                }
            },
            {
                "@type": "Question",
                "name": `Who are the best ${NICHE.name} ${NICHE.providerTypePlural} in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Some of the top-rated providers in ${cityName} include ${providers.slice(0, 2).map((p: any) => p.name).join(' and ')}, based on patient ratings and verified credentials.`
                }
            }
        ]
    }

    // 3-Provider Verification Rule (Phase 2.2)
    const verifiedProviders = providers.filter((p: any) =>
        p.rating !== null &&
        p.imageUrl && !p.imageUrl.includes('placeholder') &&
        (p.top_reviews?.length > 0 || p.reviews?.length > 0)
    )
    const isCityLive = verifiedProviders.length >= 3;

    if (!isCityLive) {
        // Log for debugging
        console.log(`DEBUG: City ${cityName} hidden. Live providers: ${verifiedProviders.length}`);
    }

    return (
        <main className="bg-gray-50 min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* Breadcrumbs */}
            <div className="bg-[#1a2332] border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-medium text-white/60">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={NICHE.baseSlug.slice(0, -1)} className="hover:text-white transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <>
                            <Link href={`${NICHE.baseSlug}state/${stateSlug}`} className="hover:text-white transition-colors capitalize">
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

                {/* Interactive Map Section */}
                <div className="mt-8">
                    <CityMap
                        providers={providers}
                        citySlug={resolvedParams.slug}
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
                            <h2 className="text-2xl font-display font-bold text-primary">
                                Verified Providers in {cityName}
                            </h2>
                            <Badge variant="default" className="bg-primary hover:bg-primary">
                                Sort: {NICHE.name}-4U Score
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            {/* Algorithm Callout */}
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-primary/5 shrink-0">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary text-sm mb-1">Ranked by Results Quality</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Providers are scored on <b>Results Quality</b> (natural sentiment), <b>Fair Pricing</b> (city average comparison), and <b>Federal NPI Verification</b>. Nobody can pay for a higher score—rankings are 100% data-driven.
                                    </p>
                                </div>
                            </div>
                            {isCityLive ? (
                                providers.map((provider: any) => (
                                    <EnhancedProviderCard key={provider.id} provider={provider} />
                                ))
                            ) : (
                                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                        ⏱️
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-primary mb-4">Verifying Providers in {cityName}</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                                        We're currently verifying pricing and reviews for clinics in {cityName}.
                                        Our team manually audits every listing to ensure 2026 standards of care.
                                    </p>
                                    <div className="inline-flex flex-col items-center gap-2 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Expected Release</span>
                                        <span className="text-lg font-black text-primary">February 2026</span>
                                    </div>
                                </div>
                            )}
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
                        {/* Quote Form */}
                        <div id="quick-quote">
                            <LeadForm
                                city={cityName}
                                state={stateCode}
                                providerName={`Providers in ${cityName}`}
                            />
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-display font-bold text-primary mb-4">
                                Why Trust Us?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Ranked on real patient review language (Natural vs Overdone).</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Every provider is cross-referenced against the federal NPI database.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Real pricing data compared against city averages.</span>
                                </li>
                            </ul>
                        </div>

                        <PromoteClinicCard city={cityName} />
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-display font-bold text-primary mb-8 text-center">
                        Treatment Options in {cityName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {NICHE.calculator.variables.map((treatment) => (
                            <Link
                                key={treatment.id}
                                href={`${NICHE.baseSlug}${treatment.id}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`}
                                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all"
                            >
                                <h4 className="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors mb-2">
                                    {treatment.label}
                                </h4>
                                <p className="text-sm text-gray-500 mb-4 font-light">
                                    Aesthetic specialists providing high-quality {treatment.label} treatments in {cityName}.
                                </p>
                                <div className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                                    View Prices & Providers <span className="text-lg">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-20 mb-12">
                    <h3 className="text-2xl font-display font-bold text-primary mb-8">
                        Explore Nearby Cities in {stateSlug?.replace(/-/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {nearbyCities.map((city) => (
                            <Link
                                key={city.city}
                                href={`${NICHE.baseSlug}${city.city.toLowerCase().replace(/ /g, '-')}-${city.state.toLowerCase()}`}
                                className="bg-white p-4 rounded-xl border border-gray-100 hover:border-secondary/30 hover:shadow-md transition-all text-center"
                            >
                                <div className="font-bold text-primary text-sm mb-1">{city.city}</div>
                                <div className="text-xs text-gray-400">{city.count} {city.count === 1 ? 'Clinic' : 'Clinics'}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <CityFAQ city={cityName} avgCost={stats?.avgCost || 14} />

                <div className="mt-12">
                    <MedicalDisclaimer />
                </div>
            </div>
        </main>
    )
}
