'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { NICHE } from '@/config/niche'
import { Button } from '@/components/ui/Button'
import { ChevronDown, Info } from 'lucide-react'

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
        const timer = setTimeout(() => setPercentage(clampedP), 300)
        return () => clearTimeout(timer)
    }, [avgCost])

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const citySlug = e.target.value
        router.push(`/${NICHE.baseSlug}/${citySlug}`)
    }

    const isExpensive = avgCost > nationalAvg
    const diff = Math.abs(((avgCost - nationalAvg) / nationalAvg) * 100).toFixed(0)

    return (
        <section id="price-meter" className="py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-10 md:p-16 rounded-[40px] border relative overflow-hidden group"
                style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    boxShadow: 'var(--shadow-xl)'
                }}
            >
                {/* Decorative Elements */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
                        marginRight: '-10%',
                        marginTop: '-10%'
                    }}
                />

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="flex h-2 w-2 rounded-full" style={{ background: 'var(--color-gold)' }} />
                                <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--color-taupe)' }}>
                                    Market Price Index
                                </h3>
                            </div>
                            <h2
                                className="text-3xl md:text-5xl font-display font-light mb-6"
                                style={{ color: 'var(--color-espresso)', lineHeight: 1.1 }}
                            >
                                How does <span className="italic" style={{ color: 'var(--color-gold)' }}>{city}</span> compare <br className="hidden md:block" /> to the national average?
                            </h2>
                            <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                We track real-world pricing data to give you a transparent look at what patients are actually paying in your area.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                            <div className="relative group/select">
                                <select
                                    value={NICHE.cities.find(c => c.name === city)?.slug || ''}
                                    onChange={handleCityChange}
                                    className="appearance-none w-full sm:w-64 px-6 py-4 rounded-xl font-body font-bold text-xs uppercase tracking-widest cursor-pointer transition-all outline-none border"
                                    style={{
                                        background: 'var(--color-bg)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-espresso)'
                                    }}
                                >
                                    <option value="" disabled>Switch Location</option>
                                    {NICHE.cities.map((c: any) => (
                                        <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]" style={{ color: 'var(--color-stone)' }} />
                            </div>

                            <div className="flex items-baseline gap-3 px-8 py-5 rounded-2xl border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                                <span className="text-5xl font-display font-light" style={{ color: 'var(--color-espresso)' }}>
                                    <span className="text-2xl align-top mr-1" style={{ color: 'var(--color-gold)' }}>$</span>{avgCost}
                                </span>
                                <span className="font-body text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--color-taupe)' }}>
                                    avg / {NICHE.priceUnit.split(' ').slice(-1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* The Gauge Container */}
                    <div className="relative py-12 px-2">
                        <div className="flex justify-between font-body text-[9px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--color-taupe)' }}>
                            <span>Value Market</span>
                            <span className="hidden sm:block">National Average (${nationalAvg})</span>
                            <span>Premium Market</span>
                        </div>

                        <div className="relative h-3 w-full rounded-full border shadow-inner" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'var(--color-border)' }}>
                            {/* Color Gradient Track */}
                            <div
                                className="absolute inset-0 rounded-full opacity-40"
                                style={{ background: 'linear-gradient(to right, var(--color-success), var(--color-gold), var(--color-error))' }}
                            />

                            {/* Marker line for national average */}
                            <div className="absolute left-1/2 top-[-10px] bottom-[-10px] w-0.5 z-10" style={{ background: 'var(--color-border)' }} />

                            {/* Animated Indicator */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 z-20"
                                style={{ left: `${percentage}%` }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.5 }}
                            >
                                <div className="relative">
                                    <div className="w-1.5 h-10 rounded-full shadow-lg -mt-5" style={{ background: 'var(--color-espresso)' }} />
                                    <div className="w-4 h-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md border-2" style={{ background: 'white', borderColor: 'var(--color-espresso)' }} />

                                    {/* Floating Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 whitespace-nowrap">
                                        <div className="px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border" style={{ background: 'white', borderColor: 'var(--color-border)' }}>
                                            <span className="font-display text-2xl" style={{ color: 'var(--color-espresso)' }}>${avgCost}</span>
                                            <div className={`w-2.5 h-2.5 rounded-full ${isExpensive ? 'animate-pulse' : ''}`} style={{ background: isExpensive ? 'var(--color-gold)' : 'var(--color-sage)' }} />
                                        </div>
                                        <div className="w-3 h-3 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b" style={{ background: 'white', borderColor: 'var(--color-border)' }} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Tick Marks */}
                        <div className="flex justify-between px-1 mt-8">
                            {[NICHE.priceRange.min, nationalAvg, NICHE.priceRange.max].map((val) => (
                                <div key={val} className="flex flex-col items-center">
                                    <div className="w-px h-3 mb-2" style={{ background: 'var(--color-border)' }} />
                                    <span className="font-body text-[10px] font-bold" style={{ color: 'var(--color-stone)' }}>${val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12 flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl border border-dashed"
                        style={{ background: 'rgba(255,255,255,0.3)', borderColor: 'var(--color-border)' }}
                    >
                        <div className="flex -space-x-3 shrink-0">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-bg)] flex items-center justify-center text-xl shadow-sm">
                                    ✨
                                </div>
                            ))}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-body text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--color-taupe)' }}>
                                Local Insight
                            </h4>
                            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--color-espresso)' }}>
                                {isExpensive
                                    ? `Prices in ${city} are approximately ${diff}% higher than the US average. We recommend comparing top-rated clinical artists to ensure you are receiving the highest level of care for this premium rate.`
                                    : `Outstanding local value detected. ${city} prices are ${diff}% lower than the national average, making it an ideal market for high-volume treatments without compromising on clinical quality.`
                                }
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-pill text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group/btn"
                                style={{ background: 'white', borderColor: 'var(--color-border)', color: 'var(--color-stone)' }}
                            >
                                <Info className="w-3.5 h-3.5" /> Data Methodology
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
