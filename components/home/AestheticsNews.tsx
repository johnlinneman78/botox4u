import Link from 'next/link'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'

const ARTICLES = [
    {
        title: "Botox vs. Daxxify: The 2026 Guide to Neurotoxin Longevity",
        excerpt: "Compare the gold standard against the new long-acting rival. We break down the cost-per-day, clinical safety, and real-world results of current toxins.",
        slug: "daxxify-long-acting-tox-city-reports-2026",
        tag: "Treatment Guide",
        trending: true,
        author: "InjectorIndex Editorial",
        readTime: "6 min"
    },
    {
        title: "The Neo-Romantic Manifesto: Why the 2026 Aesthetic Shift is Moving Away from Filler",
        excerpt: "The first definitive guide to the Neo-Romantic movement. Five principles defining the 2026 shift toward biological repair and facial harmony.",
        slug: "neo-romantic-manifesto-2026-aesthetic-shift",
        tag: "Core Manifesto",
        trending: true,
        author: "InjectorIndex Editorial",
        readTime: "8 min"
    },
    {
        title: "New York's Biological Renaissance: The 2026 Treatment Outlook",
        excerpt: "From clinical precision in Manhattan to SLU-inspired protocols in Brooklyn — how NYC is leading the national shift toward long-acting tox and polynucleotides.",
        slug: "new-york-regenerative-aesthetic-outlook-2026",
        tag: "NYC Intel",
        trending: true,
        author: "InjectorIndex Editorial",
        readTime: "7 min"
    },
];


export default function AestheticsNews() {
    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#3D2B1F]/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F]/70 text-xs font-black tracking-widest uppercase mb-5">
                            <TrendingUp className="w-3 h-3" /> Intelligence & Guides
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-4">
                            The 2026 <span className="text-[#C9A96E]">Botox Intelligence Hub</span>
                        </h2>
                        <p className="text-[#3D2B1F]/60 text-lg font-light">
                            Expert guides, cost breakdowns, and injector research — everything you need before booking.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/blog/neo-romantic-manifesto-2026-aesthetic-shift" className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] text-xs font-black tracking-widest uppercase hover:bg-[#C9A96E]/20 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
                            Core Manifesto
                        </Link>
                        <Link href="/blog" className="text-[#3D2B1F]/60 font-bold flex items-center gap-2 hover:text-[#C9A96E] transition-all text-sm shrink-0">
                            View All Guides <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ARTICLES.map((article, i) => (
                        <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                            <div className={`bg-[#3D2B1F]/5 border rounded-3xl p-8 border-[#3D2B1F]/10 hover:border-[#C9A96E]/20 hover:bg-[#3D2B1F]/5 transition-all hover:shadow-xl hover:shadow-[#C9A96E]/5 flex flex-col h-full ${i === 0 ? 'md:col-span-1' : ''}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${article.trending
                                        ? 'bg-[#C9A96E]/10 border-[#C9A96E]/20 text-[#C9A96E]'
                                        : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 text-[#3D2B1F]/60'
                                        }`}>
                                        {article.trending && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A96E] mr-1.5 animate-pulse align-middle" />}
                                        {article.tag}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                                        <Clock className="w-3 h-3" /> {article.readTime}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#3D2B1F] mb-3 leading-snug group-hover:text-[#C9A96E] transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-[#3D2B1F]/60 text-sm flex-grow leading-relaxed font-light">
                                    {article.excerpt}
                                </p>
                                <div className="pt-6 mt-4 border-t border-[#3D2B1F]/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#C9A96E] group-hover:gap-2 transition-all flex items-center gap-1">
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
