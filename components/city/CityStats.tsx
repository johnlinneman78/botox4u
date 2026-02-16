import { formatCurrency } from '@/lib/utils'

interface CityStatsProps {
    avgCost: number
    providerCount: number
    avgRating: number
    city: string
}

export function CityStats({ avgCost, providerCount, avgRating, city }: CityStatsProps) {
    const stats = [
        {
            label: 'Average Cost',
            value: `${formatCurrency(avgCost)}/unit`,
            description: `Based on ${providerCount} local providers in ${city}.`
        },
        {
            label: 'Local Choice',
            value: `${avgRating.toFixed(1)} / 5.0`,
            description: 'Average patient satisfaction rating.'
        },
        {
            label: 'Top Brands',
            value: 'All-Inclusive',
            description: 'Botox, Dysport, and Xeomin options available.'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {stat.label}
                    </p>
                    <p className="text-3xl font-display font-bold text-primary mb-2">
                        {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">
                        {stat.description}
                    </p>
                </div>
            ))}
        </div>
    )
}
