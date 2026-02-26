'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, ExternalLink, X, ShieldCheck, Gem, Sparkles, AlertTriangle, Info, Dna } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EnrichedProvider } from '@/lib/types/enrichment'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

export function EnhancedProviderCard({ provider }: EnhancedProviderCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const getPercentile = (score: number) => {
        if (score >= 95) return 'Top 2%'
        if (score >= 90) return 'Top 5%'
        if (score >= 80) return 'Top 10%'
        if (score >= 70) return 'Top 15%'
        if (score >= 60) return 'Top 25%'
        return 'Top Tier'
    }

    const getTopCategory = (p: any) => {
        const breakdown = p.score?.breakdown
        if (!breakdown) return "Consumer Trust"

        const categories = [
            { id: 'injectionQuality', label: 'Injection Quality' },
            { id: 'innovation', label: 'Clinical Innovation' },
            { id: 'credentials', label: 'Provider Credentials' },
            { id: 'treatmentRange', label: 'Treatment Range' }
        ]

        const top = categories.reduce((prev, current) => {
            const currentVal = breakdown[current.id as keyof typeof breakdown] || 0
            const prevVal = breakdown[prev.id as keyof typeof breakdown] || 0
            return currentVal > prevVal ? current : prev
        }, categories[0])

        return top.label
    }

    const renderPlaceholder = () => {
        const initials = provider.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 3)
            .toUpperCase()

        let bgColor = 'bg-white/[0.03]'
        let textColor = 'text-gray-600'
        if (provider.score_total && provider.score_total >= 85) {
            bgColor = 'bg-emerald-950/30'
            textColor = 'text-emerald-400'
        } else if (provider.score_total && provider.score_total >= 70) {
            bgColor = 'bg-blue-950/30'
            textColor = 'text-blue-400'
        }

        return (
            <div className={`relative aspect-[4/3] w-full flex flex-col items-center justify-center ${bgColor} border-b border-white/[0.06]`}>
                <span className={`text-4xl font-display font-black tracking-tighter ${textColor} opacity-10 absolute top-4 left-4 select-none`}>
                    {provider.city.toUpperCase()}
                </span>
                <div className={`text-5xl font-display font-black tracking-tighter ${textColor}`}>
                    {initials}
                </div>
                <div className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${textColor} opacity-60`}>
                    {provider.business_type || 'Verified Clinic'}
                </div>

                {provider.warning_flag && (
                    <div className="absolute inset-x-0 top-0 bg-red-600 text-white p-2 z-30 flex items-center justify-center gap-2 shadow-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">⚠️ Verify Before Booking</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const isVerified = provider.verified || provider.listingTier === 'featured' || provider.listingTier === 'verified' || provider.npi_verified;
    const isFeatured = provider.listingTier === 'featured';
    const hasHighQuality = (provider.score?.breakdown?.injectionQuality || 0) >= 35;
    const hasInnovation = (provider.score?.breakdown?.innovation || 0) >= 15;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        if (score >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        return 'bg-white/10 text-gray-400 border-white/10'
    }

    return (
        <>
            <div className="group relative bg-white/[0.02] rounded-2xl hover:shadow-2xl hover:shadow-[#d4af37]/5 transition-all duration-500 border border-white/[0.06] hover:border-[#d4af37]/20 overflow-hidden flex flex-col h-full w-full max-w-[400px]">
                {renderPlaceholder()}

                <div className="p-6 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-[#d4af37] transition-colors line-clamp-2">
                                {provider.name}
                            </h3>
                            <div className="flex flex-col gap-1 items-end shrink-0">
                                {hasHighQuality && (
                                    <div className="bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#d4af37]/20">
                                        <Sparkles className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-tight">Top Quality</span>
                                    </div>
                                )}
                                {hasInnovation && (
                                    <div className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-500/20">
                                        <Dna className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-tight">Innovator</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            {provider.business_type}  ·  {provider.city}, {provider.state}
                        </p>
                    </div>

                    {/* Score & Regen Ratio */}
                    <div className="mb-6 grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] group/score relative">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                                    TrueScore™
                                </span>
                                <div className="group/tooltip relative">
                                    <Info className="w-3 h-3 text-gray-700 hover:text-[#d4af37] cursor-help transition-colors" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#0d1420] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none">
                                        <p className="text-[10px] text-white font-bold mb-1 uppercase tracking-wider">Independent Data Pillars</p>
                                        <ul className="text-[9px] text-gray-400 space-y-1 font-medium">
                                            <li>• Injection Quality (AI-Audit)</li>
                                            <li>• Provider Credentials (NPI)</li>
                                            <li>• Innovation (Regen Adoption)</li>
                                            <li>• Treatment Range (Breadth)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-white">{provider.score_total || 50}</span>
                                <span className="text-[9px] font-black text-[#d4af37] uppercase">{getPercentile(provider.score_total || 50)}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                                    <Dna className="w-3 h-3 text-emerald-400" />
                                    Range™
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`px-2 py-1 rounded-lg text-xs font-black tracking-tight border ${(provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-gray-400 border-white/10'}`}>
                                    {(provider.score?.breakdown?.treatmentRange || 0) >= 12 ? 'FULL' : (provider.score?.breakdown?.treatmentRange || 0) >= 8 ? 'HIGH' : 'STD'}
                                </div>
                                <span className={`text-[9px] font-black uppercase ${(provider.score?.breakdown?.treatmentRange || 0) >= 10 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                    {(provider.score?.breakdown?.treatmentRange || 0) >= 12 ? 'Specialist' : 'Diverse'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-gray-600 uppercase">Unit Pricing</span>
                            <Info className="w-3 h-3 text-gray-700" />
                        </div>
                        <div className="text-lg font-black text-white">
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

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1.5 rounded-lg border border-white/10 w-fit">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="font-black text-white">{provider.rating || '4.0'}</span>
                            </div>
                            <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">Rating from Google</span>
                        </div>
                        <div className="ml-2">
                            <span className="text-xs font-medium text-gray-600">({provider.review_count || 0} reviews)</span>
                        </div>
                        <div className="ml-auto">
                            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png" alt="Google" className="h-3.5 opacity-30" />
                        </div>
                    </div>

                    <div className="mt-auto" />

                    {/* CTAs */}
                    <div className="flex items-center gap-3 relative z-30">
                        <Link href={`/provider/${provider.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full py-6 text-xs font-bold border-white/10 text-gray-400 hover:bg-white/5 uppercase tracking-widest rounded-xl transition-all">
                                View Profile
                            </Button>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 py-3 text-xs font-bold bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] uppercase tracking-widest rounded-xl transition-all h-[44px] shadow-lg shadow-[#d4af37]/10"
                        >
                            Request Quote
                        </button>
                    </div>
                </div>

                <Link href={`/provider/${provider.slug}`} className="absolute inset-0 z-10 focus:outline-none" aria-label={`View details for ${provider.name}`} />
            </div>

            {/* Quote Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#0d1420]/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-14 right-0 text-white hover:text-[#d4af37] transition-colors font-bold flex items-center gap-2 uppercase tracking-widest text-xs"
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
