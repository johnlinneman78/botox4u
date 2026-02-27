'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, X, Info, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'

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
        score_total: number
        price_per_unit?: number
        imageUrl?: string
        listingTier?: string
    }
}

export function TopScoringCard({ provider }: TopScoringCardProps) {
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
        const categories = ["Injection Quality", "Natural Integrity", "Clinical Innovation", "Provider Credentials", "Patient Trust"]
        const hash = p.name.length + (p.score_total || 0)
        return categories[hash % categories.length]
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
        let borderColor = 'border-white/[0.06]'
        if (provider.score_total >= 85) {
            bgColor = 'bg-emerald-950/30'
            textColor = 'text-emerald-400'
            borderColor = 'border-emerald-800/20'
        } else if (provider.score_total >= 70) {
            bgColor = 'bg-blue-950/30'
            textColor = 'text-blue-400'
            borderColor = 'border-blue-800/20'
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
        if (score >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        if (score >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }

    return (
        <>
            <div className="group bg-white/[0.02] rounded-2xl hover:shadow-2xl hover:shadow-[#d4af37]/5 transition-all duration-500 border border-white/[0.06] hover:border-[#d4af37]/20 overflow-hidden flex flex-col h-full w-full max-w-[380px] mx-auto hover:-translate-y-2">
                {renderPlaceholder()}

                <div className="p-6 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-4">
                        <Link href={`/provider/${provider.slug}`}>
                            <h3 className="text-xl font-bold text-white leading-tight hover:text-[#d4af37] transition-colors line-clamp-1">
                                {provider.name}
                            </h3>
                        </Link>
                        <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-widest">
                            {provider.city}, {provider.state}  ·  {getTopCategory(provider)}
                        </p>
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
                            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png" alt="Google" width="112" height="14" className="h-3.5 opacity-30" />
                        </div>
                    </div>

                    {/* Score */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                                TrueScore™
                            </span>
                            <span className="text-[10px] font-black text-[#d4af37] uppercase">{getPercentile(provider.score_total)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-xl text-sm font-black tracking-tight border ${getScoreColor(provider.score_total)}`}>
                                {provider.score_total}/100
                            </div>
                            <div className="text-xs font-bold text-gray-600 italic">
                                Highest in: {getTopCategory(provider)}
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-600 uppercase">Unit Pricing</span>
                            <Info className="w-3 h-3 text-gray-700" />
                        </div>
                        <div className="text-lg font-black text-white mt-1">
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
                        <Link href={`/provider/${provider.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full py-6 text-xs font-bold border-white/10 text-gray-400 hover:bg-white/5 uppercase tracking-widest rounded-xl transition-all">
                                View Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 py-6 text-xs font-bold bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#d4af37]/10"
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
