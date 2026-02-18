import { getProvidersWithSearch } from '@/lib/actions/providers'
import { ProviderCard } from '@/components/providers/ProviderCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function FeaturedProviders() {
    // Fetch premium providers for the homepage
    const providers = await getProvidersWithSearch({ tier: 'premium' })
    const displayProviders = providers.slice(0, 3)

    if (displayProviders.length === 0) return null

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

                <div className="grid grid-cols-1 gap-8">
                    {displayProviders.map((provider: any) => (
                        <ProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            </div>
        </section>
    )
}
