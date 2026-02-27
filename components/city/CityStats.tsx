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
                        src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png"
                        alt="Powered by Google"
                        width="96"
                        height="12"
                        className="h-3 w-fit opacity-40"
                    />
                </div>
            )
        },
        {
            label: 'Independent Ranking',
            value: 'TrueScore™',
            description: 'Providers prioritized by clinical credentials, patient outcomes, and price transparency.'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white/[0.02] p-8 rounded-2xl border border-white/[0.06] text-center backdrop-blur-sm">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                        {stat.label}
                    </p>
                    <p className="text-3xl font-display font-bold text-white mb-2">
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
