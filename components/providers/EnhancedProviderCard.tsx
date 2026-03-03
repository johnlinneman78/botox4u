'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, X, ShieldCheck, Info, Dna, Sparkles, AlertTriangle, Search, Activity, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EnrichedProvider } from '@/lib/types/enrichment'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'
import { motion, Variants, AnimatePresence } from 'framer-motion'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

// Stagger variants for the card
export const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        }
    }
}

export function EnhancedProviderCard({ provider }: EnhancedProviderCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scanPhase, setScanPhase] = useState(0)

    const phases = [
        { icon: Search, label: 'Connecting to Registry...' },
        { icon: Activity, label: 'Running Outcomes Audit...' },
        { icon: Shield, label: 'Safety Verification...' },
        { icon: CheckCircle2, label: 'Scoring Complete' }
    ]

    const handleDemo = (e: React.MouseEvent) => {
        const isMock = provider.slug.includes('dr-') || provider.slug.includes('james-')
        if (isMock) {
            e.preventDefault()
            e.stopPropagation()
            if (isScanning) return

            setIsScanning(true)
            setScanPhase(0)

            const interval = setInterval(() => {
                setScanPhase(prev => {
                    if (prev >= phases.length - 1) {
                        clearInterval(interval)
                        setTimeout(() => setIsScanning(false), 1200)
                        return prev
                    }
                    return prev + 1
                })
            }, 750)
        }
    }

    const getPercentile = (score: number) => {
        if (score >= 95) return 'Top 2%'
        if (score >= 90) return 'Top 5%'
        if (score >= 80) return 'Top 10%'
        if (score >= 70) return 'Top 15%'
        if (score >= 60) return 'Top 25%'
        return 'Top Tier'
    }

    const renderPlaceholder = () => {
        const initials = provider.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 3)
            .toUpperCase()

        return (
            <div
                className="relative aspect-[4/3] w-full flex flex-col items-center justify-center border-b"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <span
                    className="text-4xl font-display font-black tracking-tighter absolute top-4 left-4 select-none opacity-5"
                    style={{ color: 'var(--color-espresso)' }}
                >
                    {provider.city.toUpperCase()}
                </span>
                <div
                    className="text-5xl font-display font-medium tracking-tighter"
                    style={{ color: 'var(--color-espresso)' }}
                >
                    {initials}
                </div>
                <div
                    className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                    style={{ color: 'var(--color-stone)' }}
                >
                    {provider.business_type || 'Verified Clinic'}
                </div>

                {provider.warning_flag && (
                    <div
                        className="absolute inset-x-0 top-0 text-[#3D2B1F] p-2 z-30 flex items-center justify-center gap-2 shadow-lg"
                        style={{ background: 'var(--color-espresso)' }}
                    >
                        <AlertTriangle className="w-4 h-4 text-[var(--color-gold)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Verify Before Booking</span>
                    </div>
                )}
            </div>
        )
    }

    const hasHighQuality = (provider.score?.breakdown?.injectionQuality || 0) >= 35;
    const hasInnovation = (provider.score?.breakdown?.innovation || 0) >= 15;

    return (
        <>
            <motion.div
                variants={cardItemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className="group relative bg-white rounded-2xl border hover:shadow-xl transition-all overflow-hidden flex flex-col h-full w-full"
                style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
                onClick={handleDemo}
            >
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[60] bg-[#FAF8F5]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="relative w-16 h-16 mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {React.createElement(phases[scanPhase].icon, {
                                        className: "w-6 h-6 text-[#C9A96E]"
                                    })}
                                </div>
                            </div>
                            <motion.p
                                key={scanPhase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-black uppercase tracking-[0.2em] text-[#3D2B1F]"
                            >
                                {phases[scanPhase].label}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
                {renderPlaceholder()}

                <div className="p-6 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                            <h3
                                className="text-xl font-display font-medium leading-tight group-hover:text-[var(--color-gold)] transition-colors line-clamp-2"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                {provider.name}
                            </h3>
                            <div className="flex flex-col gap-1 items-end shrink-0">
                                {hasHighQuality && (
                                    <div
                                        className="px-2 py-0.5 rounded-md flex items-center gap-1 border"
                                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight">Top Quality</span>
                                    </div>
                                )}
                                {hasInnovation && (
                                    <div
                                        className="px-2 py-0.5 rounded-md flex items-center gap-1 border"
                                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-sage)', color: 'var(--color-sage)' }}
                                    >
                                        <Dna className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight">Innovator</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p
                            className="text-[11px] font-body font-bold uppercase tracking-widest"
                            style={{ color: 'var(--color-stone)' }}
                        >
                            {provider.business_type}  ·  {provider.city}, {provider.state}
                        </p>
                    </div>

                    {/* Score & Range */}
                    <div className="mb-6 grid grid-cols-2 gap-3">
                        <div
                            className="p-4 rounded-xl border group/score relative"
                            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                                    style={{ color: 'var(--color-stone)' }}
                                >
                                    <ShieldCheck className="w-3 h-3" style={{ color: 'var(--color-gold)' }} />
                                    Clarity Score™
                                </span>
                                <div className="group/tooltip relative">
                                    <Info className="w-3 h-3 opacity-40 hover:opacity-100 cursor-help transition-all" />
                                    <div
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 border rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none"
                                        style={{ background: 'white', borderColor: 'var(--color-border)' }}
                                    >
                                        <p className="text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-espresso)' }}>Independent Data Pillars</p>
                                        <ul className="text-[9px] space-y-1 font-medium" style={{ color: 'var(--color-stone)' }}>
                                            <li>• Injection Quality (AI-Audit)</li>
                                            <li>• Provider Credentials (NPI)</li>
                                            <li>• Clinical Quality Data</li>
                                            <li>• Treatment Range (Breadth)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-display font-medium" style={{ color: 'var(--color-espresso)' }}>{provider.score_total || 50}</span>
                                <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--color-gold)' }}>{getPercentile(provider.score_total || 50)}</span>
                            </div>
                        </div>

                        <div
                            className="p-4 rounded-xl border"
                            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                                    style={{ color: 'var(--color-stone)' }}
                                >
                                    <Dna className="w-3 h-3" style={{ color: 'var(--color-sage)' }} />
                                    Range™
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="px-2 py-0.5 rounded text-[10px] font-bold tracking-tight border"
                                    style={{
                                        background: (provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'var(--color-surface)' : 'transparent',
                                        borderColor: (provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'var(--color-sage)' : 'var(--color-border)',
                                        color: (provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'var(--color-sage)' : 'var(--color-taupe)'
                                    }}
                                >
                                    {(provider.score?.breakdown?.treatmentRange || 0) >= 12 ? 'FULL' : (provider.score?.breakdown?.treatmentRange || 0) >= 8 ? 'HIGH' : 'STD'}
                                </div>
                                <span
                                    className="text-[9px] font-bold uppercase"
                                    style={{ color: (provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'var(--color-sage)' : 'var(--color-stone)' }}
                                >
                                    {(provider.score?.breakdown?.treatmentRange || 0) >= 12 ? 'Specialist' : 'Diverse'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-stone)' }}>Unit Pricing</span>
                            <Info className="w-3 h-3 opacity-20" />
                        </div>
                        <div className="text-lg font-display font-medium" style={{ color: 'var(--color-espresso)' }}>
                            {provider.price_per_unit
                                ? `${NICHE.priceCurrency}${provider.price_per_unit}/unit`
                                : `Estimated: $12–$16/unit (City Avg)`
                            }
                        </div>
                        {!provider.price_per_unit && (
                            <p className="text-[9px] mt-1 leading-tight tracking-tight" style={{ color: 'var(--color-taupe)' }}>
                                Based on aggregated local data. Claim listing to update.
                            </p>
                        )}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <div className="flex items-baseline gap-1.5 px-2 py-1.5 rounded-lg border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                            <Star className="w-3.5 h-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                            <span className="font-bold" style={{ color: 'var(--color-espresso)' }}>{provider.rating || '4.0'}</span>
                        </div>
                        <div className="ml-1">
                            <span className="text-[11px] font-medium" style={{ color: 'var(--color-stone)' }}>({provider.review_count || 0} reviews)</span>
                        </div>
                        <div className="ml-auto opacity-30">
                            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white2.png" alt="Google" width="104" height="13" className="h-3.5" />
                        </div>
                    </div>

                    <div className="mt-auto" />

                    <div className="flex items-center gap-3 relative z-30">
                        <div
                            onClick={handleDemo}
                            className="flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-[var(--color-border)] text-[var(--color-espresso)] hover:bg-[var(--color-surface)] transition-all text-center cursor-pointer"
                        >
                            View Data
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all h-[44px] shadow-sm hover:shadow-md"
                            style={{ background: 'var(--color-espresso)', color: 'white' }}
                        >
                            Request Quote
                        </button>
                    </div>
                </div>

                {!provider.slug.includes('dr-') && !provider.slug.includes('james-') && (
                    <Link
                        href={`/provider/${provider.slug}`}
                        className="absolute inset-0 z-10 focus:outline-none"
                        aria-label={`View details for ${provider.name}`}
                    />
                )}
            </motion.div>

            {/* Quote Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[var(--color-espresso)]/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-14 right-0 text-[#3D2B1F] hover:text-[var(--color-gold)] transition-colors font-bold flex items-center gap-2 uppercase tracking-widest text-xs"
                        >
                            Close <X className="w-8 h-8 border border-white/20 rounded-full p-2" />
                        </button>
                        <LeadForm
                            providerId={provider.id}
                            providerName={provider.name}
                            city={provider.city}
                            state={provider.state}
                            isPremium={provider.listingTier === 'premium'}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
