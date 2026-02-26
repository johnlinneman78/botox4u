'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Search, Dna, Clock, Sparkles, ChevronRight, TrendingUp, MapPin, ChevronDown } from 'lucide-react'
import { NICHE } from '@/config/niche'
import Link from 'next/link'
import React, { useState } from 'react'

const TREND_TREATMENTS = [
    { label: 'Polynucleotides', tag: '#1 2026', hot: true },
    { label: 'Daxxify 6-Mo', tag: 'Longevity', hot: true },
    { label: 'Biostimulators', tag: 'Volume Repair', hot: false },
    { label: 'Exosome Therapy', tag: 'Emerging', hot: false },
    { label: 'Baby Botox', tag: 'Gen Z Fav', hot: true },
]

export default function Hero({ city: initialCity, state }: { city?: string; state?: string; userLat?: number; userLng?: number }) {
    const router = useRouter()
    const [selectedCity, setSelectedCity] = useState(initialCity || '')

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const citySlug = e.target.value
        if (citySlug) {
            router.push(`/${NICHE.baseSlug}/${citySlug}`)
        }
    }
    return (
        <section className="relative bg-[#0d1420] overflow-hidden min-h-[92vh] flex flex-col justify-center">
            {/* Background: subtle grid + gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1420] via-[#101827] to-[#0a0f18]" />
            <div className="absolute inset-0 opacity-[0.035]" style={{
                backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                backgroundSize: '28px 28px'
            }} />
            {/* Glow accents */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#d4af37] opacity-[0.04] blur-[180px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 opacity-[0.03] blur-[180px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            {/* Trust Bar (replacing Pulse Ticker) */}
            <div className="relative z-10 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                        500+ Providers Indexed
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                        22 Cities
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                        Real Pricing Data
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                        Zero Pay-to-Rank
                    </span>
                </div>
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex-1 flex flex-col justify-center">
                <div className="max-w-4xl">
                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-[72px] font-display font-bold text-white mb-6 leading-[1.05] tracking-tight">
                        Find the Best Injectors Near You — <span className="text-[#d4af37]">Ranked by Results</span>, Not Reviews
                    </h1>

                    {/* Sub */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
                        InjectorIndex scores 500+ providers across 22 cities on credentials, technique quality, and patient outcomes. See real pricing before you book.
                    </p>

                    {/* CTA Row */}
                    <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-12">
                        {/* City Selector */}
                        <div className="relative flex-1 group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37] z-20 group-hover:scale-110 transition-transform" />
                            <select
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full h-14 pl-12 pr-10 bg-white/[0.04] border border-white/10 rounded-xl text-white font-bold text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 hover:bg-white/[0.06] transition-all"
                            >
                                <option value="" disabled className="bg-[#0d1420]">Select your city...</option>
                                {NICHE.cities.map((c: any) => (
                                    <option key={c.slug} value={c.slug} className="bg-[#0d1420]">{c.name}, {c.state}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Search CTA */}
                        <Link href="/find-providers" className="flex-1">
                            <Button
                                size="lg"
                                className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] text-lg px-8 py-5 h-14 font-black shadow-2xl shadow-[#d4af37]/15 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                Compare Top Injectors
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </Link>

                        {/* Score Check CTA */}
                        <Link href="/find-providers" className="flex-1">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-white/15 text-white hover:bg-white/5 text-lg px-8 py-5 h-14 font-semibold rounded-xl backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                Check Any Provider's Score
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Button>
                        </Link>
                    </div>

                    {/* Quick filter pills */}
                    <div className="flex flex-wrap gap-2 items-center mb-16">
                        <span className="text-gray-600 text-xs font-bold uppercase tracking-wider mr-1">Top Searches:</span>
                        {['Botox', 'Lip Filler', 'Daxxify', 'Polynucleotides', 'Jawline Contouring'].map(tag => (
                            <Link
                                key={tag}
                                href={`/find-providers?q=${encodeURIComponent(tag)}`}
                                className="text-xs font-semibold text-white/60 border border-white/10 px-3 py-1.5 rounded-full hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
                    {[
                        { value: '500+', label: 'Providers Indexed', note: 'Across 22+ Cities' },
                        { value: '$9–25', label: 'Per Unit Pricing', note: 'Real Market Rates' },
                        { value: '98', label: 'Top TrueScore™', note: initialCity ? `${initialCity} Market` : 'Top Neighborhoods' },
                        { value: 'AI-Audit', label: 'Results Verification', note: 'Zero Pay-to-Rank' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] px-6 py-5 text-center hover:bg-white/[0.05] transition-colors">
                            <div className="text-3xl font-black text-[#d4af37] mb-1 font-display">{stat.value}</div>
                            <div className="text-xs font-bold text-white/80 uppercase tracking-wider">{stat.label}</div>
                            <div className="text-[10px] text-white/30 mt-0.5">{stat.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll nudge */}
            <div className="relative z-10 flex justify-center pb-8">
                <button
                    onClick={() => document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex flex-col items-center gap-1 text-white/20 hover:text-white/40 transition-colors"
                    aria-label="Scroll down"
                >
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </button>
            </div>
        </section>
    )
}
