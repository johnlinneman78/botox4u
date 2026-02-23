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

            {/* Top Trend Ticker */}
            <div className="relative z-10 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-4 overflow-hidden">
                    <span className="flex items-center gap-1.5 text-[#d4af37] text-[10px] font-black uppercase tracking-widest shrink-0">
                        <TrendingUp className="w-3 h-3" /> 2026 Pulse
                    </span>
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
                        {TREND_TREATMENTS.map((t, i) => (
                            <span key={i} className="flex items-center gap-2 shrink-0">
                                {t.hot && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />}
                                <span className="text-white/70 text-xs font-semibold">{t.label}</span>
                                <span className="text-[10px] text-[#d4af37]/70 font-bold px-1.5 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">{t.tag}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex-1 flex flex-col justify-center">
                <div className="max-w-4xl">
                    {/* Era Badge */}
                    <div className="inline-flex items-center bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-sm gap-2">
                        <Dna className="w-3.5 h-3.5" />
                        The Neo-Romantic Era of Aesthetic Medicine
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-[72px] font-display font-bold text-white mb-6 leading-[1.05] tracking-tight">
                        {city ? (
                            <>Find {city}'s Top<span className="text-[#d4af37]"> Regenerative</span><br />Nurse Injectors</>
                        ) : (
                            <>Find Injectors Known<br />for <span className="text-[#d4af37]">Natural Results</span><br />
                                <span className="text-white/60 text-4xl md:text-5xl lg:text-6xl font-light italic">— not the overfilled look.</span>
                            </>
                        )}
                    </h1>

                    {/* Sub */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
                        In 2026, the gold standard is <span className="text-white font-semibold">biological repair</span> — not volume. We score every provider on Regen-Ratio™, natural result integrity, and 2026 treatment innovation. See real pricing before you book.
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

                        {/* Audit CTA */}
                        <Link href="/audit" className="flex-1">
                            <Button
                                size="lg"
                                className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] text-lg px-8 py-5 h-14 font-black shadow-2xl shadow-[#d4af37]/15 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get Free Clinic Audit
                            </Button>
                        </Link>

                        {/* Global Search */}
                        <Link href="/find-providers" className="flex-1">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-white/15 text-white hover:bg-white/5 text-lg px-8 py-5 h-14 font-semibold rounded-xl backdrop-blur-sm"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Browse All Cities
                            </Button>
                        </Link>
                    </div>

                    {/* Quick filter pills */}
                    <div className="flex flex-wrap gap-2 items-center mb-16">
                        <span className="text-gray-600 text-xs font-bold uppercase tracking-wider mr-1">Trending:</span>
                        {['Polynucleotides (PNs)', 'Daxxify 6-mo', 'Prejuvenation', 'Neo-Romantic Aesthetic', 'Nurse-Led'].map(tag => (
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
                        { value: '9.4', label: 'Top II-Score™', note: 'Pearl District, PDX' },
                        { value: '2026', label: 'PNs Now Trending', note: '#1 Regen Treatment' },
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
                    <ChevronRight className="w-5 h-5 rotate-90 animate-bounce" />
                </button>
            </div>
        </section>
    )
}
