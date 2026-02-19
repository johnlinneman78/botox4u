'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Search, DollarSign, Star, ShieldCheck, Target } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/find-providers?q=${encodeURIComponent(searchQuery)}`)
        } else {
            router.push(`/find-providers`)
        }
    }

    return (
        <section className="relative bg-[#1a2332] text-white py-24 md:py-32 overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
                {/* Gold Glow Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37] opacity-[0.05] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Text & Search */}
                    <div className="flex-1 max-w-2xl text-center lg:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <div className="h-16 w-auto -ml-2 mb-4 sm:mb-0 relative z-20">
                                <Logo variant="shield" className="h-full" theme="dark" />
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-xs font-bold tracking-widest uppercase animate-fade-in shadow-lg">
                                <Star className="w-3 h-3 fill-current" />
                                2026 Official Pricing Guide
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.1] text-balance">
                            {NICHE.copy.hero.headline.split(' — ')[0]} — <span className="text-[#d4af37]">{NICHE.copy.hero.headline.split(' — ')[1]}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {NICHE.copy.hero.subtext}
                        </p>

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-12 shadow-2xl shadow-black/20 rounded-xl relative z-30">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-40">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="City, Zip, or State..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 rounded-xl sm:rounded-r-none bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-base relative z-30"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-14 px-8 rounded-xl sm:rounded-l-none bg-[#d4af37] hover:bg-[#c0a030] text-[#1a2332] font-bold text-lg transition-all hover:scale-105 relative z-30"
                            >
                                {NICHE.copy.hero.cta}
                            </Button>
                        </form>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#d4af37] font-bold text-sm uppercase tracking-tighter">Natural Results</div>
                                    <div className="text-xs text-gray-400 font-medium leading-snug">Scored on real patient language</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#d4af37] font-bold text-sm uppercase tracking-tighter">Real Pricing</div>
                                    <div className="text-xs text-gray-400 font-medium leading-snug">Actual cost per unit, no surprises</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#d4af37] font-bold text-sm uppercase tracking-tighter">NPI Verified</div>
                                    <div className="text-xs text-gray-400 font-medium leading-snug">Federal credential confirmation</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none hidden lg:block">
                        <div className="relative">
                            {/* Decorative background blob */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />

                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4 translate-y-8">
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-800 border border-white/10 shadow-2xl relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
                                            alt="Professional Treatment Environment"
                                            className="grow object-cover w-full h-full opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors" />
                                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="text-white text-xs font-bold uppercase tracking-widest">Clinical Excellence</div>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-[#151b26] border border-white/10 shadow-xl">
                                        <div className="text-[#d4af37] text-3xl font-bold mb-1">100%</div>
                                        <div className="text-sm text-gray-400 leading-snug">Verification rate for licensing and board certifications</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-[#d4af37] text-[#1a2332] shadow-xl">
                                        <div className="font-bold text-lg mb-2">Real Pricing</div>
                                        <div className="h-1.5 w-full bg-[#1a2332]/10 rounded-full mb-3">
                                            <div className="h-full w-3/4 bg-[#1a2332] rounded-full" />
                                        </div>
                                        <div className="text-sm leading-snug opacity-90">We track price-per-unit across 50 states daily.</div>
                                    </div>
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-800 border border-white/10 shadow-2xl relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1000"
                                            alt="Natural Treatment Results"
                                            className="grow object-cover w-full h-full opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors" />
                                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="text-white text-xs font-bold uppercase tracking-widest">Natural Results</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
