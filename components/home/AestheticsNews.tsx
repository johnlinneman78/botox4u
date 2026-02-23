import Link from 'next/link'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'

const ARTICLES = [
    {
        title: "The Neo-Romantic Manifesto: Why the 2026 Aesthetic Shift is Moving Away from Filler",
        excerpt: "The first definitive guide to the Neo-Romantic aesthetic movement in regenerative medicine. Five principles defining the 2026 shift toward biological repair and facial harmony.",
        slug: "neo-romantic-manifesto-2026-aesthetic-shift",
        tag: "Core Manifesto",
        trending: true,
        author: "John Linneman",
        readTime: "8 min"
    },
    {
        title: "The Neo-Romantic Aesthetic Movement in Regenerative Medicine: Leading the Shift",
        excerpt: "The 'done' look is dead. From Portland's 54% Regen-Ratio to Seattle's tech-bio convergence, learn how clinics are adopting the Aesthetic Neo-Romanticism movement in 2026.",
        slug: "neo-romantic-aesthetics-portland-seattle-sf-2026",
        tag: "Industry Analysis",
        trending: true,
        author: "John Linneman",
        readTime: "6 min"
    },
    {
        title: "Seattle's Best Regenerative Injectors: A 2026 Neighborhood Guide",
        excerpt: "Capitol Hill's 42% PN adoption, SLU's 8.9 II-Score, Bellevue's premium protocols — the definitive neighborhood breakdown for regenerative aesthetics in Seattle.",
        slug: "seattle-regenerative-injectors-guide-2026",
        tag: "Seattle Regen",
        trending: true,
        author: "John Linneman",
        readTime: "7 min"
    },
]


export default function AestheticsNews() {
    return (
        <section className="py-24 bg-[#0d1420] border-t border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-black tracking-widest uppercase mb-5">
                            <TrendingUp className="w-3 h-3" /> Intelligence & Guides
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            The <span className="text-[#d4af37]">2026</span> Aesthetic Pulse
                        </h2>
                        <p className="text-gray-500 text-lg font-light">
                            Independent analysis on the Neo-Romantic aesthetic movement in regenerative medicine, and what it means for your skin.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/blog/neo-romantic-manifesto-2026-aesthetic-shift" className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-black tracking-widest uppercase hover:bg-[#d4af37]/20 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                            Core Manifesto
                        </Link>
                        <Link href="/blog" className="text-gray-500 font-bold flex items-center gap-2 hover:text-[#d4af37] transition-all text-sm shrink-0">
                            View All Guides <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ARTICLES.map((article, i) => (
                        <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                            <div className={`bg-white/[0.02] border rounded-3xl p-8 border-white/[0.06] hover:border-[#d4af37]/20 hover:bg-white/[0.04] transition-all hover:shadow-xl hover:shadow-[#d4af37]/5 flex flex-col h-full ${i === 0 ? 'md:col-span-1' : ''}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${article.trending
                                        ? 'bg-[#d4af37]/10 border-[#d4af37]/20 text-[#d4af37]'
                                        : 'bg-white/5 border-white/10 text-gray-500'
                                        }`}>
                                        {article.trending && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] mr-1.5 animate-pulse align-middle" />}
                                        {article.tag}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                                        <Clock className="w-3 h-3" /> {article.readTime}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#d4af37] transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm flex-grow leading-relaxed font-light">
                                    {article.excerpt}
                                </p>
                                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#d4af37] group-hover:gap-2 transition-all flex items-center gap-1">
                                        Read Guide <ArrowRight className="w-3 h-3" />
                                    </span>
                                    <span className="text-gray-700">By {article.author}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
