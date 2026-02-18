import { getProvidersWithSearch, getCityStats } from '@/lib/actions/providers'
import { TREATMENTS, getStateName } from '@/lib/constants'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { CityHero } from '@/components/city/CityHero'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import { LeadForm } from '@/components/providers/LeadForm'
import { Star } from 'lucide-react'

interface TreatmentCityPageProps {
    params: { treatment: string; state: string; city: string }
}

export async function generateMetadata({ params }: TreatmentCityPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const treatment = TREATMENTS.find(t => t.slug === resolvedParams.treatment)
    const cityName = resolvedParams.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const stateName = getStateName(resolvedParams.state)

    if (!treatment) return { title: 'Treatment Not Found' }

    return {
        title: `${treatment.name} in ${cityName}, ${resolvedParams.state.toUpperCase()} | Prices & Top Clinicians`,
        description: `Compare ${treatment.name} costs in ${cityName}. Find verified ${treatment.name} providers, read reviews, and see before / after results.`,
    }
}

export default async function TreatmentCityPage({ params }: TreatmentCityPageProps) {
    const resolvedParams = await params
    const treatment = TREATMENTS.find(t => t.slug === resolvedParams.treatment)
    const stateCode = resolvedParams.state.toUpperCase()
    const citySlug = resolvedParams.city
    const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    if (!treatment) notFound()

    // Fetch providers who offer this treatment in this city
    const providers = await getProvidersWithSearch({
        city: cityName,
        state: stateCode,
        treatment: treatment.slug
    })

    const stats = await getCityStats(cityName)

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="bg-primary py-4">
                <div className="container mx-auto px-4 text-xs text-white/60">
                    <Link href="/" className="hover:text-white">Home</Link> /
                    <Link href="/botox" className="hover:text-white mx-1">Botox</Link> /
                    <Link href={`/ botox / ${stateCode.toLowerCase()} `} className="hover:text-white mx-1">{stateCode}</Link> /
                    <span className="text-white ml-1">{cityName} - {treatment.name}</span>
                </div>
            </div>

            <CityHero
                city={cityName}
                state={stateCode}
                treatmentName={treatment.name}
                providerCount={providers.length}
            />

            <TransparencyBlock city={cityName} />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section id="listings">
                            <h2 className="text-2xl font-display font-bold text-primary mb-6">
                                Best {treatment.name} Providers in {cityName}
                            </h2>

                            {/* Top Rated Section */}
                            {providers.filter((p: any) => p.averageRating >= 4.8).length > 0 && (
                                <div className="mb-12 bg-secondary/5 p-6 rounded-3xl border border-secondary/10">
                                    <div className="flex items-center gap-2 mb-6 text-secondary font-bold text-sm uppercase tracking-widest">
                                        <Star className="w-4 h-4 fill-secondary" />
                                        Excellence Awards: Top Rated in {cityName}
                                    </div>
                                    <div className="space-y-6">
                                        {providers
                                            .filter((p: any) => p.averageRating >= 4.8)
                                            .slice(0, 2)
                                            .map((provider: any) => (
                                                <ProviderCard key={`top-${provider.id}`} provider={provider} />
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {providers.length > 0 ? (
                                    providers.map((provider: any) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    ))
                                ) : (
                                    <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-gray-500">We're currently verifying {treatment.name} specialists in {cityName}.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <CostComparisonTable
                                title={`${treatment.name} Pricing Guide: ${cityName} `}
                                rows={[
                                    { label: 'Average Cost', units: 'Per Session', costRange: `$${(stats?.avgCost || 14) * 20} `, notes: `Based on local ${cityName} averages.` },
                                    { label: 'Specialist Rate', units: 'Top Rated', costRange: `$${(stats?.avgCost || 14) * 1.2 * 20} `, notes: 'Clinics with 5+ years experience.' }
                                ]}
                            />
                        </section>
                    </div>

                    <div className="space-y-8" id="quick-quote">
                        <LeadForm
                            city={cityName}
                            state={stateCode}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
