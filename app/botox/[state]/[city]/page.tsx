import Link from 'next/link'
import { Metadata } from 'next'
import Hero from '@/components/Hero'
import CityMap from '@/components/CityMap'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP } from '@/lib/constants'
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
    params: { state: string; city: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const stateCode = resolvedParams.state.toUpperCase()
    const cityName = resolvedParams.city.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return {
        title: `Best ${NICHE.name} in ${cityName}, ${stateCode} | Natural Results & Pricing`,
        description: NICHE.metaDescriptionTemplate.replace(/{city}/g, cityName),
        openGraph: {
            title: `${NICHE.name} in ${cityName}, ${stateCode}: Top Injectors Known for Natural Results`,
            description: `A complete directory of NPI-audited ${NICHE.name} providers in ${cityName}, ${stateCode}. Compare results quality and costs.`,
        }
    }
}

export default async function CityPage({ params }: CityPageProps) {
    const resolvedParams = await params
    const stateCode = resolvedParams.state.toUpperCase()
    const cityName = resolvedParams.city.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const providers = await getProvidersWithSearch({ city: cityName, state: stateCode })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    const mapCenter = providers.find((p: Provider) => !!p.lat && !!p.lng) || { lat: 34.0522, lng: -118.2437 }

    return (
        <main className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-[#1a2332] border-b border-white/10">
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

                <div className="mt-8">
                    <CityMap
                        providers={providers}
                        citySlug={`${resolvedParams.city}-${resolvedParams.state}`}
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
                        </div>

                        <div className="space-y-6">
                            {providers.length > 0 ? (
                                providers.map((provider: any) => (
                                    <EnhancedProviderCard key={provider.id} provider={provider} />
                                ))
                            ) : (
                                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-2xl font-display font-bold text-primary mb-4">Verifying Providers in {cityName}</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                                        We're currently verifying pricing and reviews for clinics in {cityName}.
                                    </p>
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
                        <LeadForm
                            city={cityName}
                            state={stateCode}
                            providerName={`Providers in ${cityName}`}
                        />
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
                                href={`/${NICHE.baseSlug}/${treatment.id}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/ /g, '-')}`}
                                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all"
                            >
                                <h4 className="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors mb-2">
                                    {treatment.label}
                                </h4>
                                <div className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                                    View Prices & Providers <span className="text-lg">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-20 mb-12">
                    <h3 className="text-2xl font-display font-bold text-primary mb-8">
                        Explore Nearby Cities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {nearbyCities.map((city) => (
                            <Link
                                key={city.city}
                                href={`/${NICHE.baseSlug}/${city.state.toLowerCase()}/${city.city.toLowerCase().replace(/ /g, '-')}`}
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
