'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, CheckCircle, ExternalLink, X } from 'lucide-react'
import { EnrichedProvider } from '@/lib/types/enrichment'
import { LeadForm } from './LeadForm'
import { NICHE } from '@/config/niche'

interface EnhancedProviderCardProps {
    provider: EnrichedProvider
}

export function EnhancedProviderCard({ provider }: EnhancedProviderCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // trust the mapped imageUrl from the action
    const heroImage = provider.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'

    // Simulating 'verified' status based on existing data or tier
    const isVerified = provider.listing_tier === 'premium' || provider.listing_tier === 'featured';

    return (
        <>
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

                    {/* Botox-4U Score Badge */}
                    {provider.score && (
                        <div className="absolute bottom-3 left-3 bg-primary text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 group/score transition-all">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80 leading-none mb-0.5">{NICHE.name}-4U Score</span>
                                <span className="text-xl font-display font-black leading-none">{provider.score.total}</span>
                            </div>
                            <div className="w-[1px] h-6 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-70">Grade</span>
                                <span className="text-xs font-black">
                                    {provider.score.total >= 90 ? 'A+' : provider.score.total >= 80 ? 'A' : provider.score.total >= 70 ? 'B' : 'C'}
                                </span>
                            </div>
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
                                <span className="text-gray-400 text-[10px]">({provider.review_count} on Google)</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">No ratings</span>
                        )}

                        <div className="flex items-center gap-1 text-gray-500 truncate max-w-[140px]" title={`${provider.city || 'Local Area'}, ${provider.state || ''}`}>
                            <span className="truncate">{provider.city || 'Local Area'}{provider.state ? `, ${provider.state}` : ''}</span>
                        </div>
                    </div>

                    {/* Aggregate Review Summary (ToS Compliant) */}
                    <div className="mb-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between group/reviews">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < Math.floor(provider.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-gray-900">{provider.rating} {NICHE.googleAttribution.ratingText}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{provider.review_count} Patient Reviews</span>
                            <div className="mt-2">
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                                    alt="Powered by Google"
                                    className="h-4 opacity-70"
                                />
                            </div>
                        </div>
                        <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.name + ' ' + provider.city)}&query_place_id=${provider.google_place_id}`}
                            target="_blank"
                            className="bg-white p-2 rounded-full border border-gray-200 text-gray-400 group-hover/reviews:text-secondary group-hover/reviews:border-secondary/20 transition-all shadow-sm"
                            title="View reviews on Google"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Pricing Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                        {provider.price_per_unit ? (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100/50">
                                {NICHE.name} {NICHE.priceCurrency}{provider.price_per_unit}/{NICHE.priceUnit.split(' ').slice(-1)}
                            </span>
                        ) : (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100/50">
                                {NICHE.name} {NICHE.priceCurrency}{NICHE.priceRange.min + 4}/{NICHE.priceUnit.split(' ').slice(-1)} est.
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
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-2 relative z-20">
                        <Link
                            href={`/provider/${provider.slug}`}
                            className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all group/btn"
                        >
                            View Gallery
                            <ExternalLink className="ml-1.5 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform opacity-60" />
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center px-3 py-2 bg-[#1a2332] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm shadow-primary/20 tracking-wide"
                        >
                            REQUEST QUOTE
                        </button>
                    </div>
                </div>

                {/* Clickable Card Link Overlay */}
                <Link href={`/provider/${provider.slug}`} className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl" aria-label={`View details for ${provider.name}`} />
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
