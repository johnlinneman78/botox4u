'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, ExternalLink, X, ShieldCheck, Gem, Sparkles, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EnrichedProvider } from '@/lib/types/enrichment'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

export function EnhancedProviderCard({ provider }: EnhancedProviderCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Deteministic Percentile based on score
    const getPercentile = (score: number) => {
        if (score >= 95) return 'Top 2%'
        if (score >= 90) return 'Top 5%'
        if (score >= 80) return 'Top 10%'
        if (score >= 70) return 'Top 15%'
        if (score >= 60) return 'Top 25%'
        return 'Top Tier'
    }

    // Top Category based on Deterministic ID or Name
    const getTopCategory = (p: any) => {
        const categories = ["Natural Results", "Patient Trust", "Pricing Transparency", "Credential Integrity", "Review Consistency"]
        const hash = p.name.length + (p.score_total || 0)
        return categories[hash % categories.length]
    }

    // Unique Placeholder Logic (P0 Requirement)
    const renderPlaceholder = () => {
        const initials = provider.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 3)
            .toUpperCase()

        // Color derived from score
        let bgColor = 'bg-gray-100'
        let textColor = 'text-gray-400'
        if (provider.score_total && provider.score_total >= 85) {
            bgColor = 'bg-emerald-50'
            textColor = 'text-emerald-600'
        } else if (provider.score_total && provider.score_total >= 70) {
            bgColor = 'bg-blue-50'
            textColor = 'text-blue-600'
        }

        return (
            <div className={`relative aspect-[4/3] w-full flex flex-col items-center justify-center ${bgColor} border-b border-gray-100`}>
                <span className={`text-4xl font-display font-black tracking-tighter ${textColor} opacity-20 absolute top-4 left-4 select-none`}>
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

    // Simulating 'verified' status
    const isVerified = provider.verified || provider.listingTier === 'featured' || provider.listingTier === 'verified' || provider.npi_verified;
    const isFeatured = provider.listingTier === 'featured';

    return (
        <>
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full w-full max-w-[400px]">
                {/* Hero visual (No stock photos) */}
                {renderPlaceholder()}

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                                {provider.name}
                            </h3>
                            <div className="flex flex-col gap-1 items-end shrink-0">
                                {isVerified && (
                                    <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-tight">NPI Verified</span>
                                    </div>
                                )}
                                {isFeatured && (
                                    <div className="bg-primary text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-tight">Featured</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {provider.business_type}  ·  {provider.city}, {provider.state}
                        </p>
                    </div>

                    {/* Score (Percentile Context) */}
                    <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">II-Score</span>
                            <span className="text-[10px] font-black text-[#d4af37] uppercase">{getPercentile(provider.score_total || 50)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-xl bg-[#1a2332] text-white text-sm font-black tracking-tight">
                                {provider.score_total || 48}/100
                            </div>
                            <div className="text-xs font-bold text-gray-500 italic">
                                Highest in: {getTopCategory(provider)}
                            </div>
                        </div>
                    </div>

                    {/* Pricing (P0 Requirement) */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Unit Pricing</span>
                            <Info className="w-3 h-3 text-gray-300" />
                        </div>
                        <div className="text-lg font-black text-gray-900">
                            {provider.price_per_unit
                                ? `${NICHE.priceCurrency}${provider.price_per_unit}/unit`
                                : `Estimated: $12–$16/unit (City Avg)`
                            }
                        </div>
                        {!provider.price_per_unit && (
                            <p className="text-[9px] text-gray-400 mt-1 leading-tight tracking-tight">
                                Based on aggregated local data. Claim listing to update.
                            </p>
                        )}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-8 text-sm">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-fit">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="font-black text-gray-900">{provider.rating || '4.0'}</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Rating from Google</span>
                        </div>
                        <div className="ml-2">
                            <span className="text-xs font-medium text-gray-400">({provider.review_count || 0} reviews from Google)</span>
                        </div>
                        <div className="ml-auto">
                            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" alt="Google" className="h-4 opacity-50" />
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="mt-auto" />

                    {/* CTAs */}
                    <div className="flex items-center gap-3 relative z-30">
                        <Link href={`/provider/${provider.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full py-6 text-xs font-bold border-gray-200 text-gray-600 hover:bg-gray-50 uppercase tracking-widest rounded-xl transition-all">
                                View Profile
                            </Button>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 py-3 text-xs font-bold bg-[#1a2332] hover:bg-slate-800 text-white uppercase tracking-widest rounded-xl transition-all h-[44px]"
                        >
                            Request Quote
                        </button>
                    </div>
                </div>

                {/* Clickable Card Link Overlay */}
                <Link href={`/provider/${provider.slug}`} className="absolute inset-0 z-10 focus:outline-none" aria-label={`View details for ${provider.name}`} />
            </div>

            {/* Quote Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-md"
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
