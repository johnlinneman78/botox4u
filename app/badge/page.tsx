import { ShieldCheck, Download, Code, CheckCircle, Info, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Provider Verification Badge Assets | Injector Index',
    description: 'Access official "Verified by Injector Index" badge assets for your clinic website. Available to top-scoring aesthetic providers.',
}

export default function BadgePage() {
    return (
        <div className="bg-[#0d1420] min-h-screen pb-24">
            {/* Hero Section */}
            <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#1a2332]" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center bg-secondary/20 border border-secondary/30 text-secondary px-6 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-10 backdrop-blur-md">
                        <Award className="w-4 h-4 mr-2" />
                        Verification Assets
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-10 tracking-tight leading-[1.05]">
                        The Badge of <br /><span className="text-secondary italic">Independent Trust</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Top-scoring providers on Injector Index are eligible to display the "Verified" badge on their website to signal natural results, fair pricing, and transparency.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content: The Assets */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. The Badge Preview */}
                        <Card className="rounded-[2.5rem] border border-white/[0.06] shadow-2xl overflow-hidden bg-[#101827]">
                            <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] p-8">
                                <CardTitle className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                    <ShieldCheck className="w-7 h-7 text-secondary" />
                                    Official Badge Assets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 md:p-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center mb-16">
                                    {/* Large */}
                                    <div className="text-center group">
                                        <div className="w-48 h-48 mb-6 flex items-center justify-center bg-[#0d1420] rounded-3xl border border-white/[0.06] shadow-xl group-hover:scale-105 transition-transform duration-500">
                                            <BadgeLogo size={160} />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Large (200px)</div>
                                    </div>
                                    {/* Medium */}
                                    <div className="text-center group">
                                        <div className="w-32 h-32 mb-6 flex items-center justify-center bg-[#0d1420] rounded-2xl border border-white/[0.06] shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <BadgeLogo size={100} />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Medium (120px)</div>
                                    </div>
                                    {/* Small */}
                                    <div className="text-center group">
                                        <div className="w-24 h-24 mb-6 flex items-center justify-center bg-[#0d1420] rounded-xl border border-white/[0.06] shadow-md group-hover:scale-105 transition-transform duration-500">
                                            <BadgeLogo size={60} />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Small (80px)</div>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-3xl p-8 text-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Code className="w-5 h-5 text-secondary" />
                                            Embed Snippet
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Recommended for Footer / About</span>
                                    </div>
                                    <pre className="bg-black/40 p-6 rounded-2xl text-xs font-mono overflow-x-auto text-gray-300 border border-white/5 whitespace-pre-wrap leading-relaxed">
                                        {`<!-- Injector Index Verified Badge -->
<a href="https://www.injectorindex.com" target="_blank" rel="noopener">
  <img 
    src="https://www.injectorindex.com/badges/verified-badge-gold.svg" 
    alt="Verified by Injector Index" 
    style="width: 140px; height: auto;"
  />
</a>`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Eligibility Section */}
                        <div className="bg-[#101827] rounded-[2.5rem] border border-white/[0.06] p-10 md:p-14">
                            <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tight">Eligibility Criteria</h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        title: 'Top 20% by Clarity Score™',
                                        desc: 'The badge is reserved for providers who rank in the top 20% of their metropolitan area based on the merit-only Clarity Score™ algorithm (V2).',
                                        icon: CheckCircle
                                    },
                                    {
                                        title: 'NPI Verified',
                                        desc: 'Provider must maintain a clean, active record in the National Provider Identifier database with no recent federal sanctions.',
                                        icon: ShieldCheck
                                    },
                                    {
                                        title: 'Verified Pricing',
                                        desc: 'Clinic must have confirmed per-unit pricing transparency for at least one major neurotoxin brand.',
                                        icon: CheckCircle
                                    }
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-6">
                                        <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-secondary h-fit">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Check Eligibility */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24">
                            <Card className="rounded-[2.5rem] border border-white/[0.06] shadow-xl overflow-hidden bg-[#101827]">
                                <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] p-8">
                                    <CardTitle className="text-xl font-display font-bold text-white">Check Your Status</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
                                        Enter your practice name or provider handle to verify your current Clarity Score™ eligibility for the badge.
                                    </p>
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search practice name..."
                                                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                        <Button className="w-full bg-primary hover:bg-[#1a2332] text-white font-bold py-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                                            Check My Ranking
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mt-8 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.06]">
                                <div className="flex items-center gap-3 text-white font-bold mb-4">
                                    <Info className="w-5 h-5" />
                                    Independence Notice
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed font-light">
                                    Badge eligibility is determined strictly by data. Nobody can pay to lower the eligibility threshold or purchase a "Verified" status without meeting the Clarity Score™ criteria.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Award({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
    )
}

function BadgeLogo({ size = 120 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 15L170 40V100C170 144.18 140.35 180.26 100 190C59.65 180.26 30 144.18 30 100V40L100 15Z" fill="#1a2332" stroke="#d4af37" strokeWidth="8" />
            <path d="M70 100L90 120L130 80" stroke="#d4af37" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <text x="100" y="55" fontFamily="Inter, sans-serif" fontSize="12" fill="#d4af37" textAnchor="middle" fontWeight="900" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>Verified</text>
            <text x="100" y="155" fontFamily="Inter, sans-serif" fontSize="10" fill="#d4af37" textAnchor="middle" fontWeight="bold">INJECTOR INDEX</text>
            <circle cx="100" cy="100" r="85" stroke="#d4af37" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
        </svg>
    )
}
