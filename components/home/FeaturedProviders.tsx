import { getTopScoringProviders } from '@/lib/actions/providers'
import { TopScoringCard } from '@/components/providers/TopScoringCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function FeaturedProviders() {
    let providers: any[] = []
    try {
        // Fetch Top 3 Scoring Providers as requested in P2
        providers = await getTopScoringProviders(3)
    } catch (error) {
        console.error('Error fetching featured providers:', error)
    }

    const displayProviders = providers

    return (
        <section className="py-24 bg-white border-b border-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-16 gap-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">
                        Top-Scoring Providers
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Ranked by natural results, verified credentials, and real pricing. 100% independent data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                    {displayProviders.map((provider: any) => (
                        <TopScoringCard key={provider.id || provider.slug} provider={provider} />
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link href="/find-providers">
                        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white px-12 py-7 text-lg font-bold rounded-2xl shadow-sm transition-all hover:scale-[1.02]">
                            Browse All Providers →
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
