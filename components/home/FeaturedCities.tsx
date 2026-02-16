import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

const featuredCities = [
    { name: 'Beverly Hills', state: 'CA', slug: 'beverly-hills-ca', avgCost: 525, providers: 15 },
    { name: 'Miami', state: 'FL', slug: 'miami-fl', avgCost: 475, providers: 12 },
    { name: 'Dallas', state: 'TX', slug: 'dallas-tx', avgCost: 440, providers: 10 },
    { name: 'Chicago', state: 'IL', slug: 'chicago-il', avgCost: 450, providers: 8 },
]

export default function FeaturedCities() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold text-primary mb-4">
                        Popular Cities
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore Botox providers in major metropolitan areas across the United States
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredCities.map((city) => (
                        <Link key={city.slug} href={`/botox/${city.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-display font-semibold text-primary mb-2">
                                        {city.name}, {city.state}
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Average Cost:</span>
                                            <span className="font-semibold text-secondary">{formatCurrency(city.avgCost)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Providers:</span>
                                            <span className="font-semibold">{city.providers}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-secondary font-medium">
                                        View Providers →
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/botox" className="text-secondary hover:text-secondary/80 font-medium">
                        View All States & Cities →
                    </Link>
                </div>
            </div>
        </section>
    )
}
