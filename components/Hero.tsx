'use client'

import { Button } from '@/components/ui/Button'
import { Search, MapPin, DollarSign } from 'lucide-react'
import { NICHE } from '@/config/niche'

export default function Hero({ city, state }: { city?: string, state?: string }) {
    return (
        <section className="relative bg-[#1a2332] overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37] opacity-[0.05] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8 shadow-lg backdrop-blur-sm">
                        <DollarSign className="w-3 h-3 mr-2" />
                        Transparent Pricing • Verified Providers
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
                        {city === 'Portland' ? (
                            <>Portland's Most Transparent <span className="text-[#d4af37]">{NICHE.name} Index</span></>
                        ) : (
                            <>Find {NICHE.name} Providers in {city || 'Your City'}</>
                        )}
                        <span className="block text-[#d4af37] text-4xl md:text-5xl lg:text-6xl mt-2 font-display italic">
                            with Real Pricing
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Compare verified injectors side-by-side. See actual per-unit pricing, credentials,
                        and specialties. No pay-to-play rankings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Button
                            size="lg"
                            className="bg-[#d4af37] hover:bg-[#c0a030] text-[#1a2332] text-lg px-8 py-6 h-14 font-bold shadow-xl shadow-[#d4af37]/10 w-full sm:w-auto rounded-xl transition-transform hover:scale-105"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Find Providers
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6 h-14 font-medium w-full sm:w-auto rounded-xl backdrop-blur-sm"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View Pricing
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white mt-16 pt-8 border-t border-white/5 max-w-5xl mx-auto">
                    <div>
                        <div className="text-4xl font-bold text-[#d4af37] mb-2 font-display">500+</div>
                        <div className="text-sm uppercase tracking-wider text-gray-400 font-bold">Providers Listed</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#d4af37] mb-2 font-display">12–$25</div>
                        <div className="text-sm uppercase tracking-wider text-gray-400 font-bold">Per Unit Pricing</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#d4af37] mb-2 font-display">4.8⭐</div>
                        <div className="text-sm uppercase tracking-wider text-gray-400 font-bold">Average Rating</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#d4af37] mb-2 font-display">50+</div>
                        <div className="text-sm uppercase tracking-wider text-gray-400 font-bold">Cities Covered</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
