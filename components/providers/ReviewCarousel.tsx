'use client'

import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
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
        <div className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative scroll-snap-align-start flex flex-col justify-between h-auto min-h-[180px]">
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
            <div className="flex overflow-x-auto pb-6 gap-4 px-4 md:px-0 scrollbar-hide snap-x scroll-padding-4 -mx-4 md:mx-0 px-4 md:px-0">
                {reviews.map((review, idx) => (
                    <ReviewTile key={idx} review={review} />
                ))}
            </div>

            {/* Footer Link */}
            <div className="text-center mt-2">
                <a
                    href={googleReviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group"
                >
                    See all {totalReviews} reviews on Google
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
