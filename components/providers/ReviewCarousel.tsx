'use client'

import React from 'react'
import { track } from '@/lib/analytics'
import { Star, ChevronRight, ExternalLink } from 'lucide-react'
import { NICHE } from '@/config/niche'

interface ReviewCarouselProps {
    reviews: any[]
    totalReviews: number
    googlePlaceId: string
    googleUrl?: string
    providerId?: string
    bookingUrl?: string
}

export function ReviewCarousel({ reviews, totalReviews, googlePlaceId, providerId, bookingUrl }: ReviewCarouselProps) {
    const bookingTrackingUrl = `/api/track-click?provider_id=${providerId}&type=booking`

    return (
        <div className="w-full py-10 bg-gray-50/50 rounded-3xl border border-gray-100/50">
            <div className="max-w-xl mx-auto text-center px-6">
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 mb-6">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>

                <h3 className="text-3xl font-display font-black text-primary mb-4">
                    Patient Satisfaction
                </h3>

                <p className="text-lg text-[#3D2B1F]/50 mb-8 leading-relaxed">
                    Based on <span className="font-bold text-primary">{totalReviews} verified patient reviews</span>. We use sentiment analysis to prioritize injectors known for <span className="text-secondary font-bold italic">natural, conservative results</span>.
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
