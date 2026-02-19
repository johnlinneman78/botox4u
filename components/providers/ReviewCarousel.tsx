'use client'

import React from 'react'
import Image from 'next/image'
import { Star, ChevronRight } from 'lucide-react'
import { Review } from '@/lib/types/enrichment'

interface ReviewCarouselProps {
    reviews: Review[]
    totalReviews: number
    googlePlaceId: string
    googleUrl?: string
}

function ReviewTile({ review }: { review: Review }) {
    const isGoogle = review.source === 'google'

    // Format Name: "Jane Doe" -> "Jane D."
    const formatName = (name: string) => {
        const parts = name.split(' ')
        if (parts.length > 1) {
            return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
        }
        return name
    }

    const displayName = formatName(review.author_name)

    const truncatedText = review.text.length > 140
        ? review.text.substring(0, 140) + '...'
        : review.text

    return (
        <div className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative scroll-snap-align-start flex flex-col justify-between h-auto min-h-[180px] group/tile">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    {review.profile_photo_url ? (
                        <Image
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-50 text-sm">
                            {review.author_name.charAt(0)}
                        </div>
                    )}
                    {/* Platform Icon Overlay */}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                        {isGoogle ? (
                            <svg viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.309 -26.754 51.239 C -26.754 53.169 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.424 44.599 -10.174 45.789 L -6.744 42.359 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                        ) : (
                            <span className="text-[10px] font-bold text-red-600 bg-white px-0.5">Y</span>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
                        {displayName}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        {review.relative_time_description}
                    </p>
                </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm text-gray-600 leading-relaxed font-normal flex-grow">
                "{truncatedText}"
            </p>
        </div>
    )
}

export function ReviewCarousel({ reviews, totalReviews, googlePlaceId }: ReviewCarouselProps) {
    if (!reviews || reviews.length === 0) return null

    const googleReviewLink = `https://search.google.com/local/reviews?placeid=${googlePlaceId}`

    return (
        <div className="w-full py-8">
            <div className="flex justify-between items-baseline mb-4 px-4 md:px-0">
                <h3 className="text-lg font-bold text-gray-900">
                    Patient Reviews
                </h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                    {totalReviews} verified ratings
                </span>
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel">
                <div className="flex overflow-x-auto pb-6 gap-4 px-4 md:px-0 scrollbar-hide snap-x scroll-padding-4 -mx-4 md:mx-0">
                    {reviews.map((review, idx) => (
                        <ReviewTile key={idx} review={review} />
                    ))}
                </div>

                {/* Navigation Arrows (Desktop Only) */}
                <div className="hidden md:block">
                    <button
                        onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: -340, behavior: 'smooth' })}
                        className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors z-20"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: 340, behavior: 'smooth' })}
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors z-20"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Footer Link */}
            <div className="mt-6 flex justify-center">
                <a
                    href={googleReviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-primary hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm group"
                >
                    <div className="w-5 h-5 flex-shrink-0">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                        </svg>
                    </div>
                    See All {totalReviews} Reviews on Google
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-400" />
                </a>
            </div>
        </div>
    )
}
