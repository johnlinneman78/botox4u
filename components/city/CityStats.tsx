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
            label: 'Market Average',
            value: `${formatCurrency(avgCost)}`,
            suffix: `/${NICHE.priceUnit.split(' ').slice(-1)}`,
            description: `Based on an audit of ${providerCount} local clinics in ${city}.`
        },
        {
            label: 'Patient Choice',
            value: `${avgRating.toFixed(1)}`,
            suffix: '/ 5.0',
            description: (
                <div className="flex flex-col gap-1 items-center">
                    <span style={{ color: 'var(--color-stone)' }}>{NICHE.googleAttribution.ratingText}</span>
                    <img
                        src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png"
                        alt="Powered by Google"
                        width="80"
                        className="opacity-40 grayscale"
                    />
                </div>
            )
        },
        {
            label: 'Quality Score',
            value: 'Audited',
            suffix: '',
            description: 'Scored on confirmed credentials, patient reviews, published pricing and contact details.'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="p-10 rounded-3xl border text-center transition-all hover:shadow-lg"
                    style={{
                        background: 'var(--color-surface)',
                        borderColor: 'var(--color-border)'
                    }}
                >
                    <p
                        className="font-body text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center"
                        style={{ color: 'var(--color-taupe)' }}
                    >
                        {stat.label}
                    </p>
                    <div className="flex items-baseline justify-center gap-1 mb-3">
                        <span
                            className="text-4xl font-display font-light"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            {stat.value}
                        </span>
                        {stat.suffix && (
                            <span
                                className="text-sm font-body font-medium"
                                style={{ color: 'var(--color-stone)' }}
                            >
                                {stat.suffix}
                            </span>
                        )}
                    </div>
                    <div
                        className="text-sm font-body leading-relaxed max-w-[200px] mx-auto"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    )
}
