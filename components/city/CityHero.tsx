import { Badge } from '@/components/ui/Badge'

interface CityHeroProps {
    city: string
    state: string
    providerCount: number
}

export function CityHero({ city, state, providerCount }: CityHeroProps) {
    return (
        <section className="relative py-20 bg-primary text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent opacity-30"></div>
                <div className="grid grid-cols-6 h-full w-full">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-r border-white/10 h-full"></div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                    <Badge variant="premium" className="mb-6 bg-secondary/20 text-secondary border-secondary/30">
                        2026 LOCAL PROVIDER GUIDE
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        Best Botox Injectors in <span className="text-secondary">{city}, {state}</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Compare {providerCount} top-rated aesthetic clinics in {city}. Explore transparent pricing, verified reviews, and book with the most trusted professionals in your area.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">{providerCount} Verified Providers</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <span className="text-secondary font-bold">✓</span>
                            <span className="text-sm font-medium">Price Transparency</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
