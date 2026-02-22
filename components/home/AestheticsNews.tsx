
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { NICHE } from '@/config/niche'

const ARTICLES = [
    {
        title: "The Truth About Botox Pricing in 2024",
        excerpt: "Why some clinics charge $10 while others charge $20, and how to spot the red flags.",
        slug: "botox-pricing-guide-2024",
        city: "New York",
        state: "NY"
    },
    {
        title: "Which Injectors Use Natural Results Techniques?",
        excerpt: "A guide to finding providers who prioritize a conservative, natural look over the 'frozen' face.",
        slug: "natural-results-injector-guide",
        city: "Los Angeles",
        state: "CA"
    },
    {
        title: "The Most Trusted Clinics in Scottsdale",
        excerpt: "An analysis of 2,000+ patient reviews reveals the top-scoring providers for trust and transparency.",
        slug: "most-trusted-scottsdale-medspas",
        city: "Scottsdale",
        state: "AZ"
    },
    {
        title: "Portland Botox Pricing: A Local Guide",
        excerpt: "A deep dive into Portland's aesthetic market, comparing prices across Pearl District, Lake Oswego, and Beaverton.",
        slug: "portland-botox-pricing-guide",
        city: "Portland",
        state: "OR"
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
                        <div key={article.slug} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-4">
                                <Clock className="w-3 h-3" /> 5 Min Read
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 flex-grow">
                                {article.excerpt}
                            </p>
                            <div className="pt-6 border-t border-gray-50">
                                <Link
                                    href={`/${NICHE.baseSlug}/${article.state.toLowerCase()}/${article.city.toLowerCase().replace(/ /g, '-')}`}
                                    className="text-xs font-bold text-gray-400 hover:text-secondary transition-colors"
                                >
                                    Related: Top Providers in {article.city}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
