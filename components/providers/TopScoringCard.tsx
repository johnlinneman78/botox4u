'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, X } from 'lucide-react'
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

    // Score Badge Color Logic
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-[#8FAF8F] text-white' // Green
        if (score >= 75) return 'bg-[#a8c5a8] text-white' // Sage
        return 'bg-[#cccccc] text-white' // Neutral
    }

    // Fallback images from Unsplash IDs provided in instructions
    const fallbackImages = [
        'photo-1519494026892', // modern spa interior
        'photo-1560750588-73207b1ef5b8', // clean spa reception
        'photo-1540555700478-4be289fbecef', // luxury spa
        'photo-1583195764036-af651510f1df'  // medspa interior
    ]

    const getHeroImage = () => {
        if (provider.imageUrl && !provider.imageUrl.includes('placeholder')) {
            return provider.imageUrl
        }
        // Consistent fallback based on ID hash
        const photoId = fallbackImages[provider.id.length % fallbackImages.length];
        return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`
    }

    return (
        <>
            <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full w-full max-w-[360px] mx-auto hover:-translate-y-1">
                {/* Clinic Photo - 16:9 Aspect Ratio */}
                <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    <Image
                        src={getHeroImage()}
                        alt={provider.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 340px"
                    />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-3">
                        <Link href={`/provider/${provider.slug}`}>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-secondary transition-colors line-clamp-1">
                                {provider.name}
                            </h3>
                        </Link>
                        <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">
                            {provider.business_type || 'Medical Spa'}  ·  {provider.city}, {provider.state}
                        </p>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 mb-5">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(provider.rating || 0) ? 'fill-[#d4af37] text-[#d4af37]' : 'fill-gray-200 text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900 ml-1">{provider.rating?.toFixed(1) || '4.0'}</span>
                        <span className="text-sm text-gray-400">({provider.review_count || 0} reviews)</span>
                    </div>

                    {/* Score & Pricing */}
                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-50">
                        <div className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${getScoreColor(provider.score_total)}`}>
                            Score: {provider.score_total}/100
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                            {provider.price_per_unit ? `${NICHE.priceCurrency}${provider.price_per_unit}/unit` : 'Pricing Pending'}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="mt-auto" />

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                        <Link href={`/provider/${provider.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full py-5 text-xs font-bold border-gray-200 text-gray-600 hover:bg-gray-50 uppercase tracking-widest whitespace-nowrap px-1">
                                View Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 py-5 text-xs font-bold bg-[#1a2332] hover:bg-slate-800 text-white uppercase tracking-widest whitespace-nowrap px-1"
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-secondary transition-colors font-bold flex items-center gap-2"
                        >
                            CLOSE <X className="w-6 h-6 border-2 border-white rounded-full p-1" />
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
