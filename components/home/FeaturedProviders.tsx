import { getProvidersWithSearch } from '@/lib/actions/providers'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function FeaturedProviders() {
    let providers: any[] = []
    try {
        // Fetch premium providers for the homepage
        providers = await getProvidersWithSearch({ tier: 'premium' })
    } catch (error) {
        console.error('Error fetching featured providers:', error)
    }

    // Dynamic Fetch: Best Rated Premium Providers
    const displayProviders = providers.length >= 3
        ? providers.slice(0, 3)
        : providers.length > 0
            ? providers
            : [] // Empty state handled by grid/mapping

    if (displayProviders.length === 0 && providers.length === 0) {
        // Fallback to top rated overall if no premium
        try {
            const allProviders = await getProvidersWithSearch({})
            providers = allProviders.sort((a: any, b: any) => (b.review_count || 0) - (a.review_count || 0)).slice(0, 3)
        } catch (e) { }
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                            Featured Specialists
                        </h2>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            We've partnered with the nation's top-rated aesthetic clinics to ensure you receive the highest quality care and transparent pricing.
                        </p>
                    </div>
                    <Link href="/find-providers">
                        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white px-8">
                            View All Providers
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayProviders.map((provider: any) => (
                        <EnhancedProviderCard key={provider.id || provider.slug} provider={provider} />
                    ))}
                </div>
            </div>
        </section>
    )
}
