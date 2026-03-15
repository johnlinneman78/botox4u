import React from 'react'
import { Check, X, Shield, Zap, Star, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const competitors = ['RealSelf', 'Yelp', 'ZocDoc', 'VerifiedAesthetics'] as const

const features = [
    {
        label: 'Independent rankings',
        realself: { value: 'Pay-to-play', pass: false },
        yelp: { value: 'Ads above results', pass: false },
        zocdoc: { value: 'Insurance-first', pass: false },
        verifiedaesthetics: { value: 'No paid placement', pass: true },
    },
    {
        label: 'Aesthetic-specific',
        realself: { value: 'Broad', pass: true },
        yelp: { value: 'Generic', pass: false },
        zocdoc: { value: 'General healthcare', pass: false },
        verifiedaesthetics: { value: '100% medical aesthetics', pass: true },
    },
    {
        label: 'AI-ready data',
        realself: { value: 'No structured data', pass: false },
        yelp: { value: 'No API', pass: false },
        zocdoc: { value: 'Outdated tech', pass: false },
        verifiedaesthetics: { value: 'JSON-LD + API + MCP', pass: true },
    },
    {
        label: 'Semantic insights',
        realself: { value: 'Star ratings only', pass: false },
        yelp: { value: 'Star ratings only', pass: false },
        zocdoc: { value: 'No reviews', pass: false },
        verifiedaesthetics: { value: 'NLP review analysis', pass: true },
    },
    {
        label: 'Provider cost',
        realself: { value: '$$$ Premium listings', pass: false },
        yelp: { value: '$$$ Ad spend', pass: false },
        zocdoc: { value: '$$$ Per booking', pass: false },
        verifiedaesthetics: { value: 'Free tier + affordable pro', pass: true },
    },
]

export default function CompetitiveComparison() {
    return (
        <section className="py-24 bg-[#080e17] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A96E]/5 blur-[160px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6">
                        Not Another Directory.<br />
                        <span className="text-[#C9A96E]">A Smarter Way to Choose.</span>
                    </h2>
                    <p className="text-[#3D2B1F]/70 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                        You&apos;ve seen the other sites. RealSelf shows you whoever pays for placement. Yelp buries the best providers behind ads. Google Maps gives you star ratings with zero context. VerifiedAesthetics is different.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <Card className="overflow-hidden border-[#3D2B1F]/10 bg-[#3D2B1F]/5 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#3D2B1F]/10">
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60 bg-white/[0.01] w-[200px]">What You Need</th>
                                        <th className="px-4 py-5 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60 text-center bg-white/[0.01]">RealSelf</th>
                                        <th className="px-4 py-5 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60 text-center bg-white/[0.01]">Yelp</th>
                                        <th className="px-4 py-5 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60 text-center bg-white/[0.01]">ZocDoc</th>
                                        <th className="px-4 py-5 text-xs font-bold uppercase tracking-widest text-[#C9A96E] text-center bg-[#C9A96E]/5">
                                            <div className="flex items-center justify-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                VerifiedAesthetics
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {features.map((feature, idx) => (
                                        <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-[#3D2B1F] group-hover:text-[#C9A96E] transition-colors">
                                                {feature.label}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {feature.realself.pass
                                                        ? <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                        : <X className="w-3.5 h-3.5 text-red-500/50 shrink-0" />
                                                    }
                                                    <span className={`text-xs ${feature.realself.pass ? 'text-[#3D2B1F]/70' : 'text-[#3D2B1F]/50 italic'}`}>
                                                        {feature.realself.value}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <X className="w-3.5 h-3.5 text-red-500/50 shrink-0" />
                                                    <span className="text-xs text-[#3D2B1F]/50 italic">{feature.yelp.value}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <X className="w-3.5 h-3.5 text-red-500/50 shrink-0" />
                                                    <span className="text-xs text-[#3D2B1F]/50 italic">{feature.zocdoc.value}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center bg-[#C9A96E]/[0.02]">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-[#8A9E8D] shrink-0" />
                                                    <span className="text-xs font-bold text-[#3D2B1F]">{feature.verifiedaesthetics.value}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Bottom line quote */}
                    <div className="mt-12 p-8 bg-gradient-to-r from-[#C9A96E]/10 to-transparent rounded-[2rem] border border-[#C9A96E]/15">
                        <p className="text-lg text-[#3D2B1F] font-bold mb-2">The bottom line:</p>
                        <p className="text-[#3D2B1F]/70 leading-relaxed">
                            RealSelf is a marketplace. Yelp is an ad platform. ZocDoc is for insurance-based healthcare.
                            <span className="text-[#3D2B1F] font-semibold"> VerifiedAesthetics is an independent data platform</span> built specifically for medical aesthetics — optimized for how patients actually discover providers in 2026: through AI recommendations backed by structured, trustworthy data.
                        </p>
                        <p className="text-[#C9A96E] text-sm font-bold mt-4 italic">
                            We&apos;re not competing with Google. We&apos;re the source Google&apos;s AI cites.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
