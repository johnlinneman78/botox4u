import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface CityData {
    city: string
    state: string
    count: number
}

interface CityListProps {
    cities: CityData[]
    stateName: string
}

export function CityList({ cities, stateName }: CityListProps) {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-primary mb-4">
                            Browse by City in {stateName}
                        </h2>
                        <p className="text-gray-600 max-w-xl">
                            Select your city to find local providers, compare pricing, and view treatment statistics specific to your area.
                        </p>
                    </div>
                    <div className="text-sm font-bold text-primary uppercase tracking-widest bg-gray-100 px-6 py-3 rounded-full">
                        {cities.length} Cities Covered
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cities.map((cityData) => {
                        const slug = `${cityData.city.toLowerCase().replace(/ /g, '-')}-${cityData.state.toLowerCase()}`
                        return (
                            <Link key={cityData.city} href={`/botox/${slug}`} className="group">
                                <Card className="p-6 hover:shadow-xl transition-all border-gray-100 group-hover:border-secondary/30 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/5 -mr-8 -mt-8 rounded-full group-hover:bg-secondary/10 transition-colors" />

                                    <h3 className="text-xl font-display font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                                        {cityData.city}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 font-medium">
                                            {cityData.count} {cityData.count === 1 ? 'Provider' : 'Providers'}
                                        </span>
                                        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-all font-bold text-lg">
                                            →
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
