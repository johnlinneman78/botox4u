import { getProviders, getTreatmentStats } from '@/lib/actions/providers'
import { AtAGlance } from '@/components/seo/AtAGlance'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { TREATMENTS, REVERSE_STATE_MAP } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface TreatmentCityPageProps {
    params: {
        treatment: string
        state: string
        slug: string
    }
}

export async function generateMetadata({ params }: TreatmentCityPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const treatment = TREATMENTS.find(t => t.slug === resolvedParams.treatment)
    const state = resolvedParams.state.toUpperCase()
    const city = resolvedParams.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')

    if (!treatment) return { title: 'Treatment Not Found' }

    return {
        title: `${treatment.name} in ${city}, ${state} | Cost & Best Providers`,
        description: `Everything you need to know about ${treatment.name} in ${city}. Compare local pricing, see patient results, and find verified medical injectors near you.`,
    }
}

export default async function TreatmentCityPage({ params }: TreatmentCityPageProps) {
    const resolvedParams = await params
    const treatment = TREATMENTS.find(t => t.slug === resolvedParams.treatment)
    const stateCode = resolvedParams.state.toUpperCase()
    const citySlug = resolvedParams.slug
    const cityName = citySlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    if (!treatment) notFound()

    const providers = await getProviders({ city: cityName, state: stateCode, treatment: treatment.slug })
    const stats = await getTreatmentStats(treatment.slug, cityName, stateCode)

    return (
        <main className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-primary/95 border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-medium text-white/60">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/botox" className="hover:text-white transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <Link href={`/botox/state/${stateSlug}`} className="hover:text-white transition-colors capitalize">
                            {stateSlug.replace(/-/g, ' ')}
                        </Link>
                    )}
                    <span>/</span>
                    <Link href={`/botox/${citySlug}-${stateCode.toLowerCase()}`} className="hover:text-white transition-colors">
                        {cityName}
                    </Link>
                    <span>/</span>
                    <span className="text-white">{treatment.name}</span>
                </div>
            </div>

            <div className="bg-white border-b border-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <Badge variant="premium" className="mb-4">Treatment Guide</Badge>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
                            {treatment.name} in <span className="text-secondary">{cityName}</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light mb-8">
                            {treatment.description} Discover the top-rated providers in {cityName} specializing in {treatment.name} and compare local treatment costs.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <AtAGlance
                    title={`${treatment.name} Overview`}
                    summary={`Based on verified data from ${providers.length} clinics in ${cityName}, here is what you can expect for ${treatment.name} pricing and treatment parameters.`}
                    items={[
                        { label: 'Avg Cost', value: stats?.avgCost || 15, prefix: '$', suffix: '/unit' },
                        { label: 'Total Units', value: treatment.slug.includes('masseter') ? '40-60' : '15-25' },
                        { label: 'Providers', value: providers.length },
                        { label: 'Duration', value: '4-6', suffix: 'months' }
                    ]}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-display font-bold text-primary mb-8 border-b border-gray-100 pb-4">
                            Top Specialized Injectors in {cityName}
                        </h2>

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

                        {providers.length === 0 && (
                            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 italic">No specialized providers found for {treatment.name} in {cityName} yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-display font-bold text-primary mb-6">
                                Pricing Breakdown
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Typical Units</span>
                                    <span className="font-bold text-primary">{treatment.slug.includes('masseter') ? '40-60' : '15-25'} Units</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Avg Cost per Unit</span>
                                    <span className="font-bold text-secondary">${stats?.avgCost || 15}</span>
                                </div>
                                <hr className="border-gray-50" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 font-medium">Estimated Total</span>
                                    <span className="text-lg font-display font-bold text-primary">
                                        ${(stats?.avgCost || 15) * (treatment.slug.includes('masseter') ? 40 : 15)} -
                                        ${(stats?.avgCost || 15) * (treatment.slug.includes('masseter') ? 60 : 25)}
                                    </span>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md">
                                Get Multi-Clinic Quote
                            </button>
                        </div>

                        <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10">
                            <h3 className="text-lg font-display font-bold text-primary mb-4">Patient Tip</h3>
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                "{treatment.name} is a specialized technique. Always ensure your injector has specific training in facial anatomy for this area, as muscle placement is critical for natural results."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
