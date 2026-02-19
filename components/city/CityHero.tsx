'use client'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Star, ShieldCheck } from 'lucide-react'

interface CityHeroProps {
    city: string
    state: string
    treatmentName: string
    providerCount: number
}

export function CityHero({ city, state, treatmentName, providerCount }: CityHeroProps) {
    return (
        <section className="relative py-20 md:py-32 bg-primary text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-secondary) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary opacity-[0.03] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.05] blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in shadow-lg">
                        <MapPin className="w-3 h-3" />
                        {city}, {state} Official Guide
                    </div>

                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.1] text-balance">
                        Verified {treatmentName} Providers in <span className="text-secondary">{city}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
                        Compare {providerCount} medical professionals, view real per-unit pricing, and check verified credentials.
                        No hidden fees. No pay-to-play.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Button
                            className="h-14 px-8 rounded-xl bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-secondary/10"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Find Verified Providers
                        </Button>
                        <Button
                            variant="outline"
                            className="h-14 px-8 rounded-xl border-white/20 hover:bg-white/5 text-white font-medium text-lg"
                            onClick={() => document.getElementById('quick-quote')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Get A Quote
                        </Button>
                    </div>

                    {/* City Trust Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="text-center md:text-left md:border-r border-white/10 px-4">
                            <div className="text-2xl font-bold text-white mb-1">{providerCount}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Clinics</div>
                        </div>
                        <div className="text-center md:text-left md:border-r border-white/10 px-4">
                            <div className="text-2xl font-bold text-secondary mb-1">$10-16</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Price Range</div>
                        </div>
                        <div className="text-center md:text-left md:border-r border-white/10 px-4">
                            <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
                            <div className="flex flex-col gap-1 items-center md:items-start">
                                <div className="text-[10px] uppercase tracking-wider text-gray-400">Avg Rating</div>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png"
                                    alt="Powered by Google"
                                    className="h-2.5 opacity-60"
                                />
                            </div>
                        </div>
                        <div className="text-center md:text-left px-4 flex flex-col justify-center">
                            <div className="flex items-center justify-center md:justify-start gap-1 text-green-400 text-sm font-bold mb-1">
                                <ShieldCheck className="w-4 h-4" /> Verified
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Medical Data</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
