'use client'

import { useEffect, useState } from 'react'

interface PriceMeterProps {
    avgCost: number
    city: string
}

export function PriceMeter({ avgCost, city }: PriceMeterProps) {
    const nationalAvg = 15
    const [percentage, setPercentage] = useState(50)

    // Calculate position: $10 is 0%, $20 is 100%, $15 is 50%
    useEffect(() => {
        const min = 10
        const max = 20
        const p = ((avgCost - min) / (max - min)) * 100
        const clampedP = Math.min(Math.max(p, 5), 95)

        // Timeout to trigger animation on mount
        const timer = setTimeout(() => setPercentage(clampedP), 100)
        return () => clearTimeout(timer)
    }, [avgCost])

    const isExpensive = avgCost > nationalAvg
    const diff = Math.abs(((avgCost - nationalAvg) / nationalAvg) * 100).toFixed(0)

    return (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Market Price Index</h3>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-primary">
                            How does <span className="text-secondary">{city}</span> compare?
                        </h2>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex items-baseline gap-2">
                        <span className="text-4xl font-display font-bold text-primary">${avgCost}</span>
                        <span className="text-gray-400 font-medium text-sm">/ unit avg</span>
                    </div>
                </div>

                {/* The Gauge */}
                <div className="relative pt-8 pb-12">
                    {/* Scale Labels */}
                    <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">
                        <span>Great Value</span>
                        <span className="text-gray-400">National Average ($15)</span>
                        <span>Premium Market</span>
                    </div>

                    {/* Gauge Track */}
                    <div className="h-4 w-full bg-gray-100 rounded-full relative shadow-inner">
                        {/* Gradient Fill */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-secondary to-rose-400 opacity-20" />

                        {/* National Avg Marker */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 z-10" />

                        {/* Pointer / Needle */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
                            style={{ left: `${percentage}%` }}
                        >
                            <div className="relative">
                                {/* The Needle */}
                                <div className="w-1 h-8 bg-primary rounded-full shadow-lg -mt-4 relative z-20" />
                                <div className="w-4 h-4 bg-primary ring-4 ring-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-md" />

                                {/* Label Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap">
                                    <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
                                        Current: ${avgCost}
                                        <span className={`w-2 h-2 rounded-full ${isExpensive ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                    </div>
                                    {/* Tooltip Arrow */}
                                    <div className="w-2 h-2 bg-primary rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tick Marks */}
                    <div className="flex justify-between px-1 mt-4">
                        {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((val) => (
                            <div key={val} className="flex flex-col items-center gap-1">
                                <div className={`w-0.5 h-2 ${val % 5 === 0 ? 'bg-gray-300 h-3' : 'bg-gray-200'}`} />
                                <span className={`text-[10px] font-bold ${val === 15 ? 'text-gray-500' : 'text-gray-300'}`}>${val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insight Footer */}
                <div className="mt-4 flex flex-col md:flex-row items-center gap-4 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                                👩‍⚕️
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-primary font-medium leading-tight text-center md:text-left">
                        {isExpensive
                            ? `Prices in ${city} are approximately ${diff}% higher than the US average. Best to compare multiple clinics for competitive unit rates.`
                            : `Outstanding value! ${city} prices are ${diff}% lower than the national average, making this an excellent location for full-dose treatments.`
                        }
                    </p>
                    <button
                        onClick={() => document.getElementById('pricing-guide')?.scrollIntoView({ behavior: 'smooth' })}
                        className="md:ml-auto text-xs font-black text-secondary uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        View Pricing Guide
                    </button>
                </div>
            </div>
        </div>
    )
}
