import { Badge } from '@/components/ui/Badge'

interface StateHeroProps {
    stateName: string
    providerCount: number
    avgCost: number
    cityCount: number
}

export function StateHero({ stateName, providerCount, avgCost, cityCount }: StateHeroProps) {
    return (
        <section className="relative pt-24 pb-32 overflow-hidden bg-primary">
            {/* Elegant Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-none" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Badge variant="premium" className="px-4 py-1">State Directory</Badge>
                        <span className="text-white/40 text-sm tracking-widest uppercase font-bold">InjectorIndex</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
                        Best Botox Providers in <span className="text-secondary italic">{stateName}</span>
                    </h1>

                    <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl">
                        Discover top-rated injectors and clinics across {stateName}. We've analyzed {providerCount} providers in {cityCount} cities to help you find the best treatment at the right price.
                    </p>

                    <div className="flex flex-wrap gap-10">
                        <div>
                            <div className="text-secondary font-display text-4xl font-bold mb-1">${avgCost}</div>
                            <div className="text-gray-400 text-sm tracking-wide font-bold uppercase">Avg. Cost / Unit</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div>
                            <div className="text-white font-display text-4xl font-bold mb-1">{providerCount}</div>
                            <div className="text-gray-400 text-sm tracking-wide font-bold uppercase">Verified Clinics</div>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div>
                            <div className="text-white font-display text-4xl font-bold mb-1">{cityCount}</div>
                            <div className="text-gray-400 text-sm tracking-wide font-bold uppercase">Local Cities</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
