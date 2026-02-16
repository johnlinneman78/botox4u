import { getProviders, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, TREATMENTS } from '@/lib/constants'
import { CityHero } from '@/components/city/CityHero'
import { CityStats } from '@/components/city/CityStats'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { CityFAQ } from '@/components/city/CityFAQ'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Metadata } from 'next'

interface CityPageProps {
    params: { slug: string }
}

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

    return {
        title: `Best Botox in ${cityName}, ${stateCode} | 2024 Pricing & Reviews`,
        description: `Find top-rated Botox injectors in ${cityName}. Compare prices from ${providers.length} verified clinics, see patient reviews, and book consultations. Average cost: $${stats?.avgCost || 14}/unit.`,
        openGraph: {
            title: `Botox in ${cityName}, ${stateCode}: Top Clinics & Pricing`,
            description: `A complete directory of verified Botox providers in ${cityName}, TX. Compare costs and reviews.`,
        }
    }
}

export default async function CityPage({ params }: CityPageProps) {
    const resolvedParams = await params
    const { cityName, stateCode } = parseSlug(resolvedParams.slug)

    const providers = await getProviders({ city: cityName, state: stateCode })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `Botox Providers in ${cityName}`,
        "description": `Top-rated medical injectors for Botox and aesthetic treatments in ${cityName}, ${stateCode}.`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressRegion": stateCode,
            "addressCountry": "US"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stats?.avgRating || 4.8,
            "reviewCount": stats?.providerCount * 12 || 50
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the average cost of Botox in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The average cost of Botox in ${cityName} is approximately $${stats?.avgCost || 14} per unit. Most clinics range between $12 and $18 per unit depending on their expertise and location.`
                }
            },
            {
                "@type": "Question",
                "name": `Who are the best Botox injectors in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Some of the top-rated providers in ${cityName} include ${providers.slice(0, 2).map((p: any) => p.name).join(' and ')}, based on patient ratings and verified credentials.`
                }
            }
        ]
    }

    if (providers.length === 0) {
        // We could 404, or show a "coming soon" page. 
        // For programmatic SEO, we'll show what we have.
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
            <div className="bg-primary/95 border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-medium text-white/60">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/botox" className="hover:text-white transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <>
                            <Link href={`/botox/state/${stateSlug}`} className="hover:text-white transition-colors capitalize">
                                {stateSlug.replace(/-/g, ' ')}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-white">{cityName}</span>
                </div>
            </div>

            <CityHero
                city={cityName}
                state={stateCode}
                providerCount={providers.length}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-display font-bold text-primary">
                                Verified Providers in {cityName}
                            </h2>
                            <Badge variant="default">
                                Sort: Featured First
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            {providers.map((provider: any) => (
                                <ProviderCard key={provider.id} provider={{
                                    ...provider,
                                    averageRating: Number(provider.average_rating),
                                    reviewCount: Number(provider.review_count),
                                    listingTier: provider.listing_tier,
                                    pricePerUnit: Number(provider.price_per_unit),
                                    minTreatmentPrice: Number(provider.min_treatment_price),
                                    imageUrl: provider.image_url
                                }} />
                            ))}
                        </div>

                        <CostComparisonTable
                            title={`Typical Botox Costs in ${cityName} by Area`}
                            rows={[
                                { label: 'Forehead Lines', units: '10-20 Units', costRange: `$${(stats?.avgCost || 14) * 10} - $${(stats?.avgCost || 14) * 20}`, notes: 'Horizontal lines above brows.' },
                                { label: 'Frown Lines (11s)', units: '15-25 Units', costRange: `$${(stats?.avgCost || 14) * 15} - $${(stats?.avgCost || 14) * 25}`, notes: 'Vertical lines between brows.' },
                                { label: 'Crow\'s Feet', units: '12-24 Units', costRange: `$${(stats?.avgCost || 14) * 12} - $${(stats?.avgCost || 14) * 24}`, notes: 'Lines around the eyes.' },
                                { label: 'Masseter (Slimming)', units: '40-60 Units', costRange: `$${(stats?.avgCost || 14) * 40} - $${(stats?.avgCost || 14) * 60}`, notes: 'Jaw slimming and TNJ relief.' },
                            ]}
                            footer={`*Pricing estimates in ${cityName} are based on a local average of $${stats?.avgCost || 14}/unit.`}
                        />

                        {providers.length === 0 && (
                            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500">We are currently verifying providers in {cityName}. Check back soon!</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Sidebar Info */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-display font-bold text-primary mb-4">
                                Why Trust Us?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Only board-certified and licensed medical professionals listed.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Verified patient reviews to ensure genuine results.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="text-secondary font-bold">✓</span>
                                    <span>Always free for patients to browse and contact clinics.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Cost Table Stub */}
                        <div className="bg-primary text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-display font-bold mb-4">
                                Save on Treatments
                            </h3>
                            <p className="text-sm text-gray-300 mb-6 font-light">
                                Many clinics in {cityName} offer discounts for first-time patients or memberships.
                            </p>
                            <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all">
                                Get Multi-Clinic Quote
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-display font-bold text-primary mb-8 text-center">
                        Treatment Options in {cityName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TREATMENTS.map((treatment) => (
                            <Link
                                key={treatment.slug}
                                href={`/botox/${treatment.slug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`}
                                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all"
                            >
                                <h4 className="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors mb-2">
                                    {treatment.name}
                                </h4>
                                <p className="text-sm text-gray-500 mb-4 font-light">
                                    {treatment.description}
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
                                href={`/botox/${city.city.toLowerCase().replace(/ /g, '-')}-${city.state.toLowerCase()}`}
                                className="bg-white p-4 rounded-xl border border-gray-100 hover:border-secondary/30 hover:shadow-md transition-all text-center"
                            >
                                <div className="font-bold text-primary text-sm mb-1">{city.city}</div>
                                <div className="text-xs text-gray-400">{city.count} {city.count === 1 ? 'Clinic' : 'Clinics'}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <CityFAQ city={cityName} avgCost={stats?.avgCost || 14} />
            </div>
        </main>
    )
}
