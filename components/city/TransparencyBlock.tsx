'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Eye, Lock, Quote } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export function TransparencyBlock({ city }: { city?: string }) {
    return (
        <section className="py-24">
            <div className="container-content">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[48px] p-10 md:p-20 border relative overflow-hidden"
                    style={{
                        background: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    {/* Artistic Background Accents */}
                    <div
                        className="absolute top-0 right-0 w-96 h-96 opacity-[0.05] blur-[100px] pointer-events-none"
                        style={{ background: 'var(--color-gold)', marginRight: '-10%', marginTop: '-10%' }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.05] blur-[100px] pointer-events-none"
                        style={{ background: 'var(--color-sage)', marginLeft: '-10%', marginBottom: '-10%' }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="h-12 w-auto flex items-center">
                                    <Logo variant="shield" className="h-full opacity-80" />
                                </div>
                                <div className="h-8 w-px" style={{ background: 'var(--color-border)' }} />
                                <div
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase"
                                    style={{
                                        background: 'var(--color-bg)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-gold)'
                                    }}
                                >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Transparency First
                                </div>
                            </div>

                            <h2
                                className="text-4xl md:text-6xl font-display font-light mb-10 leading-[1.05]"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                Natural Results. <br />
                                <span className="italic" style={{ color: 'var(--color-gold)' }}>Transparent Prices.</span>
                            </h2>

                            <p className="font-body text-xl leading-relaxed mb-12" style={{ color: 'var(--color-stone)' }}>
                                40% of patients fear looking &quot;overdone&quot; or &quot;frozen.&quot; We built {NICHE.siteName} to help you find the injectors who prioritize conservative, natural results — while showing you exactly what they charge before you walk in.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div
                                    className="flex items-center gap-4 p-6 rounded-2xl border"
                                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--color-sage-rgb), 0.1)', color: 'var(--color-sage)' }}>
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <span className="font-body font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--color-espresso)' }}>Market Prices Audited</span>
                                </div>
                                <div
                                    className="flex items-center gap-4 p-6 rounded-2xl border"
                                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--color-gold-rgb), 0.1)', color: 'var(--color-gold)' }}>
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <span className="font-body font-bold text-xs uppercase tracking-widest" style={{ color: 'var(--color-espresso)' }}>Verified Credentials</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-12 md:p-16 rounded-[40px] relative border"
                            style={{
                                background: 'var(--color-bg)',
                                borderColor: 'var(--color-border)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <Quote
                                className="absolute top-8 left-8 w-12 h-12 opacity-[0.05]"
                                style={{ color: 'var(--color-gold)' }}
                            />
                            <blockquote
                                className="relative text-2xl md:text-3xl font-display font-light leading-snug italic"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                &quot;Patients weren&apos;t just looking for the cheapest injector. They were looking for someone they could trust not to overdo it. So I built this score to reward natural results first.&quot;
                            </blockquote>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xl">
                                    👨‍⚕️
                                </div>
                                <div>
                                    <div className="font-body font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-espresso)' }}>The VerifiedAesthetics Editorial Board</div>
                                    <div className="font-body text-xs" style={{ color: 'var(--color-stone)' }}>Clinical Data Compliance Team</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
