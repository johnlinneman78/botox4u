import { getTopScoringProviders } from '@/lib/actions/providers'
import { TopScoringCard } from '@/components/providers/TopScoringCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { headers } from 'next/headers'

export default async function FeaturedProviders() {
    let providers: any[] = []
    try {
        const headerList = await headers()
        const latStr = headerList.get('x-vercel-ip-latitude')
        const lngStr = headerList.get('x-vercel-ip-longitude')
        const userCity = headerList.get('x-vercel-ip-city')
        const userState = headerList.get('x-vercel-ip-country-region')

        const userLat = latStr ? parseFloat(latStr) : undefined
        const userLng = lngStr ? parseFloat(lngStr) : undefined

        // Fetch Top 3 Scoring Providers near the user
        providers = await getTopScoringProviders(3, userLat, userLng, userCity || undefined, userState || undefined)
    } catch (error) {
        console.error('Error fetching featured providers:', error)
    }

    const displayProviders = providers

    return (
        <section className="py-24 bg-[#FAF8F5] border-b border-[#3D2B1F]/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-16 gap-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#3D2B1F]">
                        Top-Scoring Providers
                    </h2>
                    <p className="text-[#3D2B1F]/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Ranked by Clarity Score™, natural result integrity, and 2026 clinical innovation. 100% independent data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                    {displayProviders.map((provider: any) => (
                        <TopScoringCard key={provider.id || provider.slug} provider={provider} />
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link href="/find-providers">
                        <Button variant="outline" className="border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/10 px-12 py-7 text-lg font-bold rounded-2xl shadow-sm transition-all hover:scale-[1.02]">
                            Browse All Providers →
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
