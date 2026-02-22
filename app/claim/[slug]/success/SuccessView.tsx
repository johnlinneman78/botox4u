'use client'

import { ShieldCheck, Sparkles, ArrowRight, Share2, Globe, Zap, Award, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function SuccessView({ provider }: { provider: any }) {
    const [sharing, setSharing] = useState(false)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${provider.name} on Injector Index`,
                    url: window.location.origin + `/provider/${provider.slug}`
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.origin + `/provider/${provider.slug}`)
            setSharing(true)
            setTimeout(() => setSharing(false), 2000)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* SUCCESS BANNER */}
                <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden text-center p-12 md:p-20 mb-12">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <ShieldCheck className="w-12 h-12 text-green-500" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Profile Authenticated & Live</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold text-primary mb-6">You're All Set!</h1>

                    <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto mb-12">
                        Your practice profile for <strong>{provider.name}</strong> is now live on the index. Your pricing transparency and credentials have been verified.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link
                            href={`/provider/${provider.slug}`}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-10 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
                        >
                            <span>View Live Profile</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleShare}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-50 text-primary px-10 py-5 rounded-3xl font-bold text-lg hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>{sharing ? 'Link Copied!' : 'Share Profile'}</span>
                        </button>
                    </div>

                    <div className="pt-12 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center justify-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Published to CDN</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>NPI Database Sync Complete</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>SMS Alerts Enabled</span>
                        </div>
                    </div>
                </div>

                {/* UPSELL SECTION */}
                <div className="space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-primary mb-4">Boost Your Visibility</h2>
                        <p className="text-gray-500 font-light">Join the top 5% of providers who receive 90% of the patient leads.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* FEATURED UPSELL */}
                        <div className="relative p-1 bg-gradient-to-br from-secondary via-secondary/50 to-primary rounded-[3rem] shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Zap className="w-12 h-12 text-white opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                            <div className="bg-white rounded-[2.9rem] p-10 h-full flex flex-col">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-6">
                                    Most Popular
                                </div>
                                <h3 className="text-3xl font-black text-primary mb-2 tracking-tight">Featured</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-primary">$199</span>
                                    <span className="text-gray-400 font-light">/month</span>
                                </div>

                                <ul className="space-y-4 mb-12 flex-grow">
                                    {[
                                        "Top of search results for your city",
                                        "5x More Lead Traffic (Guaranteed)",
                                        "Click-to-Call Tracking & Recording",
                                        "Direct Landing Page Link",
                                        "Zero Commission on Leads"
                                    ].map(f => (
                                        <li key={f} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-secondary" />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium leading-tight">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/claim/${provider.slug}/upgrade?tier=featured`}
                                    className="w-full bg-secondary text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all text-center"
                                >
                                    Boost My Practice
                                </Link>
                            </div>
                        </div>

                        {/* VERIFIED UPSELL */}
                        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-xl flex flex-col">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <ShieldCheck className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-3xl font-black text-primary mb-2 tracking-tight">Verified</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-primary">$49</span>
                                <span className="text-gray-400 font-light">/month</span>
                            </div>

                            <ul className="space-y-4 mb-12 flex-grow">
                                {[
                                    "Verified Professional Badge",
                                    "Highlighted Profile in Directory",
                                    "Monthly Analytics Report",
                                    "Remove Competitive Listings",
                                    "Advanced Bio & Gallery"
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium leading-tight">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/claim/${provider.slug}/upgrade?tier=verified`}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all text-center"
                            >
                                Get Verified Badge
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
