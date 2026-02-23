'use client'

import { useState, useEffect } from 'react'
import { Dna, Clock, Leaf, Zap, ChevronRight, MapPin, ShieldCheck, Target, ArrowRight, Activity, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Slider } from '@/components/ui/Slider'
import { Button } from '@/components/ui/Button'
import { NICHE } from '@/config/niche'
import { CITY_COORDS } from '@/lib/cityCoords'

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const TREATMENTS = [
    {
        id: 'pns',
        rank: '01',
        name: 'Polynucleotides (PNs)',
        badge: '🔬 #1 2026 Trend',
        tagline: 'Regeneration over Hydration',
        desc: 'Derived from DNA fragments, PNs instruct fibroblasts to produce new collagen — repairing under-eyes and crepey skin without the puffy filler risk.',
        priceConfig: { min: 550, max: 900, step: 25, label: 'per session' },
        icon: <Dna className="w-6 h-6" />,
        color: 'from-emerald-950/60 to-emerald-950/20',
        border: 'border-emerald-800/30',
        badge_color: 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
        accent: 'text-emerald-400',
        searchQuery: 'Polynucleotides',
    },
    {
        id: 'daxxify',
        rank: '02',
        name: 'Daxxify & Long-Acting Tox',
        badge: '⏱ 6–9 Month Duration',
        tagline: 'Prejuvenation & Longevity',
        desc: 'Daxxify\'s peptide-exchange tech (RTP004) doubles standard toxin duration. Gen Z uses micro-doses preventatively. Busy professionals get theirs just twice a year.',
        priceConfig: { min: 9, max: 14, step: 0.5, label: 'per unit' },
        icon: <Clock className="w-6 h-6" />,
        color: 'from-blue-950/60 to-blue-950/20',
        border: 'border-blue-800/30',
        badge_color: 'bg-blue-900/40 text-blue-400 border-blue-700/40',
        accent: 'text-blue-400',
        searchQuery: 'Daxxify',
    },
    {
        id: 'exosomes',
        rank: '03',
        name: 'Plant-Derived Exosomes',
        badge: '🌿 Holistic / Clean',
        tagline: 'Cellular Reset & Recovery',
        desc: 'Rose Stem Cell Exosomes (RSCE) and "Hybrosomes" cut post-procedure downtime by 50%. Ideal for inflammation, eczema, and post-microneedling recovery.',
        priceConfig: { min: 350, max: 750, step: 25, label: 'as add-on' },
        icon: <Leaf className="w-6 h-6" />,
        color: 'from-violet-950/60 to-violet-950/20',
        border: 'border-violet-800/30',
        badge_color: 'bg-violet-900/40 text-violet-400 border-violet-700/40',
        accent: 'text-violet-400',
        searchQuery: 'Exosomes',
    },
    {
        id: 'biostimulators',
        rank: '04',
        name: 'Biostimulators (Sculptra)',
        badge: '💎 Structural Health',
        tagline: 'Ozempic Face Repair',
        desc: 'Collagen biostimulators like Sculptra trigger your body\'s own structural repair. Results last 18–24 months. The antidote to "Ozempic Face" volume loss.',
        priceConfig: { min: 850, max: 1200, step: 50, label: 'per vial' },
        icon: <Zap className="w-6 h-6" />,
        color: 'from-amber-950/60 to-amber-950/20',
        border: 'border-amber-800/30',
        badge_color: 'bg-amber-900/40 text-amber-400 border-amber-700/40',
        accent: 'text-amber-400',
        searchQuery: 'Sculptra',
    },
]

const TIERS = [
    { id: 'institutional', label: 'Institutional', desc: 'High-volume medical spas & traditional clinics.' },
    { id: 'boutique', label: 'Boutique', desc: 'Specialized, doctor-led aesthetic practices.' },
    { id: 'independent', label: 'Independent', desc: 'Certified individual injectors & concierge providers.' },
]

export default function TreatmentTrends() {
    const [selectedId, setSelectedId] = useState<string | null>(TREATMENTS[0].id)
    const [sliderValue, setSliderValue] = useState<number[]>([TREATMENTS[0].priceConfig.min])
    const [location, setLocation] = useState('Portland')
    const [isLocating, setIsLocating] = useState(false)

    useEffect(() => {
        // Detect location on mount
        const detectLocation = async () => {
            if (!navigator.geolocation) return;
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                let nearestName = 'Portland';
                let minDist = Infinity;

                Object.entries(CITY_COORDS).forEach(([slug, coords]) => {
                    const dist = getDistance(latitude, longitude, coords.lat, coords.lng);
                    if (dist < minDist) {
                        minDist = dist;
                        const cityMatch = NICHE.cities.find((c: any) => c.slug === slug || c.slug.startsWith(slug));
                        nearestName = cityMatch ? cityMatch.name : (slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '));
                    }
                });
                setLocation(nearestName);
                setIsLocating(false);
            }, () => setIsLocating(false));
        };
        detectLocation();
    }, []);

    useEffect(() => {
        const current = TREATMENTS.find(t => t.id === selectedId)
        if (current) {
            setSliderValue([current.priceConfig.min])
        }
    }, [selectedId])

    const activeTreatment = TREATMENTS.find(t => t.id === selectedId) || TREATMENTS[0]

    return (
        <section className="py-24 bg-[#101827] border-y border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-5">
                            2026 Treatment Hierarchy
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Regen-First. <span className="text-[#d4af37]">Treatment Intelligence.</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                            The aesthetic market has shifted from correction to biological repair. Interactive intelligence for the 2026 needle-based shift.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="relative inline-flex items-center gap-2 text-[#d4af37] text-sm font-bold bg-[#d4af37]/5 px-4 py-2 rounded-xl border border-[#d4af37]/10">
                            <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce' : ''}`} />
                            <span className="sr-only">Location:</span>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-transparent border-none text-[#d4af37] font-bold focus:ring-0 cursor-pointer appearance-none pr-6 outline-none"
                            >
                                {NICHE.cities.map((c: any) => (
                                    <option key={c.slug} value={c.name} className="bg-[#0d1420]">{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#d4af37] pointer-events-none" />
                        </div>
                        <Link
                            href="/botox-buyers-guide"
                            className="shrink-0 inline-flex items-center gap-2 text-gray-500 hover:text-[#d4af37] font-bold transition-all text-sm group"
                        >
                            Download the Free 2026 Regen Aesthetic Buyers Guide <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Treatment Selection - Horizontal Scroll on Mobile, Vertical on Desktop */}
                    <div className="lg:col-span-4 flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible scrollbar-none snap-x h-fit">
                        {TREATMENTS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedId(t.id)}
                                className={`group relative shrink-0 w-[280px] lg:w-full snap-center bg-gradient-to-br ${t.color} border transition-all duration-300 rounded-3xl p-6 text-left ${selectedId === t.id
                                    ? `ring-2 ring-[#d4af37] scale-[1.02] shadow-2xl shadow-[#d4af37]/10 ${t.border}`
                                    : `border-white/5 opacity-40 hover:opacity-100 hover:border-white/20`
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl bg-white/5 ${t.accent} group-hover:scale-110 transition-transform`}>
                                        {t.icon}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${t.badge_color} group-hover:border-[#d4af37]/30 transition-colors`}>
                                        {t.badge}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${t.accent}`}>{t.tagline}</p>
                                    </div>
                                    {selectedId === t.id ? (
                                        <div className="h-1 w-8 bg-[#d4af37] rounded-full mt-2" />
                                    ) : (
                                        <span className="text-[9px] font-black text-[#d4af37]/60 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            See pricing →
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: Dynamic Intelligence Panel */}
                    <div className="lg:col-span-8">
                        <div className="bg-white/[0.02] border border-white/[0.1] rounded-[3rem] p-8 md:p-12 h-full flex flex-col justify-between">
                            <div className="space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <div className={`text-sm font-black uppercase tracking-[0.2em] ${activeTreatment.accent} mb-2`}>
                                            {activeTreatment.name} Intelligence
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                            {activeTreatment.desc}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-600 uppercase mb-1">Target {location} Market Price</div>
                                        <div className={`text-5xl font-display font-bold ${activeTreatment.accent} tabular-nums`}>
                                            ${sliderValue[0].toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                                            {activeTreatment.priceConfig.label}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase">
                                        <span>Market Floor (${activeTreatment.priceConfig.min})</span>
                                        <span>Aesthetic Ceiling (${activeTreatment.priceConfig.max})</span>
                                    </div>
                                    <Slider
                                        value={sliderValue}
                                        onValueChange={setSliderValue}
                                        min={activeTreatment.priceConfig.min}
                                        max={activeTreatment.priceConfig.max}
                                        step={activeTreatment.priceConfig.step}
                                        className="py-4"
                                    />
                                    <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-2xl p-5 flex items-start gap-4">
                                        <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-400 leading-relaxed font-light">
                                            Prices at <span className="text-white font-bold">${sliderValue[0]}</span> typically indicate <span className="text-white font-bold">{sliderValue[0] > activeTreatment.priceConfig.min + (activeTreatment.priceConfig.max - activeTreatment.priceConfig.min) / 2 ? 'Premium Clinical Oversight' : 'Standard Market Entry'}</span>. Rankings adjust based on local {location} real-time benchmarks.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {TIERS.map(tier => (
                                        <div key={tier.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden group/tier">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-[#d4af37]" />
                                                <h4 className="font-bold text-white text-sm">{tier.label}</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                                {tier.desc}
                                            </p>
                                            {tier.id === 'boutique' && (
                                                <div className="mt-3 pt-3 border-t border-white/5">
                                                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-tighter bg-[#d4af37]/10 px-2 py-0.5 rounded">
                                                        Most common for first-timers
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href={`/find-providers?q=${activeTreatment.searchQuery}&location=${location}`}
                                    className={`flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#d4af37] text-[#0d1420] font-black text-sm uppercase tracking-widest hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all group`}
                                >
                                    Find {activeTreatment.searchQuery} Providers in {location}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/audit"
                                    className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white font-black text-sm uppercase tracking-widest hover:bg-white/[0.05] transition-all group"
                                >
                                    <Activity className="w-4 h-4 text-[#d4af37] group-hover:animate-pulse" />
                                    Get Your Free Clinic Audit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-xs text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Data powered by <span className="text-gray-500 font-bold">Injector Index Intelligence™</span>. Every provider returned includes an <span className="text-[#d4af37]">II-Score™</span> audit to verify clinical results quality. Rankings are pure data, zero pay-to-rank.
                    </p>
                </div>
            </div>
        </section>
    )
}
