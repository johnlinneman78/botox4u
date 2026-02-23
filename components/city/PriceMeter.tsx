'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NICHE } from '@/config/niche'
import { MapPin, ChevronDown } from 'lucide-react'

interface PriceMeterProps {
    avgCost: number
    city: string
}

export function PriceMeter({ avgCost, city }: PriceMeterProps) {
    const router = useRouter()
    const nationalAvg = Math.round((NICHE.priceRange.min + NICHE.priceRange.max) / 2)
    const [percentage, setPercentage] = useState(50)

    useEffect(() => {
        const min = NICHE.priceRange.min
        const max = NICHE.priceRange.max
        const p = ((avgCost - min) / (max - min)) * 100
        const clampedP = Math.min(Math.max(p, 5), 95)
        const timer = setTimeout(() => setPercentage(clampedP), 100)
        return () => clearTimeout(timer)
    }, [avgCost])

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const citySlug = e.target.value
        router.push(`/${NICHE.baseSlug}/${citySlug}`)
    }

    const isExpensive = avgCost > nationalAvg
    const diff = Math.abs(((avgCost - nationalAvg) / nationalAvg) * 100).toFixed(0)

    return (
        <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/[0.06] overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
                            <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">Market Price Index</h3>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white">
                            How does <span className="text-[#d4af37]">{city}</span> compare?
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <select
                                value={NICHE.cities.find(c => c.name === city)?.slug || ''}
                                onChange={handleCityChange}
                                className="appearance-none bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 outline-none cursor-pointer"
                            >
                                <option value="" disabled>Select a City</option>
                                {NICHE.cities.map((c: any) => (
                                    <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.06] flex items-baseline gap-2">
                            <span className="text-4xl font-display font-bold text-white">{NICHE.priceCurrency}{avgCost}</span>
                            <span className="text-gray-600 font-medium text-sm">/{NICHE.priceUnit.split(' ').slice(-1)} avg</span>
                        </div>
                    </div>
                </div>

                {/* The Gauge */}
                <div className="relative pt-8 pb-12">
                    <div className="flex justify-between text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-4">
                        <span>Great Value</span>
                        <span className="text-gray-500">National Average ({NICHE.priceCurrency}{nationalAvg})</span>
                        <span>Premium Market</span>
                    </div>

                    <div className="h-4 w-full bg-white/5 rounded-full relative shadow-inner border border-white/[0.06]">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-[#d4af37]/30 to-rose-500/30" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 z-10" />

                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
                            style={{ left: `${percentage}%` }}
                        >
                            <div className="relative">
                                <div className="w-1 h-8 bg-white rounded-full shadow-lg -mt-4 relative z-20" />
                                <div className="w-4 h-4 bg-white ring-4 ring-[#0d1420] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-md" />

                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap">
                                    <div className="bg-white text-[#0d1420] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
                                        Current: ${avgCost}
                                        <span className={`w-2 h-2 rounded-full ${isExpensive ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                    </div>
                                    <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between px-1 mt-4">
                        {Array.from({ length: NICHE.priceRange.max - NICHE.priceRange.min + 1 }, (_, i) => NICHE.priceRange.min + i).map((val) => (
                            <div key={val} className="flex flex-col items-center gap-1">
                                <div className={`w-0.5 h-2 ${val === nationalAvg ? 'bg-white/20 h-3' : 'bg-white/5'}`} />
                                <span className={`text-[10px] font-bold ${val === nationalAvg ? 'text-gray-400' : 'text-gray-700'}`}>{NICHE.priceCurrency}{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insight Footer */}
                <div className="mt-4 flex flex-col md:flex-row items-center gap-4 p-6 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/10">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1420] bg-white/10 flex items-center justify-center text-xs">
                                👩‍⚕️
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 font-medium leading-tight text-center md:text-left">
                        {isExpensive
                            ? `Prices in ${city} are approximately ${diff}% higher than the US average. Best to compare multiple clinics for competitive unit rates.`
                            : `Outstanding value! ${city} prices are ${diff}% lower than the national average, making this an excellent location for full-dose treatments.`
                        }
                    </p>
                    <button
                        onClick={() => document.getElementById('pricing-guide')?.scrollIntoView({ behavior: 'smooth' })}
                        className="md:ml-auto text-xs font-black text-[#d4af37] uppercase tracking-widest hover:text-white transition-colors"
                    >
                        View Pricing Guide
                    </button>
                </div>
            </div>
        </div>
    )
}
