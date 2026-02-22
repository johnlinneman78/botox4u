
import { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { ArrowRight, Clock, Search, BookOpen } from 'lucide-react'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
    title: 'Injector Index Blog | Independent Aesthetic Intelligence',
    description: 'Consumer protection guides, pricing analysis, and safety reports for Botox and other aesthetic treatments.',
}

export default function BlogIndexPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Blog Hero */}
            <section className="bg-primary text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 translate-x-1/3" />
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.2em] mb-10 px-6 py-2 rounded-full">
                        <BookOpen className="w-4 h-4 text-secondary" />
                        Knowledge Base
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        Aesthetics <span className="text-secondary italic">News & Guides</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Independent research and consumer protection guides to help you navigate the complex world of aesthetic medicine with data.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {BLOG_POSTS.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden h-full flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="p-10 flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-2 py-1 rounded">
                                                Consumer Guide
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                5 Min Read
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-display font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 font-light leading-relaxed flex-grow line-clamp-3 mb-8">
                                            {post.metaDescription}
                                        </p>
                                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-sm font-bold text-primary flex items-center gap-2">
                                                Read Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
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
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-4xl font-display font-bold text-primary mb-6">Never overpay for Botox again.</h2>
                    <p className="text-xl text-gray-500 font-light mb-12">Submit your email to receive monthly pricing updates, new provider alerts, and patient safety reports for your local market.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 text-lg transition-all"
                        />
                        <button className="h-16 px-10 bg-secondary text-white font-bold rounded-2xl hover:scale-[1.05] transition-transform shadow-lg">
                            Join the Pulse
                        </button>
                    </div>
                    <p className="mt-6 text-[10px] text-gray-400 uppercase font-bold tracking-widest">Join 2,400+ patients tracking the market.</p>
                </div>
            </section>
        </main>
    )
}
