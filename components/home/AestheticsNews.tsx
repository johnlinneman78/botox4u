
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { NICHE } from '@/config/niche'

const ARTICLES = [
    {
        title: "How Much Does Botox Actually Cost in 2026?",
        excerpt: "Average per-unit costs vary wildly by city. See real patient-reported pricing data and find out what your session should actually cost.",
        slug: "how-much-does-botox-cost-2026",
        city: "Portland",
        state: "OR"
    },
    {
        title: "Botox Safety: What You Need to Know in 2026",
        excerpt: "Following a cluster of incidents at unlicensed spas, we analyze how to verify your injector and ensure you're getting FDA-approved product.",
        slug: "botox-safety-botulism-cases-2026",
        city: "New York",
        state: "NY"
    },
    {
        title: "Preventative Botox in Your 20s & 30s",
        excerpt: "Is 'Baby Botox' actually worth the investment? We look at the science and the long-term ROI of preventative treatments.",
        slug: "preventative-botox-20s-30s-worth-it",
        city: "Los Angeles",
        state: "CA"
    }
]

export default function AestheticsNews() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
                            Aesthetics News & Guides
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Independent analysis and consumer protection guides for aesthetic treatments.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link href="/claim" className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Promote My Clinic <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/news" className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            View All Articles <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ARTICLES.map((article) => (
                        <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-4">
                                    <Clock className="w-3 h-3" /> 5 Min Read
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-secondary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 flex-grow font-light">
                                    {article.excerpt}
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                                    <span>Read Full Guide →</span>
                                    <span>{article.city}, {article.state}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
