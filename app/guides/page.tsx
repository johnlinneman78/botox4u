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
        color: 'text-[#C9A96E]',
        bg: 'bg-[#C9A96E]/10',
        border: 'border-[#C9A96E]/20'
    },
    {
        title: 'The Botox Pulse Survey',
        desc: 'See live pricing data and patient satisfaction scores from across the country.',
        href: '/pulse',
        icon: Zap,
        color: 'text-[#8A9E8D]',
        bg: 'bg-[#8A9E8D]/10',
        border: 'border-[#8A9E8D]/20'
    },
    {
        title: 'How Much Does Botox Cost?',
        desc: 'Our comprehensive breakdown of national and regional pricing for 2026.',
        href: '/blog/how-much-does-botox-cost-2026',
        icon: Calculator,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        title: 'Per-Area Pricing Hides How Many Units You Got',
        desc: 'A flat price per area sounds simple — until you realize it hides the one number that tells you whether the price is fair: the unit count.',
        href: '/blog/per-area-pricing-hides-how-many-units',
        icon: Star,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20'
    }
]

export default function GuidesPage() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-[#3D2B1F] mb-8 leading-tight">
                        Clinical <span className="text-[#C9A96E]">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 font-light leading-relaxed">
                        Master the complexities of modern aesthetics with our independent, data-backed research. No ads, just outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {guides.map((guide) => (
                        <Link
                            key={guide.href}
                            href={guide.href}
                            className={`group p-10 rounded-[3rem] bg-[#3D2B1F]/5 border ${guide.border} hover:bg-[#3D2B1F]/5 transition-all relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <guide.icon className="w-32 h-32" />
                            </div>

                            <div className={`w-14 h-14 rounded-2xl ${guide.bg} flex items-center justify-center mb-8 border ${guide.border}`}>
                                <guide.icon className={`w-7 h-7 ${guide.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4 group-hover:text-[#C9A96E] transition-colors">{guide.title}</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light mb-8">
                                {guide.desc}
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#3D2B1F]/40 group-hover:text-[#3D2B1F] transition-colors">
                                Read Guide <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter / Audit CTA */}
                <div className="mt-24 max-w-4xl mx-auto p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#101827] to-[#0d1420] border border-[#3D2B1F]/10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-8 opacity-10">
                        <Sparkles className="w-16 h-16 text-[#C9A96E]" />
                    </div>

                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-6">Want personalized advice?</h2>
                    <p className="text-[#3D2B1F]/70 mb-10 text-lg font-light">
                        Use our Injector Match tool to find the perfect specialist for your unique clinical goals.
                    </p>
                    <Link href="/#match-quiz">
                        <button className="h-16 px-12 bg-[#C9A96E] text-white font-black text-lg rounded-2xl hover:bg-[#B5955B] transition-all hover:scale-[1.02]">
                            Start Injector Match
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
