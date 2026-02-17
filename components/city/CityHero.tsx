import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface CityHeroProps {
    city: string
    state: string
    treatmentName: string
    providerCount: number
}

export function CityHero({ city, state, treatmentName, providerCount }: CityHeroProps) {
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
                        Find Botox providers in <span className="text-secondary">{city}</span> with real per-unit pricing
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
                        Compare injectors, see credentials, and request quotes from {providerCount} top-rated aesthetic clinics in {city}, {state}.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="px-8 py-7 text-lg font-bold shadow-xl shadow-secondary/20"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Find providers & check prices
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-7 text-lg font-bold border-white/20 hover:bg-white/10 text-white"
                            onClick={() => document.getElementById('quick-quote')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Get a quote
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
