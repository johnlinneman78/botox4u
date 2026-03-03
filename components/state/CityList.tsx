'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { NICHE } from '@/config/niche'

interface CityData {
    city: string
    state: string
    count: number
}

interface CityListProps {
    cities: CityData[]
    stateName: string
}

export function CityList({ cities, stateName }: CityListProps) {
    return (
        <section className="py-24">
            <div className="container-content">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span
                            className="font-body text-[10px] font-bold uppercase tracking-[0.3em] block mb-4"
                            style={{ color: 'var(--color-sage)' }}
                        >
                            Regional Index
                        </span>
                        <h2
                            className="text-3xl md:text-5xl font-display font-light mb-6"
                            style={{ color: 'var(--color-espresso)', lineHeight: 1.1 }}
                        >
                            Browse by City in <span className="italic" style={{ color: 'var(--color-gold)' }}>{stateName}</span>
                        </h2>
                        <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Select your city to find local providers, compare pricing, and view treatment statistics specific to your area.
                        </p>
                    </div>
                    <div
                        className="font-body text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full border shrink-0"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-espresso)' }}
                    >
                        {cities.length} Cities Indexed
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cities.map((cityData, index) => {
                        return (
                            <motion.div
                                key={cityData.city}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/${NICHE.baseSlug}/${cityData.state.toLowerCase()}/${cityData.city.toLowerCase().replace(/ /g, '-')}`}
                                    className="group block h-full"
                                >
                                    <Card
                                        className="p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                                        style={{
                                            background: 'var(--color-surface)',
                                            borderColor: 'var(--color-border)',
                                            borderRadius: 'var(--radius-lg)'
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700"
                                            style={{ background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)', marginRight: '-30px', marginTop: '-30px' }}
                                        />

                                        <h3
                                            className="text-2xl font-display font-light mb-4 group-hover:text-[var(--color-gold)] transition-colors"
                                            style={{ color: 'var(--color-espresso)' }}
                                        >
                                            {cityData.city}
                                        </h3>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span
                                                className="font-body text-xs font-medium uppercase tracking-widest"
                                                style={{ color: 'var(--color-taupe)' }}
                                            >
                                                {cityData.count} {cityData.count === 1 ? 'Expert' : 'Experts'}
                                            </span>
                                            <span
                                                className="translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 font-body font-bold text-lg"
                                                style={{ color: 'var(--color-gold)' }}
                                            >
                                                →
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
