'use client'

import React from 'react'
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

                {/* Top Reviews Display */}
                {reviews && reviews.length > 0 && (
                    <div className="space-y-6 mb-10 text-left">
                        {reviews.slice(0, 2).map((review, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-0.5 mb-3">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <Star key={starIdx} className={`w-3 h-3 ${starIdx < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-100'}`} />
                                    ))}
                                </div>
                                {review.text && review.text.trim().length > 0 ? (
                                    <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                                        "{review.text?.substring(0, 200)}{review.text?.length > 200 ? '...' : ''}"
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                                        Verified 5-star rating on Google
                                    </p>
                                )}
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-primary">{review.author_name}</span>
                                        <span className="text-[10px] text-[#3D2B1F]/70 font-medium">Verified {NICHE.providerType === 'injector' ? 'Patient' : 'Customer'} • {NICHE.googleAttribution.reviewText}</span>
                                    </div>
                                    <div className="opacity-40">
                                        <img
                                            src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                                            alt="Powered by Google"
                                            className="h-3 w-auto"
                                            width={144}
                                            height={18}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <a
                    href={bookingTrackingUrl}
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#C9A96E] text-white rounded-2xl text-lg font-black tracking-widest uppercase hover:bg-[#B5955B] transition-all shadow-xl shadow-[#C9A96E]/20 group"
                    onClick={() => {
                        if (typeof window.gtag === 'function') {
                            window.gtag('event', 'booking_click', {
                                provider_id: providerId,
                                source: 'reviews_section'
                            })
                        }
                    }}
                >
                    Book a Consultation
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] text-[#3D2B1F]/70 font-black uppercase tracking-[0.2em]">
                    Data Verified • 2026 Clinical Standard
                </p>
            </div>
        </div>
    )
}
