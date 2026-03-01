import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Shield, Calculator, Zap, ArrowRight, MessageCircle, Star, Sparkles, Heart } from 'lucide-react'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
    title: `Aesthetic Treatment Guides & Intelligence | ${NICHE.siteName}`,
    description: 'Master the art of aesthetic medicine selection. From Botox pricing to finding the best regenerative injectors, our guides are data-backed and patient-first.',
}

const guides = [
    {
        title: 'The Botox Buyer\'s Guide',
        desc: 'Everything you need to know about Botox, from pricing and units to finding a safe, qualified injector.',
        href: '/botox-buyers-guide',
        icon: BookOpen,
        color: 'text-violet-400',
        bg: 'bg-violet-400/10',
        border: 'border-violet-400/20'
    },
    {
        title: 'Botox Fact Sheet',
        desc: 'The quick facts on longevity, safety, and what to actually expect during your first treatment.',
        href: '/botox-fact-sheet',
        icon: Shield,
        color: 'text-[#d4af37]',
        bg: 'bg-[#d4af37]/10',
        border: 'border-[#d4af37]/20'
    },
    {
        title: 'The Botox Pulse Survey',
        desc: 'See live pricing data and patient satisfaction scores from across the country.',
        href: '/pulse',
        icon: Zap,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20'
    },
    {
        title: 'How Much Does Botox Cost?',
        desc: 'Our comprehensive breakdown of national and regional pricing for 2026.',
        href: '/blog/how-much-does-botox-cost-2026',
        icon: Calculator,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    }
]

export default function GuidesPage() {
    return (
        <main className="min-h-screen bg-[#0d1420] pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
                        Clinical <span className="text-[#d4af37]">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Master the complexities of modern aesthetics with our independent, data-backed research. No ads, just outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {guides.map((guide) => (
                        <Link
                            key={guide.href}
                            href={guide.href}
                            className={`group p-10 rounded-[3rem] bg-white/[0.02] border ${guide.border} hover:bg-white/[0.04] transition-all relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <guide.icon className="w-32 h-32" />
                            </div>

                            <div className={`w-14 h-14 rounded-2xl ${guide.bg} flex items-center justify-center mb-8 border ${guide.border}`}>
                                <guide.icon className={`w-7 h-7 ${guide.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#d4af37] transition-colors">{guide.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-light mb-8">
                                {guide.desc}
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                Read Guide <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter / Audit CTA */}
                <div className="mt-24 max-w-4xl mx-auto p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#101827] to-[#0d1420] border border-white/[0.06] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-8 opacity-10">
                        <Sparkles className="w-16 h-16 text-[#d4af37]" />
                    </div>

                    <h2 className="text-3xl font-display font-bold text-white mb-6">Want personalized advice?</h2>
                    <p className="text-gray-400 mb-10 text-lg font-light">
                        Use our Injector Match tool to find the perfect specialist for your unique clinical goals.
                    </p>
                    <Link href="/#match-quiz">
                        <button className="h-16 px-12 bg-[#d4af37] text-[#0d1420] font-black text-lg rounded-2xl hover:bg-[#c0a030] transition-all hover:scale-[1.02]">
                            Start Injector Match
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
