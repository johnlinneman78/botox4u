'use client'

import React from 'react'
import { track } from '@/lib/analytics'
import { Star, ChevronRight, ExternalLink } from 'lucide-react'
import { NICHE } from '@/config/niche'

interface ReviewCarouselProps {
    reviews?: any[]
    totalReviews?: number
    rating?: number
    googlePlaceId?: string
    googleUrl?: string
    providerId?: string
    bookingUrl?: string
}

export function ReviewCarousel({ reviews = [], totalReviews = 0, rating, googlePlaceId, providerId, bookingUrl }: ReviewCarouselProps) {
    const bookingTrackingUrl = `/api/track-click?provider_id=${providerId}&type=booking`

    return (
        <div className="w-full py-10 bg-gray-50/50 rounded-3xl border border-gray-100/50">
            <div className="max-w-xl mx-auto text-center px-6">
                {rating && rating > 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 mb-6">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-[#3D2B1F]">{rating.toFixed(1)} / 5.0 Rating</span>
                    </div>
                ) : null}

                <h3 className="text-3xl font-display font-black text-primary mb-4">
                    Patient Satisfaction
                </h3>

                <p className="text-lg text-[#3D2B1F]/60 mb-8 leading-relaxed">
                    {totalReviews > 0 ? (
                        <>Based on <span className="font-semibold text-primary">{totalReviews} public patient reviews</span> from clinic listings. Sentiment analysis prioritizes natural, conservative results.</>
                    ) : (
                        <>Patient satisfaction and directory metrics compiled from public clinic listings.</>
                    )}
                </p>

                <a
                    href={bookingTrackingUrl}
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#C9A96E] text-white rounded-2xl text-lg font-black tracking-widest uppercase hover:bg-[#B5955B] transition-all shadow-xl shadow-[#C9A96E]/20 group"
                    onClick={() => track('provider_outbound_click', { provider_id: providerId, source: 'reviews_section' })}
                >
                    Book a Consultation
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] text-[#3D2B1F]/70 font-black uppercase tracking-[0.2em]">
                    Independent Directory Data • 2026 Index
                </p>
            </div>
        </div>
    )
}
