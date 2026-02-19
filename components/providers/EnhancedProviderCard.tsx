'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react'
import { EnrichedProvider } from '@/lib/types/enrichment'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

export function EnhancedProviderCard({ provider }: EnhancedProviderCardProps) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    // Auto-rotate reviews every 5s
    useEffect(() => {
        if (!provider.top_reviews || provider.top_reviews.length <= 1) return

        const interval = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % provider.top_reviews.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [provider.top_reviews])

    // Fallback Image handling with robust placeholder detection
    const heroImage = (provider.imageUrl && !provider.imageUrl.includes('placeholder') && provider.imageUrl.length > 5)
        ? provider.imageUrl
        : (provider.hero_image_url && !provider.hero_image_url.includes('placeholder'))
            ? provider.hero_image_url
            : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'

    // Simulating 'verified' status based on existing data or tier
    const isVerified = provider.listing_tier === 'premium' || provider.listing_tier === 'featured';

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full w-full max-w-[400px]">
            {/* Hero Image Section */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                    src={heroImage}
                    alt={provider.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay Badge - Only if verified data exists */}
                {provider.badges && provider.badges.length > 0 && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-900 tracking-wide uppercase">
                            {provider.badges[0]}
                        </span>
                    </div>
                )}

                {provider.badges && provider.badges.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-[10px] font-medium">
                        +{provider.badges.length - 1}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-3">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                            {provider.name}
                        </h3>
                        {isVerified && (
                            <div className="mt-1 flex-shrink-0" title="Verified Provider">
                                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        {provider.business_type}
                    </p>
                </div>

                {/* Rating & Location */}
                <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
                    {provider.rating ? (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100/50">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-900">{provider.rating}</span>
                            <span className="text-gray-400 text-xs">({provider.review_count})</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">No ratings</span>
                    )}

                    <div className="flex items-center gap-1 text-gray-500 truncate max-w-[140px]" title={`${provider.city}, ${provider.state}`}>
                        <span className="truncate">{provider.city}, {provider.state}</span>
                    </div>
                </div>

                {/* Rotating Review Quote */}
                {provider.top_reviews && provider.top_reviews.length > 0 && (
                    <div className="mb-4 relative h-14 overflow-hidden">
                        {provider.top_reviews.map((review, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${idx === currentReviewIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                            >
                                <figure className="border-l-2 border-primary/20 pl-3">
                                    <blockquote className="text-xs text-gray-600 italic line-clamp-2">
                                        "{review.text}"
                                    </blockquote>
                                </figure>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pricing Tags */}
                <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                    {provider.price_per_unit ? (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100/50">
                            Botox ${provider.price_per_unit}/u
                        </span>
                    ) : (
                        <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">
                            Request pricing
                        </span>
                    )}
                </div>

                {/* AI Description */}
                {provider.ai_description && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {provider.ai_description}
                        </p>
                        {!provider.ai_description_confirmed && (
                            <div className="mt-1 flex items-center gap-1 opacity-60">
                                <span className="text-[9px] uppercase tracking-wider text-gray-400 border border-gray-200 px-1 rounded bg-gray-50">
                                    AI Summary
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Spacer */}
                <div className="mt-auto" />

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-2">
                    <Link
                        href={`/provider/${provider.slug}`}
                        className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all group/btn"
                    >
                        View Gallery
                        <ExternalLink className="ml-1.5 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform opacity-60" />
                    </Link>
                    <Link
                        href={`/provider/${provider.slug}#book`}
                        className="flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 tracking-wide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        REQUEST QUOTE
                    </Link>
                </div>
            </div>

            {/* Clickable Card Link Overlay */}
            <Link href={`/provider/${provider.slug}`} className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl" aria-label={`View details for ${provider.name}`} />
        </div>
    )
}
