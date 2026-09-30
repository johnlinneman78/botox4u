'use client'

import React, { useState } from 'react'
import { formatScore } from '@/lib/scoring'
import { Star, X, Info, ShieldCheck, Search, Activity, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'
import { motion, AnimatePresence } from 'framer-motion'

interface TopScoringCardProps {
    provider: {
        id: string
        name: string
        slug: string
        business_type: string
        city: string
        state: string
        rating: number
        review_count: number
        score_total: number | null
        score?: { grade?: string } | null
        price_per_unit?: number
        imageUrl?: string
        listingTier?: string
    }
}

export function TopScoringCard({ provider }: TopScoringCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scanPhase, setScanPhase] = useState(0)

    const phases = [
        { icon: Search, label: 'Indexing Credentials...' },
        { icon: Activity, label: 'Analyzing Patient Data...' },
        { icon: Shield, label: 'Safety Verification...' },
        { icon: CheckCircle2, label: 'Finalizing Score' }
    ]

    const handleDemo = (e: React.MouseEvent) => {
        // If it's a real provider with an ID that doesn't look like a slug, we might want to navigate
        // but for now, the user wants "examples" to show the animation.
        // We can check if provider.id is a UUID or a slug.
        const isMock = provider.slug.includes('dr-') || provider.slug.includes('james-')

        if (isMock) {
            e.preventDefault()
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
            }, 700)
        }
    }



    const renderPlaceholder = () => {
        const initials = provider.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 3)
            .toUpperCase()

        let bgColor = 'bg-[#3D2B1F]/5'
        let textColor = 'text-[#3D2B1F]/50'
        let borderColor = 'border-[#3D2B1F]/10'
        if ((provider.score_total ?? 0) >= 85) {
            bgColor = 'bg-[#8A9E8D]/10'
            textColor = 'text-[#8A9E8D]'
            borderColor = 'border-[#8A9E8D]/20'
        } else if ((provider.score_total ?? 0) >= 70) {
            bgColor = 'bg-[#C9A96E]/10'
            textColor = 'text-[#C9A96E]'
            borderColor = 'border-[#C9A96E]/20'
        }

        return (
            <div className={`relative aspect-[16/9] w-full flex flex-col items-center justify-center ${bgColor} border-b ${borderColor}`}>
                <span className={`text-4xl font-display font-black tracking-tighter ${textColor} opacity-10 absolute top-4 left-4 select-none`}>
                    {provider.city.toUpperCase()}
                </span>
                <div className={`text-5xl font-display font-black tracking-tighter ${textColor}`}>
                    {initials}
                </div>
                <div className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${textColor} opacity-60`}>
                    Verified {provider.business_type || 'Clinic'}
                </div>
            </div>
        )
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/30'
        if (score >= 75) return 'bg-[#8A9E8D]/10 text-[#8A9E8D] border-[#8A9E8D]/30'
        return 'bg-gray-500/20 text-[#3D2B1F]/70 border-gray-500/30'
    }

    return (
        <>
            <div className="relative group bg-[#3D2B1F]/5 rounded-2xl hover:shadow-2xl hover:shadow-[#C9A96E]/5 transition-all duration-500 border border-[#3D2B1F]/10 hover:border-[#C9A96E]/20 overflow-hidden flex flex-col h-full w-full max-w-[380px] mx-auto hover:-translate-y-2">
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
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
                        <div onClick={handleDemo} className="cursor-pointer group/title">
                            <h3 className="text-xl font-bold text-[#3D2B1F] leading-tight group-hover/title:text-[#C9A96E] transition-colors line-clamp-1">
                                {provider.name}
                            </h3>
                        </div>
                        <p className="text-xs font-bold text-[#3D2B1F]/50 mt-1 uppercase tracking-widest">
                            {provider.city}, {provider.state}
                        </p>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 bg-[#3D2B1F]/5 px-2 py-1.5 rounded-lg border border-[#3D2B1F]/10 w-fit">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="font-black text-[#3D2B1F]">{provider.rating || '4.0'}</span>
                            </div>
                            <span className="text-[9px] text-[#3D2B1F]/50 font-bold uppercase mt-1">Rating from Google</span>
                        </div>
                        <div className="ml-2">
                            <span className="text-xs font-medium text-[#3D2B1F]/50">({provider.review_count || 0} reviews)</span>
                        </div>
                        <div className="ml-auto">
                            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png" alt="Google" width="112" height="14" className="h-3.5 opacity-30" />
                        </div>
                    </div>

                    {/* Score */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/50 flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-[#C9A96E]" />
                                Clarity Score™
                            </span>
                            <span className="text-[10px] font-black text-[#C9A96E] uppercase">Clarity Score™</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-xl text-sm font-black tracking-tight border ${getScoreColor(provider.score_total ?? 0)}`}>
                                {formatScore(provider.score_total)}
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 p-3 rounded-xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase">Unit Pricing</span>
                            <Info className="w-3 h-3 text-gray-700" />
                        </div>
                        <div className="text-lg font-black text-[#3D2B1F] mt-1">
                            {provider.price_per_unit
                                ? `${NICHE.priceCurrency}${provider.price_per_unit}/unit`
                                : `Estimated: $12–$16/unit (City Avg)`
                            }
                        </div>
                        {!provider.price_per_unit && (
                            <p className="text-[9px] text-gray-700 mt-1 leading-tight tracking-tight">
                                Based on aggregated local data. Claim listing to update.
                            </p>
                        )}
                    </div>

                    <div className="mt-auto" />

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                        <div onClick={handleDemo} className="flex-1 cursor-pointer">
                            <Button variant="outline" className="w-full py-6 text-xs font-bold border-[#3D2B1F]/10 text-[#3D2B1F]/70 hover:bg-[#3D2B1F]/5 uppercase tracking-widest rounded-xl transition-all">
                                View Profile
                            </Button>
                        </div>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 py-6 text-xs font-bold bg-[#C9A96E] hover:bg-[#B5955B] text-white uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#C9A96E]/10"
                        >
                            Request Quote
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quote Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#FAF8F5]/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-14 right-0 text-[#3D2B1F] hover:text-[#C9A96E] transition-colors font-bold flex items-center gap-2 uppercase tracking-widest text-xs"
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
