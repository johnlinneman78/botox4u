'use client'

import { ShieldCheck, Sparkles, ArrowRight, Share2, Globe, Zap, Check, Dna, Clock } from 'lucide-react'
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
            navigator.clipboard.writeText(window.location.origin + `/provider/${provider.slug}`)
            setSharing(true)
            setTimeout(() => setSharing(false), 2000)
        }
    }

    return (
        <div className="bg-[#0d1420] min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* SUCCESS BANNER */}
                <div className="bg-[#101827] rounded-[4rem] shadow-2xl border border-white/[0.06] overflow-hidden text-center p-12 md:p-20 mb-12">
                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <ShieldCheck className="w-12 h-12 text-emerald-400" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[#d4af37] font-bold text-sm uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Profile Authenticated & Live</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">You're All Set!</h1>

                    <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-4">
                        Your practice profile for <strong className="text-white">{provider.name}</strong> is now live on the index. Your pricing transparency and credentials have been verified.
                    </p>
                    <p className="text-sm text-[#d4af37] font-semibold mb-12">
                        🎁 Your free beta access is active for 30 days — full analytics, leads, and visibility included.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link
                            href={`/provider/${provider.slug}`}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] px-10 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:scale-[1.02] transition-all"
                        >
                            <span>View Live Profile</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleShare}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.03] text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-white/[0.06] transition-all border border-white/[0.06]"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>{sharing ? 'Link Copied!' : 'Share Profile'}</span>
                        </button>
                    </div>

                    <div className="pt-12 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-bold text-gray-600 uppercase tracking-widest">
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

                {/* WHAT'S INCLUDED IN YOUR FREE 30 DAYS */}
                <div className="bg-[#101827] rounded-[3rem] border border-white/[0.06] p-12 md:p-16 mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-5 h-5 text-[#d4af37]" />
                        <h2 className="text-2xl font-display font-bold text-white">What's Included in Your Free 30 Days</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Full directory visibility',
                            'Patient lead notifications via SMS/email',
                            'Weekly profile analytics report',
                            'TrueScore™ updates as data refreshes',
                            'Clinical Quality badge on your profile',
                            'Click-to-call tracking',
                        ].map(f => (
                            <div key={f} className="flex items-center gap-3 p-3 rounded-xl">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                </div>
                                <span className="text-sm text-gray-400 font-medium">{f}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-600 font-light mt-6 pt-6 border-t border-white/[0.06]">
                        After 30 days, choose from Verified ($49/mo) or Featured ($99/mo) to keep your enhanced listing active. No auto-charge — we'll send a reminder before your trial ends.
                    </p>
                </div>

                {/* UPGRADE OPTIONS (POST-BETA) */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">When Your Trial Ends</h2>
                        <p className="text-gray-500 font-light">Choose the tier that best fits your practice. No commitment — cancel anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* FEATURED TIER — $99/mo */}
                        <div className="relative p-[1px] bg-gradient-to-br from-[#d4af37] via-[#d4af37]/50 to-[#101827] rounded-[3rem] shadow-2xl overflow-hidden group">
                            <div className="bg-[#101827] rounded-[3rem] p-10 h-full flex flex-col">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-black uppercase tracking-widest mb-6 self-start border border-[#d4af37]/20">
                                    <Dna className="w-3 h-3" />
                                    Most Popular
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Featured</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-[#d4af37]">$99</span>
                                    <span className="text-gray-500 font-light">/month</span>
                                </div>

                                <ul className="space-y-4 mb-12 flex-grow">
                                    {[
                                        'Top of search results for your city',
                                        '5x More Lead Traffic (Guaranteed)',
                                        'Click-to-Call Tracking & Recording',
                                        'Direct Landing Page Link',
                                        'Zero Commission on Leads'
                                    ].map(f => (
                                        <li key={f} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-[#d4af37]" />
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium leading-tight">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/claim/${provider.slug}/upgrade?tier=featured`}
                                    className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all text-center block"
                                >
                                    Upgrade to Featured
                                </Link>
                            </div>
                        </div>

                        {/* VERIFIED TIER — $49/mo */}
                        <div className="bg-[#101827] border border-white/[0.06] p-10 rounded-[3rem] shadow-xl flex flex-col">
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Verified</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-white">$49</span>
                                <span className="text-gray-500 font-light">/month</span>
                            </div>

                            <ul className="space-y-4 mb-12 flex-grow">
                                {[
                                    'Verified Professional Badge',
                                    'Highlighted Profile in Directory',
                                    'Monthly Analytics Report',
                                    'Remove Competitive Listings',
                                    'Advanced Bio & Gallery'
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium leading-tight">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/claim/${provider.slug}/upgrade?tier=verified`}
                                className="w-full bg-white/[0.05] hover:bg-white/[0.08] text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all text-center border border-white/[0.08] block"
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
