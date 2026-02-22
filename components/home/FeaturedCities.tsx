import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { headers } from 'next/headers'

const featuredCities = [
    { name: 'New York', state: 'NY', slug: 'new-york-ny', avgCost: 18, providers: 142 },
    { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca', avgCost: 14, providers: 128 },
    { name: 'Miami', state: 'FL', slug: 'miami-fl', avgCost: 16, providers: 95 },
    { name: 'Chicago', state: 'IL', slug: 'chicago-il', avgCost: 12, providers: 82 },
    { name: 'Dallas', state: 'TX', slug: 'dallas-tx', avgCost: 11, providers: 76 },
    { name: 'Scottsdale', state: 'AZ', slug: 'scottsdale-az', avgCost: 13, providers: 64 },
    { name: 'Houston', state: 'TX', slug: 'houston-tx', avgCost: 11, providers: 89 },
    { name: 'San Francisco', state: 'CA', slug: 'san-francisco-ca', avgCost: 19, providers: 54 },
    { name: 'Portland', state: 'OR', slug: 'portland-or', avgCost: 14, providers: 90 },
]

export default async function FeaturedCities() {
    const headerList = await headers()
    const userCity = headerList.get('x-vercel-ip-city')

    // Sort cities to put the user's city first if it matches
    const sortedCities = [...featuredCities].sort((a, b) => {
        if (a.name === userCity) return -1
        if (b.name === userCity) return 1
        return 0
    })

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
                    {sortedCities.map((city) => (
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
                    <Link href="/claim" className="text-secondary hover:text-secondary/80 font-medium block mb-4">
                        Promote My Clinic →
                    </Link>
                    <Link href="/botox" className="text-secondary hover:text-secondary/80 font-medium">
                        View All States & Cities →
                    </Link>
                </div>
            </div>
        </section>
    )
}
