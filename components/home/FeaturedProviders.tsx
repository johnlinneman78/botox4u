import { getTopScoringProviders } from '@/lib/actions/providers'
import { TopScoringCard } from '@/components/providers/TopScoringCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BuyersGuideCTA } from './BuyersGuideCTA'

export default async function FeaturedProviders() {
    let providers: any[] = []
    try {
        // Fetch Top Scoring Providers (Ranked by Botox-4U Index)
        providers = await getTopScoringProviders(6)
    } catch (error) {
        console.error('Error fetching featured providers:', error)
    }

    // Default to empty grid if fetch fails (fallback logic in action handles missing data)
    const displayProviders = providers

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-16 gap-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">
                        Top-Scoring Aesthetic Providers
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
                        Every provider is ranked by natural results, verified credentials, and real pricing — not by advertising spend.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                    {displayProviders.map((provider: any) => (
                        <TopScoringCard key={provider.id || provider.slug} provider={provider} />
                    ))}
                </div>

                <div className="flex justify-center mb-24">
                    <Link href="/find-providers">
                        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white px-12 py-7 text-lg font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02]">
                            View All Providers →
                        </Button>
                    </Link>
                </div>

                {/* Patient Education / Email Capture Block */}
                <BuyersGuideCTA />
            </div>
        </section>
    )
}
