'use client'

import { ShieldCheck, Sparkles, ArrowRight, Share2, Globe, Zap, Check } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { track, providerParams } from '@/lib/analytics'

export function SuccessView({ provider }: { provider: any }) {
    const [sharing, setSharing] = useState(false)

    // Conversion event (Oct 2026): this page only renders after a
    // claim is submitted, so mounting is the submission signal.
    // Guarded by sessionStorage (Nov 2026) so a refresh or revisit
    // of the success URL does not re-fire the event.
    useEffect(() => {
        const key = `claim_submitted:${provider?.slug ?? 'unknown'}`
        if (typeof window !== 'undefined' && !window.sessionStorage.getItem(key)) {
            window.sessionStorage.setItem(key, '1')
            track('claim_submitted', providerParams({ slug: provider?.slug, name: provider?.name, city: provider?.city, state: provider?.state }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${provider.name} on Verified Aesthetics`,
                    url: window.location.origin + `/provider/${provider.slug}`
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(window.location.origin + `/provider/${provider.slug}`)
            setSharing(true)
            setTimeout(() => setSharing(false), 2000)
        }
    }

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* SUCCESS BANNER */}
                <div className="bg-[#F2EDE4] rounded-[4rem] shadow-2xl border border-[#3D2B1F]/10 overflow-hidden text-center p-12 md:p-20 mb-12">
                    <div className="w-24 h-24 bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <ShieldCheck className="w-12 h-12 text-[#8A9E8D]" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[#C9A96E] font-bold text-sm uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Received — In Review</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold text-[#3D2B1F] mb-6">You're All Set!</h1>

                    <p className="text-xl text-[#3D2B1F]/70 font-light leading-relaxed max-w-2xl mx-auto mb-4">
                        Your claim for <strong className="text-[#3D2B1F]">{provider.name}</strong> has been received. We check every claim against public records before anything on the listing changes — that review is what keeps the index honest. Nothing is marked verified until the review is complete.
                    </p>
                    <p className="text-sm text-[#C9A96E] font-semibold mb-12">
                        Watch your inbox — we'll email you the review outcome and your next steps.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link
                            href={`/provider/${provider.slug}`}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#B5955B] text-white px-10 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:shadow-[#C9A96E]/20 hover:scale-[1.02] transition-all"
                        >
                            <span>View Live Profile</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleShare}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3D2B1F]/5 text-[#3D2B1F] px-10 py-5 rounded-3xl font-bold text-lg hover:bg-[#3D2B1F]/5 transition-all border border-[#3D2B1F]/10"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>{sharing ? 'Link Copied!' : 'Share Profile'}</span>
                        </button>
                    </div>

                    <div className="pt-12 border-t border-[#3D2B1F]/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-bold text-[#3D2B1F]/50 uppercase tracking-widest">
                        <div className="flex items-center justify-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Claim Logged</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Manual Review Next</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>Decision by Email</span>
                        </div>
                    </div>
                </div>

                {/* WHAT'S INCLUDED IN YOUR FREE CLAIMED LISTING */}
                <div className="bg-[#F2EDE4] rounded-[3rem] border border-[#3D2B1F]/10 p-12 md:p-16 mb-12">
                    <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-8">What&apos;s Included in Your Free Claimed Listing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Full directory visibility',
                            'Update your practice details after review',
                            'Clarity Score\u2122 updates as data refreshes',
                        ].map(f => (
                            <div key={f} className="flex items-center gap-3 p-3 rounded-xl">
                                <div className="w-5 h-5 rounded-full bg-[#8A9E8D]/10 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-[#8A9E8D]" />
                                </div>
                                <span className="text-sm text-[#3D2B1F]/70 font-medium">{f}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-[#3D2B1F]/70 font-medium mt-6 pt-6 border-t border-[#3D2B1F]/10">
                        Claiming is free. No paid tier is offered here. Payment never changes your ranking or Clarity Score, and credential verification is never sold.
                    </p>
                </div>
            </div>
        </div>
    )
}
