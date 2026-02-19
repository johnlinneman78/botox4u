import { formatCurrency } from '@/lib/utils'
import { NICHE } from '@/config/niche'

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
            value: `${formatCurrency(avgCost)}/${NICHE.priceUnit.split(' ').slice(-1)}`,
            description: `Based on ${providerCount} local providers in ${city}.`
        },
        {
            label: 'Local Choice',
            value: `${avgRating.toFixed(1)} / 5.0`,
            description: (
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500">{NICHE.googleAttribution.ratingText}</span>
                    <img
                        src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                        alt="Powered by Google"
                        className="h-3 w-fit opacity-70"
                    />
                </div>
            )
        },
        {
            label: 'Top Brands',
            value: 'All-Inclusive',
            description: `${NICHE.calculator.variables.map(v => v.label).join(', ')} options available.`
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
                    <div className="text-sm text-gray-500">
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    )
}
