import React from 'react'
import { Check, X, Shield, Star, DollarSign, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function CompetitiveComparison() {
    const features = [
        {
            name: 'Ranking Logic',
            others: 'Highest Bidder (Paid)',
            ours: 'TrueScore™ Quality Data',
            status: true
        },
        {
            name: 'Review Authenticity',
            others: 'Unverified / Filtered',
            ours: 'Verified & Sentiment Analyzed',
            status: true
        },
        {
            name: 'Pricing Transparency',
            others: 'Hidden / Phone Call Only',
            ours: 'Real-time Community Data',
            status: true
        },
        {
            name: 'Incentives',
            others: 'Sells Ads to Providers',
            ours: 'Built for Patient Outcomes',
            status: true
        },
        {
            name: 'Credentials Check',
            others: 'Provider Claims Only',
            ours: 'NPI & Registry Verified',
            status: true
        }
    ]

    return (
        <section className="py-24 bg-[#080e17] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 blur-[160px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Why Patients Trust <span className="text-[#d4af37]">InjectorIndex</span>
                    </h2>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                        Traditional directories are built to help clinics sell. We're built to help you find the best clinical results.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <Card className="overflow-hidden border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-gray-500 bg-white/[0.01]">Feature</th>
                                        <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-gray-400 text-center bg-white/[0.01]">Generic Directories</th>
                                        <th className="px-8 py-6 text-sm font-bold uppercase tracking-widest text-[#d4af37] text-center bg-[#d4af37]/5">
                                            <div className="flex items-center justify-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                InjectorIndex
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {features.map((feature, idx) => (
                                        <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="px-8 py-5 text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                                {feature.name}
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-600 text-center italic">
                                                <div className="flex items-center justify-center gap-2">
                                                    <X className="w-4 h-4 text-red-500/50" />
                                                    {feature.others}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-white text-center bg-[#d4af37]/[0.02]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    {feature.ours}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Pure Data</h4>
                            <p className="text-gray-500 text-sm font-light">
                                Our TrueScore™ algorithm analyzes 10+ clinical data points. Rankings cannot be bought.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Real Pricing</h4>
                            <p className="text-gray-500 text-sm font-light">
                                No more "call for pricing." We aggregate real patient invoices to give you the truth.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Star className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">True Sentiment</h4>
                            <p className="text-gray-500 text-sm font-light">
                                We use NLP to filter bot-reviews and find what patients actually say about results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
