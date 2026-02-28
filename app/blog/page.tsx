
import { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { ArrowRight, Clock, Search, BookOpen } from 'lucide-react'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
  title: "Botox Intelligence Blog 2026 | InjectorIndex",
  description: "Research, guides, and data on botox injectors, costs, and trends.",
  alternates: {
    canonical: 'https://www.injectorindex.com/blog',
  }
}

// Static index page for better SEO performance

export default function BlogIndexPage() {
    return (
        <main className="min-h-screen bg-[#0d1420]">
            {/* Blog Hero */}
            <section className="bg-[#0d1420] text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/5 -skew-x-12 translate-x-1/3" />
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] mb-10 px-6 py-2 rounded-full text-[#d4af37]">
                        <BookOpen className="w-4 h-4" />
                        Knowledge Base
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        Aesthetics <span className="text-[#d4af37] italic">News & Guides</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        Independent research and consumer protection guides to help you navigate the complex world of aesthetic medicine with data.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {BLOG_POSTS.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="bg-white/[0.02] rounded-[2.5rem] border border-white/[0.06] overflow-hidden h-full flex flex-col hover:shadow-2xl hover:shadow-[#d4af37]/5 transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37]/20">
                                    <div className="p-10 flex flex-col h-full bg-gradient-to-br from-[#d4af37]/5 to-transparent relative overflow-hidden">
                                        {/* SEO Alt Text Placeholder */}
                                        <span className="sr-only text-[1px]">{post.targetKeyword} guide for aesthetic medical patients</span>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded border border-[#d4af37]/20">
                                                {post.targetKeyword.includes('tox') ? 'Neurotoxin Data' : post.targetKeyword.includes('pn') ? 'Regenerative Science' : 'Consumer Guide'}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                5 Min Read
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-display font-bold text-white mb-6 leading-tight group-hover:text-[#d4af37] transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 font-light leading-relaxed flex-grow line-clamp-3 mb-8">
                                            {post.metaDescription}
                                        </p>
                                        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between">
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                Read Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#d4af37]" />
                                            </div>
                                            <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                                                {post.publishDate}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-4xl font-display font-bold text-white mb-6">Never overpay for Botox again.</h2>
                    <p className="text-xl text-gray-500 font-light mb-12">Submit your email to receive monthly pricing updates, new provider alerts, and patient safety reports for your local market.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 h-16 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10 text-lg text-white placeholder:text-gray-700 transition-all"
                        />
                        <button className="h-16 px-10 bg-[#d4af37] text-[#0d1420] font-bold rounded-2xl hover:scale-[1.05] transition-transform shadow-lg shadow-[#d4af37]/10">
                            Join the Pulse
                        </button>
                    </div>
                    <p className="mt-6 text-[10px] text-gray-700 uppercase font-bold tracking-widest">Join 2,400+ patients tracking the market.</p>
                </div>
            </section>
        </main>
    )
}
