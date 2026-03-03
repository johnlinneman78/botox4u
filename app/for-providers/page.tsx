import React from 'react'
import { Metadata } from 'next'
import {
    Cpu,
    Database,
    Globe,
    ShieldCheck,
    TrendingUp,
    Users,
    Zap,
    ArrowRight,
    BarChart3,
    Search,
    MessageCircle,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
    title: 'For Providers — Scale Your Aesthetic Practice | InjectorIndex',
    description: 'The most semantically rich, AI-cited injector directory in the world. Help patients find you through search and AI agents like ChatGPT and Gemini.',
}

export default function ForProvidersPage() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] text-[#3D2B1F] selection:bg-[#C9A96E]/30">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C9A96E]/5 blur-[120px] rounded-full translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 text-[#8A9E8D] text-xs font-black tracking-widest uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Cpu className="w-3.5 h-3.5" /> Built for the Agentic Era
                        </div>
                        <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 leading-[0.9] tracking-tight text-balance">
                            The Most <span className="text-[#C9A96E] italic">AI-Cited</span> Injector Directory.
                        </h1>
                        <p className="text-xl md:text-2xl text-[#3D2B1F]/70 font-light max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            Don't just rank on Google. Get cited by <strong>ChatGPT, Gemini, and Perplexity</strong> when patients ask for the best injectors in your city.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-16 px-12 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black text-lg rounded-2xl shadow-2xl shadow-[#C9A96E]/20 transition-all hover:scale-[1.02]">
                                    List Your Practice
                                </Button>
                            </Link>
                            <Link href="/api-access" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-16 px-12 border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/5 text-[#3D2B1F] font-bold text-lg rounded-2xl transition-all">
                                    Explore API Data
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE DISCOVERY SECTION */}
            <section className="py-24 border-y border-[#3D2B1F]/10 bg-[#F2EDE4]/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
                                    Stand out without <span className="text-[#C9A96E]">marketing spin.</span>
                                </h2>
                                <p className="text-lg text-[#3D2B1F]/70 font-light leading-relaxed mb-10">
                                    Traditional directories look like billboards. InjectorIndex only surfaces the truth. We highlight your actual expertise, verified credentials, and patient outcomes, making it easy for the right patients to find you.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                                            <Database className="w-6 h-6 text-[#C9A96E]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#3D2B1F] mb-2">Optimized for Patient Discovery</h4>
                                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">We structure your profile so that when patients search for specific treatments or "natural results" in your city, your clinic ranks exactly where it should.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 flex items-center justify-center shrink-0">
                                            <MessageCircle className="w-6 h-6 text-[#8A9E8D]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#3D2B1F] mb-2">Real Review Highlights</h4>
                                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">We automatically highlight the key words from your best reviews — matching you with patients prioritizing facial harmony over volume.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                                            <Globe className="w-6 h-6 text-[#C9A96E]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#3D2B1F] mb-2">Expanded Visibility</h4>
                                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">Your verified profile isn't just a webpage. We distribute your trusted credentials to the places new patients are already looking.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-[#C9A96E]/10 blur-[100px] rounded-full pointer-events-none" />
                                <div className="bg-[#F2EDE4] border border-[#3D2B1F]/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-[#C9A96E]" />
                                        <div className="w-3 h-3 rounded-full bg-[#8A9E8D]" />
                                        <span className="ml-auto text-[10px] text-[#3D2B1F]/50 font-mono tracking-widest uppercase">search_results.io</span>
                                    </div>
                                    <div className="font-mono text-sm space-y-4">
                                        <p className="pl-4 text-[#8A9E8D] group flex items-start">
                                            <span className="text-[#3D2B1F]/50 mr-2">Patient Search:</span>
                                            <span className="text-[#3D2B1F]">"Best natural lip filler in {NICHE.cities[0].name}"</span>
                                        </p>
                                        <p className="pl-4 text-[#8A9E8D] flex items-start">
                                            <span className="text-[#3D2B1F]/50 mr-2">Top Recommendation:</span>
                                            <span className="text-[#C9A96E] font-bold">Your Clinic</span>
                                        </p>
                                        <div className="pl-4 border-l-2 border-[#C9A96E]/30 my-6 py-2">
                                            <p className="text-[#C9A96E] italic">// Why You Ranked #1:</p>
                                            <p className="text-[#3D2B1F]/70 mt-2">1. Verified Credentials</p>
                                            <p className="text-[#3D2B1F]/70 mt-1">2. 45 Reviews mentioning "Natural"</p>
                                            <p className="text-[#3D2B1F]/70 mt-1">3. Specialized in Facial Harmony</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE PILLARS OF VALUE */}
            <section className="py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Built for <span className="text-[#C9A96E]">Growth.</span></h2>
                        <p className="text-[#3D2B1F]/60 max-w-xl mx-auto">Three ways InjectorIndex delivers patient traffic to your door.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* High Intent Traffic */}
                        <div className="p-10 rounded-[3rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/5 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-[#8A9E8D]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">High-Intent Traffic</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                We target patients searching for specific, high-value treatments like <strong>Polynucleotides (PNs)</strong> and <strong>Daxxify</strong>. These patients values quality over deep discounts.
                            </p>
                        </div>

                        {/* Immutable Trust */}
                        <div className="p-10 rounded-[3rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/5 transition-all group lg:translate-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7 text-[#C9A96E]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Immutable Trust</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                Our <strong>Clarity Score™</strong> cannot be bought. This independence gives you instant authority. When you rank high, patients know it's because you're actually elite.
                            </p>
                        </div>

                        {/* Lead Ownership */}
                        <div className="p-10 rounded-[3rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/5 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-[#8A9E8D]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">You Own the Lead</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                We don't hide your phone number or website behind a wall. Every premium listing gets direct click-throughs to your booking page. No middleman, no commission.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto rounded-[4rem] p-12 md:p-24 bg-gradient-to-br from-[#C9A96E] to-[#B5955B] text-white relative overflow-hidden text-center shadow-2xl">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3D2B1F]/10 rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready to rank better?</h2>
                            <p className="text-xl md:text-2xl font-medium mb-12 opacity-90 text-balance">
                                Claim your practice today. Verified badges are currently free for the first 30 days of the beta.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href="/claim">
                                    <Button className="h-16 px-12 bg-[#FAF8F5] text-[#3D2B1F] hover:bg-black font-black text-lg rounded-2xl transition-all">
                                        Find & Claim Your Profile
                                    </Button>
                                </Link>
                                <Link href={`mailto:${NICHE.outreach.senderEmail}`} className="text-sm font-bold uppercase tracking-widest border-b-2 border-current hover:opacity-75 transition-opacity">
                                    Contact Sales
                                </Link>
                            </div>

                            <div className="mt-16 pt-12 border-t border-black/10 grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <div className="text-3xl font-black mb-1">22</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Cities Indexed</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black mb-1">500+</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verified Clinicians</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black mb-1">1M+</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reviews Analyzed</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black mb-1">100%</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Independent Data</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER PUSH */}
            <footer className="py-12 border-t border-[#3D2B1F]/10 text-center">
                <p className="text-[10px] text-[#3D2B1F]/50 uppercase tracking-widest font-black flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#8A9E8D]" /> ISO 27001 Data Standard Compliance · Powered by Clarity Score™
                </p>
            </footer>
        </main>
    )
}
