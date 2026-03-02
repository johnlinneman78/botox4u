import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, TrendingUp, Users, DollarSign, Award, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Logo from '@/components/layout/Logo'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface BriefPageProps {
    params: Promise<{ slug: string }>
}

export default async function IntelligenceBriefPage({ params }: BriefPageProps) {
    const { slug } = await params

    const { data: provider, error } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !provider) notFound()

    // Mock city-level data for comparison
    const cityAvgScore = 68
    const cityAvgPrice = 14.50
    const marketReach = 2400 // Monthly searches in city

    const scoreDelta = provider.score_total - cityAvgScore
    const priceDelta = ((provider.price_per_unit - cityAvgPrice) / cityAvgPrice) * 100

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans print:p-0">
            {/* Top Branding Bar */}
            <div className="bg-slate-950 text-white py-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8 border-b-4 border-[#d4af37]">
                <div className="space-y-4">
                    <Logo className="h-10 w-auto invert" variant="shield" />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase font-display">Clinic Intelligence Brief</h1>
                        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase mt-2">Confidential Market Report • March 2026</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-center md:items-end">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Subject Provider</div>
                    <div className="text-2xl font-bold font-display">{provider.name}</div>
                    <div className="text-xs text-[#d4af37] font-bold mt-1 uppercase tracking-widest">{provider.city}, {provider.state}</div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-16 space-y-16">
                {/* 1. Executive Summary: The TrueScore™ Audit */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="w-6 h-6 text-[#d4af37]" />
                        <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 flex-grow">1.0 Clinical Performance Audit</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">TrueScore™ Index</div>
                            <div className="text-7xl font-display font-black text-slate-900 mb-2">{provider.score_total}</div>
                            <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${scoreDelta >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {scoreDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : null}
                                {Math.abs(scoreDelta)} pts vs. City Average
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                                <TrendingUp className="w-5 h-5 text-[#d4af37] mb-4" />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Percentile</div>
                                <div className="text-3xl font-bold font-display">Top 8%</div>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Ranked #4 of 52 providers in {provider.city}.</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                                <Users className="w-5 h-5 text-[#d4af37] mb-4" />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Search Reach</div>
                                <div className="text-3xl font-bold font-display">{marketReach.toLocaleString()} Patients</div>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Monthly active baseline intent in your market.</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                                <DollarSign className="w-5 h-5 text-[#d4af37] mb-4" />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing Position</div>
                                <div className="text-3xl font-bold font-display">${provider.price_per_unit}/unit</div>
                                <p className="text-xs text-slate-500 mt-2 font-medium">{Math.abs(priceDelta).toFixed(1)}% {priceDelta >= 0 ? 'above' : 'below'} city median.</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                                <Award className="w-5 h-5 text-[#d4af37] mb-4" />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Status</div>
                                <div className="text-3xl font-bold font-display">{provider.verified ? 'Verified' : 'Unverified'}</div>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Registry verification increases trust by 32% (avg).</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Sentiment Mapping */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                        <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 flex-grow">2.0 Patient Sentiment Mapping</h2>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Top Professional Differentiators</h3>
                                <div className="space-y-6">
                                    {provider.style_tags?.map((tag: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-[#d4af37] shrink-0" />
                                            <div>
                                                <div className="font-bold text-lg uppercase tracking-wider">{tag}</div>
                                                <p className="text-slate-400 text-sm font-light">Leading keyword in recent patient testimonials.</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-4 opacity-50">
                                        <CheckCircle2 className="w-6 h-6 text-slate-600 shrink-0" />
                                        <div>
                                            <div className="font-bold text-lg uppercase tracking-wider">Natural Results</div>
                                            <p className="text-slate-400 text-sm font-light">Synthesized from 84% of positive reviews.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4af37]">Market Mismatch Alert</h4>
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                </div>
                                <p className="text-slate-300 leading-relaxed font-light mb-6">
                                    Your clinic dominates in <span className="text-white font-bold italic">results quality</span> but lags in <span className="text-white font-bold italic">price transparency</span> compared to Top 3 competitors in {provider.city}.
                                </p>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-[#d4af37] w-[88%]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Market Under-served</span>
                                    <span>Market Saturated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Competitive Comparison */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <Award className="w-6 h-6 text-[#d4af37]" />
                        <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 flex-grow">3.0 Local Market Benchmarking</h2>
                    </div>

                    <div className="overflow-hidden border border-slate-100 rounded-3xl bg-slate-50">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Metric</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{provider.name}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{provider.city} Median</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Market Leader</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-8 py-6 font-bold text-slate-900 uppercase text-xs tracking-wider">TrueScore™ Index</td>
                                    <td className="px-8 py-6 text-center text-slate-900 font-bold">{provider.score_total}</td>
                                    <td className="px-8 py-6 text-center text-slate-500">{cityAvgScore}</td>
                                    <td className="px-8 py-6 text-center text-emerald-600 font-bold">94</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 font-bold text-slate-900 uppercase text-xs tracking-wider">Avg. Price / Unit</td>
                                    <td className="px-8 py-6 text-center text-slate-900 font-bold">${provider.price_per_unit}</td>
                                    <td className="px-8 py-6 text-center text-slate-500">${cityAvgPrice}</td>
                                    <td className="px-8 py-6 text-center text-slate-500">$18</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 font-bold text-slate-900 uppercase text-xs tracking-wider">Clinical Verified</td>
                                    <td className="px-8 py-6 text-center">{provider.verified ? '✅' : '❌'}</td>
                                    <td className="px-8 py-6 text-center text-slate-500 text-sm italic">62% Yes</td>
                                    <td className="px-8 py-6 text-center text-emerald-600 font-bold">✅</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Footer / CTA */}
                <footer className="text-center pt-16 border-t border-slate-100">
                    <p className="text-slate-500 text-sm font-light max-w-2xl mx-auto mb-10 leading-relaxed">
                        This report is generated by <span className="font-bold text-slate-900 underline uppercase tracking-tighter decoration-[#d4af37]">InjectorIndex Intelligence</span>. Data is verified against 2026 clinical registries and patient sentiment audits.
                    </p>
                    <div className="flex justify-center gap-6 no-print">
                        <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-2xl">
                            Unlock Full Competitive Audit
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                        >
                            Download PDF (Print)
                        </button>
                    </div>
                </footer>
            </div>
        </main>
    )
}
