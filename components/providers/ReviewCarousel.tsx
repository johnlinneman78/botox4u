'use client'

import React from 'react'
import { Star, ChevronRight, ExternalLink } from 'lucide-react'

interface ReviewCarouselProps {
    reviews: any[]
    totalReviews: number
    googlePlaceId: string
    googleUrl?: string
}

export function ReviewCarousel({ totalReviews, googlePlaceId }: ReviewCarouselProps) {
    const googleReviewLink = `https://www.google.com/maps/search/?api=1&query=provider&query_place_id=${googlePlaceId}`

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

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Based on <span className="font-bold text-primary">{totalReviews} verified patient reviews</span> on Google. We prioritize clinics with consistent high ratings and positive patient outcomes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={googleReviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4285F4] text-white rounded-2xl text-md font-bold hover:bg-[#357ae8] transition-all shadow-lg shadow-blue-500/20 group"
                    >
                        <ExternalLink className="w-5 h-5" />
                        View All Reviews on Google
                    </a>
                </div>

                <p className="mt-8 text-xs text-gray-400 font-medium uppercase tracking-widest">
                    Google Places Data Verified • 2026 Standard
                </p>
            </div>
        </div>
    )
}
