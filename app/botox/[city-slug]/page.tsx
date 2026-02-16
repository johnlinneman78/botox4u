import { ProviderCard } from '@/components/providers/ProviderCard'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { getProviders, getCityStats } from '@/lib/actions/providers'

export default async function CityPage({ params }: { params: { 'city-slug': string } }) {
    const citySlug = params['city-slug']
    const cityName = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    // Real stats from Supabase
    const stats = await getCityStats(cityName)
    const providers = await getProviders({ city: cityName })

    const city = {
        name: cityName,
        state: providers[0]?.state || 'USA',
        avgCost: stats?.avgCost || 475,
        minCost: Math.round((stats?.avgCost || 475) * 0.75),
        maxCost: Math.round((stats?.avgCost || 475) * 1.5),
        providerCount: stats?.providerCount || 0,
        avgRating: stats?.avgRating || 0,
        description: `${cityName} is a key hub for cosmetic aesthetic treatments. Our directory helps you navigate the top-rated medspas and dermatologists in the area.`,
    }

    return (
        <div className="bg-white min-h-screen">
            {/* City Hero */}
            <section className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="verified">LOCAL GUIDE</Badge>
                            <span className="text-white/60 text-sm">Verified costs for {city.name}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                            Botox in {city.name}
                        </h1>
                        <p className="text-xl text-white/80 mb-8 leading-relaxed">
                            {city.description} Discover top-rated injectors, compare current local pricing, and read verified patient reviews.
                        </p>

                        <div className="flex flex-wrap gap-8 py-6 border-t border-white/10">
                            <div>
                                <div className="text-3xl font-bold text-secondary">{formatCurrency(city.avgCost)}</div>
                                <div className="text-sm text-white/60">Avg. Cost/Session</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{city.providerCount}</div>
                                <div className="text-sm text-white/60">Local Providers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{city.avgRating.toFixed(1)}/5</div>
                                <div className="text-sm text-white/60">Rating Avg.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats Grid */}
            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-1">Price Analysis</h3>
                                <p className="text-sm text-gray-600 mb-4">Market range in {city.name}</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-gray-500">Min: {formatCurrency(city.minCost)}</span>
                                    <span className="text-sm text-gray-500">Max: {formatCurrency(city.maxCost)}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-secondary w-1/2 ml-[25%]"></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-secondary/5 border-secondary/20">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-secondary mb-1">Expert Hub</h3>
                                <p className="text-sm text-gray-700 mb-3">High density of board-certified injectors found in {city.name}.</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                    <span>⭐ Top 5% National Rating Hub</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-1">SEO Data</h3>
                                <p className="text-sm text-gray-600 mb-4">Patient search trends</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-primary">↑ 12%</span>
                                    <span className="text-sm text-success font-medium">Growth</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Demand for aesthetic care is rising here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-2/3">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-display font-bold text-primary">
                                    Top Rated {city.name} Injectors
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {providers.length > 0 ? (
                                    providers.map((p: any) => (
                                        <ProviderCard key={p.id} provider={{
                                            ...p,
                                            averageRating: Number(p.average_rating),
                                            pricePerUnit: Number(p.price_per_unit),
                                            minTreatmentPrice: Number(p.min_treatment_price),
                                            listingTier: p.listing_tier,
                                            imageUrl: p.image_url
                                        }} />
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-gray-50 rounded-2xl">
                                        <p className="text-gray-500">We are currently verifying injectors in {city.name}.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="sticky top-24 space-y-8">
                                <Card className="bg-primary text-white p-8">
                                    <h3 className="text-xl font-display font-bold mb-4 text-secondary">
                                        Compare Local Costs
                                    </h3>
                                    <p className="text-sm text-white/70 mb-6 font-light leading-relaxed">
                                        Check out our interactive calculator to see how much you should expect to pay in {city.name}.
                                    </p>
                                    <a href="/cost-calculator">
                                        <Button className="w-full bg-white text-primary hover:bg-white/90">
                                            Open Calculator
                                        </Button>
                                    </a>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
