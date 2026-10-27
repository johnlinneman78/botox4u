'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Star, User, ArrowRight, Search, Activity, Shield, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { EnrichedProvider } from '@/lib/types/enrichment'
import { track, providerParams } from '@/lib/analytics'
import { LeadForm } from './LeadForm'
import { formatCurrency } from '@/lib/utils'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

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

    const isPremium = provider.listing_tier === 'premium' || provider.listingTier === 'premium'

    const phases = [
        { icon: Search, label: 'Loading directory information...' },
        { icon: Activity, label: 'Retrieving listing details...' },
        { icon: Shield, label: 'Preparing profile view...' },
        { icon: CheckCircle2, label: 'Information Ready' }
    ]

    const handleDemo = (e: React.MouseEvent) => {
        const isMock = provider.slug?.includes('dr-') || provider.slug?.includes('james-')
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

    // Lead Practitioner logic
    const leadPractitioner = provider.practitioners && provider.practitioners.length > 0
        ? provider.practitioners[0]
        : null;

    let enumerationYear = 0;
    if (leadPractitioner?.npi_enumeration_date) {
        enumerationYear = new Date(leadPractitioner.npi_enumeration_date).getFullYear();
    }

    const score = provider.score_total ?? provider.score?.points ?? null;

    // Treatments mock logic based on enriched_attrs
    const treatments = [];
    if (provider.enriched_attrs?.price_per_unit_botox || provider.price_per_unit || provider.pricePerUnit) treatments.push('Botox');
    if (provider.enriched_attrs?.price_per_unit_dysport) treatments.push('Dysport');
    if (provider.enriched_attrs?.offers_lip_flip) treatments.push('Lip Filler');
    if (treatments.length === 0) treatments.push('Aesthetics', 'Injectables');

    const ctaText = leadPractitioner
        ? `${leadPractitioner.name} — ${provider.city}, ${provider.state}`
        : `${provider.name} — ${provider.city}, ${provider.state}`;

    return (
        <>
            <motion.div
                variants={cardItemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className={`group relative w-full rounded-2xl border transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col cursor-pointer ${isPremium ? 'border-[#C9A96E]/30 bg-white ring-1 ring-[#C9A96E]/20 shadow-lg' : 'bg-white border-[#3D2B1F]/10'}`}
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

                <div className="p-6 md:p-8 flex flex-col flex-1">
                    {/* Row 1: Business identity + score */}
                    <div className="flex justify-between items-start mb-6 border-b border-[#3D2B1F]/10 pb-6">
                        <div>
                            <h3 className="text-[20px] font-display font-medium text-[#3D2B1F] leading-tight mb-1 group-hover:text-[#C9A96E] transition-colors">
                                {provider.name}
                            </h3>
                            <p className="font-sans text-[12px] text-[#A89B8C]">
                                {provider.business_type || 'Aesthetic Clinic'} · {provider.city}, {provider.state}
                            </p>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex flex-col items-center">
                                <span className="text-[20px] font-display font-bold text-[#3D2B1F] leading-none mb-0.5">{score === null ? '—' : `${Math.round(score)}/100`}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96E] flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Clarity
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Lead practitioner credentials */}
                    <div className="mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3D2B1F]/40 mb-3">Lead Practitioner</p>

                        {leadPractitioner ? (
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/10 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-[#3D2B1F]/40" />
                                </div>
                                <div>
                                    <h4 className="font-sans font-medium text-[15px] text-[#3D2B1F] mb-0.5">
                                        {leadPractitioner.name}{leadPractitioner.credentials ? `, ${leadPractitioner.credentials}` : ''}
                                    </h4>
                                    <div className="flex items-center gap-1.5 font-sans text-[13px] text-[#A89B8C] mb-1">
                                        <span>{leadPractitioner.taxonomy || 'Aesthetics'}</span>
                                        {leadPractitioner.is_npi_verified && (
                                            <>
                                                <span className="opacity-50">·</span>
                                                <span className="text-[#8A9E8D] font-medium flex items-center gap-1">
                                                    NPI Registry Matched <CheckCircle className="w-3.5 h-3.5" />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {enumerationYear > 0 && (
                                        <p className="font-sans text-[13px] text-[#A89B8C] italic">
                                            NPI Enumeration: {enumerationYear}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/5 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-[#3D2B1F]/20" />
                                </div>
                                <div className="flex items-center h-10">
                                    <p className="font-sans text-[13px] text-[#A89B8C] italic">Credentials pending verification</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Row 3: Treatment tags */}
                    <div className="mb-6 border-t border-[#3D2B1F]/10 pt-6">
                        <div className="flex flex-wrap gap-2">
                            {treatments.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-[#F2EDE4] text-[#3D2B1F] text-[12px] font-sans rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto" />

                    {/* Row 4: Rating + pricing */}
                    <div className="flex items-center justify-between mb-6">
                        {(provider.rating || provider.averageRating) ? (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[var(--color-gold)] text-[14px]">
                                    {'★'.repeat(Math.round(provider.rating || provider.averageRating || 0))}
                                </span>
                                <span className="font-sans font-bold text-[14px] text-[#3D2B1F]">
                                    {(provider.rating || provider.averageRating || 0).toFixed(1)}
                                </span>
                                {(provider.review_count || provider.reviewCount) ? (
                                    <span className="font-sans text-[13px] text-[#A89B8C] ml-1">
                                        ({provider.review_count || provider.reviewCount} reviews)
                                    </span>
                                ) : null}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span className="font-sans text-[12px] text-[#A89B8C] italic">
                                    Reviews being indexed
                                </span>
                            </div>
                        )}

                        {(provider.price_per_unit || provider.pricePerUnit) && (
                            <div className="font-sans font-medium text-[14px] text-[#3D2B1F]">
                                From {formatCurrency(provider.price_per_unit || provider.pricePerUnit || 0)}/unit
                            </div>
                        )}
                    </div>

                    {/* Row 5: CTA */}
                    <div className="border-t border-[#3D2B1F]/10 pt-4 mt-2 flex flex-col gap-3">
                        <Link href={`/provider/${provider.slug}`} className="flex justify-between items-center group/cta w-full" onClick={() => track('provider_profile_click', { ...providerParams({ slug: provider.slug, name: provider.name, city: provider.city, state: provider.state, score: score }), source: 'provider_card' })}>
                            <span className="font-sans font-medium text-[14px] text-[#3D2B1F]">
                                {ctaText}
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#3D2B1F] opacity-40 group-hover/cta:opacity-100 group-hover/cta:translate-x-1 transition-all" />
                        </Link>

                        {/* Request quote button specific to Enhanced variant */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsModalOpen(true)
                            }}
                            className="w-full py-3 mt-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm hover:shadow-md bg-[#3D2B1F] text-white z-20 relative"
                        >
                            Request Quote
                        </button>
                    </div>
                </div>

                {!provider.slug?.includes('dr-') && !provider.slug?.includes('james-') && (
                    <Link
                        href={`/provider/${provider.slug}`}
                        className="absolute inset-0 z-10 focus:outline-none"
                        aria-label={`View details for ${provider.name}`}
                        onClick={() => track('provider_profile_click', { ...providerParams({ slug: provider.slug, name: provider.name, city: provider.city, state: provider.state, score: score }), source: 'provider_card' })}
                    />
                )}
            </motion.div>

            {/* Quote Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#3D2B1F]/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-14 right-0 text-white hover:text-[var(--color-gold)] transition-colors font-bold flex items-center gap-2 uppercase tracking-widest text-xs"
                        >
                            Close <X className="w-8 h-8 border border-white/20 rounded-full p-2" />
                        </button>
                        <LeadForm
                            providerId={provider.id!}
                            providerName={provider.name!}
                            city={provider.city!}
                            state={provider.state!}
                            isPremium={isPremium}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
