import { ProviderCard } from '@/components/providers/ProviderCard'
import { Button } from '@/components/ui/Button'
import { getProviders } from '@/lib/actions/providers'

export default async function FindProvidersPage({
    searchParams,
}: {
    searchParams: { q?: string; city?: string; state?: string }
}) {
    const query = searchParams.q || ''
    const providers = await getProviders({ query })

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-primary mb-2">
                            Explore Botox Providers
                        </h1>
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-primary">{providers.length}</span> results for <span className="font-semibold text-primary">&quot;{query || 'All Locations'}&quot;</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Filters
                        </Button>
                        <Button variant="outline" size="sm">
                            Sort by: Rating
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {providers.map((provider: any) => (
                        <ProviderCard key={provider.id} provider={{
                            ...provider,
                            averageRating: Number(provider.average_rating),
                            pricePerUnit: Number(provider.price_per_unit),
                            minTreatmentPrice: Number(provider.min_treatment_price),
                            listingTier: provider.listing_tier,
                            imageUrl: provider.image_url // map to correct prop
                        }} />
                    ))}
                </div>

                {providers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
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
