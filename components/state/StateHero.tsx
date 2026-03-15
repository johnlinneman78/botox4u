'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StateHeroProps {
    stateName: string
    providerCount: number
    avgCost: number
    cityCount: number
}

export function StateHero({ stateName, providerCount, avgCost, cityCount }: StateHeroProps) {
    return (
        <section
            className="relative pt-32 pb-24 overflow-hidden border-b"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
        >
            {/* Subtle Texture/Orbs */}
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-surface) 0%, transparent 70%)' }}
            />

            <div className="container-content relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <span
                            className="font-body text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 border rounded-full"
                            style={{ color: 'var(--color-sage)', borderColor: 'var(--color-sage)' }}
                        >
                            State Directory
                        </span>
                        <span className="h-px w-8 bg-current opacity-20" style={{ color: 'var(--color-stone)' }} />
                        <span
                            className="font-body text-[10px] font-medium uppercase tracking-[0.2em]"
                            style={{ color: 'var(--color-taupe)' }}
                        >
                            VerifiedAesthetics Audited
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-light mb-10 leading-[1.05]"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        Best Botox Providers in <br />
                        <span className="italic" style={{ color: 'var(--color-gold)' }}>{stateName}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl font-body mb-16 max-w-2xl leading-relaxed"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        Discover top-rated injectors and clinics across {stateName}. We&apos;ve analyzed {providerCount} providers in {cityCount} cities to help you find the best treatment at the right price.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-12"
                    >
                        <div className="space-y-2">
                            <div className="font-display text-4xl font-light" style={{ color: 'var(--color-espresso)' }}>
                                <span className="text-2xl align-top mr-1" style={{ color: 'var(--color-gold)' }}>$</span>
                                {avgCost}
                            </div>
                            <div className="font-body text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Avg. Cost / Unit</div>
                        </div>

                        <div className="w-px h-12 hidden sm:block" style={{ background: 'var(--color-border)' }} />

                        <div className="space-y-2">
                            <div className="font-display text-4xl font-light" style={{ color: 'var(--color-espresso)' }}>{providerCount}</div>
                            <div className="font-body text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Verified Clinics</div>
                        </div>

                        <div className="w-px h-12 hidden sm:block" style={{ background: 'var(--color-border)' }} />

                        <div className="space-y-2">
                            <div className="font-display text-4xl font-light" style={{ color: 'var(--color-espresso)' }}>{cityCount}</div>
                            <div className="font-body text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Cities Indexed</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
