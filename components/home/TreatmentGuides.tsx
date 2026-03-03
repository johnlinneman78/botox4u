import { Zap, Target, Building2, Dna, Clock, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function TreatmentGuides() {
    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#3D2B1F]/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-5">
                            Expert Treatment Intelligence
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-4">
                            The Complete <span className="text-[#C9A96E]">Buyer Guides.</span>
                        </h2>
                        <p className="text-xl text-[#3D2B1F]/70 max-w-2xl font-light leading-relaxed">
                            Don't book blind. Compare the top treatments, find vetted injectors, and see real-world pricing before your first consultation.
                        </p>
                    </div>
                </div>

                {/* Primary Guides */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            title: 'Botox & Neuromodulators',
                            desc: 'The #1 non-surgical treatment for wrinkle smoothing. Compare Dysport, Xeomin, and Botox providers.',
                            icon: Zap,
                            color: 'from-blue-600/20 to-blue-900/10',
                            accent: 'text-blue-400',
                            link: '/botox-buyers-guide'
                        },
                        {
                            title: 'Dermal Fillers',
                            desc: 'Lips, cheeks, jawline, and tear troughs. Find top-rated injectors for subtle, natural volume restoration.',
                            icon: Target,
                            color: 'from-violet-600/20 to-violet-900/10',
                            accent: 'text-violet-400',
                            link: '/botox-buyers-guide'
                        },
                        {
                            title: 'Medspa Services',
                            desc: 'Facials, lasers, skin tightening, and more. Browse indexed medical spas with verified clinical oversight.',
                            icon: Building2,
                            color: 'from-emerald-600/20 to-emerald-900/10',
                            accent: 'text-[#8A9E8D]',
                            link: '/botox-buyers-guide'
                        }
                    ].map((guide, i) => (
                        <Link
                            key={i}
                            href={guide.link}
                            className={`group relative bg-gradient-to-br ${guide.color} border border-[#3D2B1F]/10 rounded-[3rem] p-10 overflow-hidden hover:border-[#C9A96E]/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#C9A96E]/5`}
                        >
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-[#3D2B1F]/5 flex items-center justify-center ${guide.accent} mb-8 group-hover:scale-110 transition-transform`}>
                                    <guide.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">{guide.title}</h3>
                                <p className="text-[#3D2B1F]/70 mb-8 leading-relaxed font-light">
                                    {guide.desc}
                                </p>
                                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#3D2B1F] group-hover:text-[#C9A96E] transition-colors">
                                    Compare Top Providers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#C9A96E] opacity-[0.02] blur-[40px] rounded-full group-hover:opacity-[0.05] transition-opacity" />
                        </Link>
                    ))}
                </div>

                {/* Secondary (What's Next) */}
                <div className="relative pt-12 border-t border-[#3D2B1F]/10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F]/60 text-[10px] font-black tracking-widest uppercase mb-8">
                        <Sparkles className="w-3 h-3 text-[#C9A96E]" /> What's Next in 2026
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Polynucleotides (PNs)',
                                desc: 'The regen revolution for skin repair.',
                                icon: Dna,
                                link: '/find-providers?q=Polynucleotides'
                            },
                            {
                                title: 'Daxxify™',
                                desc: 'The 6-month, long-acting Botox alternative.',
                                icon: Clock,
                                link: '/find-providers?q=Daxxify'
                            },
                            {
                                title: 'Collagen Builders',
                                desc: 'Advanced structural repair for long-term health.',
                                icon: Sparkles,
                                link: '/find-providers?q=Sculptra'
                            }
                        ].map((guide, i) => (
                            <Link
                                key={i}
                                href={guide.link}
                                className="group flex items-center gap-5 p-6 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl hover:bg-[#3D2B1F]/5 hover:border-[#C9A96E]/20 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 flex items-center justify-center text-[#3D2B1F]/70 group-hover:text-[#C9A96E] transition-colors">
                                    <guide.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#3D2B1F] mb-1">{guide.title}</h4>
                                    <p className="text-[10px] text-[#3D2B1F]/60 font-medium uppercase tracking-wider">{guide.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-[#3D2B1F] transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
