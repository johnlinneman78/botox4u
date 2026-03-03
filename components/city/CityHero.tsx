'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NICHE } from '@/config/niche'

interface CityHeroProps {
    city: string
    state: string
    treatmentName: string
    providerCount: number
}

export function CityHero({ city, state, treatmentName, providerCount }: CityHeroProps) {
    return (
        <section
            className="relative pt-32 pb-24 overflow-hidden border-b"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
        >
            {/* Subtle Gradient/Texture */}
            <div
                className="absolute inset-0 opacity-[0.4] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }}
            />

            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] opacity-40 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ background: 'var(--color-surface)' }}
            />

            <div className="container-content relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
                        style={{
                            background: 'var(--color-bg)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-sage)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em]">
                            {city}, {state} Regional Guide
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-display font-light mb-8 leading-[1.05]"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        Verified {treatmentName} <br />
                        Providers in <span className="italic" style={{ color: 'var(--color-gold)' }}>{city}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl font-body max-w-2xl mx-auto mb-12 leading-relaxed"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        Compare {providerCount} medical professionals, view real {NICHE.priceUnit} pricing, and check verified credentials. Ranked by clinical data, not advertising fees.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-6 mb-20"
                    >
                        <Button
                            className="h-16 px-10 rounded-pill font-body font-bold text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-100"
                            style={{
                                background: 'var(--color-espresso)',
                                color: 'var(--color-linen)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Find Local Experts <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-16 px-10 rounded-pill font-body font-bold text-sm tracking-widest uppercase transition-all"
                            style={{
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-espresso)',
                                background: 'transparent'
                            }}
                            onClick={() => document.getElementById('price-meter')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Market Price Index
                        </Button>
                    </motion.div>

                    {/* Trust Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-8 rounded-3xl border"
                        style={{
                            background: 'var(--color-surface)',
                            borderColor: 'var(--color-border)',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <div className="text-center md:text-left md:border-r border-[var(--color-border)] px-4 py-2">
                            <div className="text-3xl font-display font-light mb-1" style={{ color: 'var(--color-espresso)' }}>{providerCount}</div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-taupe)' }}>Verified Clinics</div>
                        </div>
                        <div className="text-center md:text-left md:border-r border-[var(--color-border)] px-4 py-2">
                            <div className="text-3xl font-display font-light mb-1" style={{ color: 'var(--color-gold)' }}>
                                <span className="text-xl align-top mr-0.5">$</span>{NICHE.priceRange.min}-{NICHE.priceRange.max}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-taupe)' }}>Price Range</div>
                        </div>
                        <div className="text-center md:text-left md:border-r border-[var(--color-border)] px-4 py-2">
                            <div className="text-3xl font-display font-light mb-1" style={{ color: 'var(--color-espresso)' }}>4.8<span className="text-lg opacity-40 ml-1">/5</span></div>
                            <div className="flex flex-col gap-1 items-center md:items-start">
                                <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-taupe)' }}>Avg Rating</div>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png"
                                    alt="Powered by Google"
                                    width="64"
                                    className="opacity-40"
                                />
                            </div>
                        </div>
                        <div className="text-center md:text-left px-4 py-2 flex flex-col justify-center">
                            <div className="flex items-center justify-center md:justify-start gap-1 font-body font-bold text-[11px] mb-1" style={{ color: 'var(--color-success)' }}>
                                <ShieldCheck className="w-4 h-4" /> CLINICAL AUDIT
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-taupe)' }}>Medical Integrity</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
