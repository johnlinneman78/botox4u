import { Suspense } from 'react'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { ProviderFilters } from '@/components/providers/ProviderFilters'
import { Button } from '@/components/ui/Button'
import { getProvidersWithSearch } from '@/lib/actions/providers'

export default async function FindProvidersPage({
    searchParams,
}: {
    searchParams: { q?: string; city?: string; state?: string; tier?: string }
}) {
    const sParams = await searchParams
    const query = sParams.q || ''
    const city = sParams.city || ''
    const state = sParams.state || ''
    const tier = sParams.tier || ''

    const providers = await getProvidersWithSearch({
        query,
        city,
        state,
        tier
    })

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-primary mb-2">
                        Explore Botox Providers
                    </h1>
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-primary">{providers.length}</span> results for
                        <span className="font-semibold text-primary">
                            {city || state ? ` ${city}${state ? `, ${state}` : ''}` : ` "${query || 'All Locations'}"`}
                        </span>
                    </p>
                </div>

                <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded-2xl mb-8" />}>
                    <ProviderFilters currentCity={city} currentState={state} />
                </Suspense>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((provider: any) => (
                        <EnhancedProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>

                {providers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
                        <h3 className="text-2xl font-display font-bold text-primary mb-2">
                            No results found in this area
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We&apos;re constantly adding new providers. Try searching for a nearby city or check back soon!
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="/find-providers"><Button variant="outline">Clear Filters</Button></a>
                            <Button variant="primary">Notify Me of Local Providers</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
