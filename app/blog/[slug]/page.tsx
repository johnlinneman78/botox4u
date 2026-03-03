
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { NICHE } from '@/config/niche'
import { ArrowLeft, Clock, Mail, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'


// This will be static by default because of generateStaticParams

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return [
        { slug: 'how-much-does-botox-cost-2026' },
        { slug: 'botox-safety-botulism-cases-2026' },
        { slug: 'preventative-botox-20s-30s-worth-it' },
        { slug: 'botox-vs-dysport-vs-xeomin-vs-letybo-2026' },
        { slug: 'how-to-find-good-botox-injector' },
        { slug: 'kourtney-kardashian-third-eye-botox-debate' },
        { slug: 'botox-aftercare-guide-2026' },
        { slug: 'polynucleotides-regenerative-injector-city-guide-2026' },
        { slug: 'daxxify-long-acting-tox-city-reports-2026' },
        { slug: 'neo-romantic-aesthetics-portland-seattle-sf-2026' },
        { slug: 'exosome-therapy-portland-seattle-2026' },
        { slug: 'seattle-regenerative-injectors-guide-2026' },
        { slug: 'best-botox-miami-2026' },
    ]
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = BLOG_POSTS.find(p => p.slug === slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: `${post.title} | ${NICHE.siteName} Blog`,
        description: post.metaDescription,
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            type: 'article',
            url: `https://www.injectorindex.com/blog/${post.slug}`,
        },
        alternates: {
            canonical: `https://www.injectorindex.com/blog/${post.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = BLOG_POSTS.find(p => p.slug === slug)
    if (!post) notFound()

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "author": {
            "@type": "Organization",
            "name": "Injector Index",
            "url": "https://www.injectorindex.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Injector Index",
            "url": "https://www.injectorindex.com"
        },
        "datePublished": post.publishDate,
        "dateModified": post.publishDate
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.injectorindex.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.injectorindex.com/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.injectorindex.com/blog/${post.slug}` }
        ]
    }

    return (
        <main className="min-h-screen bg-[#FAF8F5]">
            <JsonLd data={articleSchema} />
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            <div className="bg-[#F2EDE4] border-b border-[#3D2B1F]/10 mb-12">
                <div className="container mx-auto px-4 py-16 text-center">
                    <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#C9A96E] mb-8 hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/50 mb-6">
                        <Clock className="w-3 h-3" />
                        5 Minute Read
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        {post.publishDate}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-[#3D2B1F] max-w-4xl mx-auto leading-tight">
                        {post.title}
                    </h1>
                </div>
            </div>

            <article className="container mx-auto px-4 max-w-3xl pb-24">
                <div className="prose prose-lg prose-invert max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-headings:text-[#3D2B1F]
          prose-a:text-[#C9A96E] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#3D2B1F] prose-table:border prose-table:rounded-xl prose-table:overflow-hidden">
                    {post.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="text-3xl mt-12 mb-6 text-[#3D2B1F]">{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="text-2xl mt-10 mb-4 text-[#3D2B1F]">{line.replace('### ', '')}</h3>
                        if (line.startsWith('|')) return null;
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} className="mb-6 text-[#3D2B1F]/70 leading-relaxed font-light">{line}</p>
                    })}

                    {/* FAQ Section */}
                    <div className="mt-20 border-t border-[#3D2B1F]/10 pt-16">
                        <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-10 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            {post.faqs.map((faq, i) => (
                                <div key={i} className="bg-[#3D2B1F]/5 p-8 rounded-3xl border border-[#3D2B1F]/10">
                                    <h3 className="text-xl font-bold text-[#3D2B1F] mb-4">{faq.question}</h3>
                                    <p className="text-[#3D2B1F]/60 font-light leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* Blog CTA Bar */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-[#F2EDE4] rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden border border-[#3D2B1F]/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-[#C9A96E] font-black uppercase tracking-widest text-xs mb-4">
                                <BarChart3 className="w-4 h-4" />
                                Botox Pulse Data
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#3D2B1F] mb-6">
                                Get Free Botox Pricing for Your Area
                            </h2>
                            <p className="text-[#3D2B1F]/60 text-lg font-light leading-relaxed">
                                Join 2,400+ patients getting monthly pricing updates, provider scores, and patient insights.
                            </p>
                        </div>
                        <div className="w-full md:w-auto min-w-[320px]">
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2B1F]/50 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full h-14 pl-12 pr-4 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 text-[#3D2B1F] placeholder:text-gray-700"
                                    />
                                </div>
                                <Button className="w-full h-14 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#C9A96E]/10">
                                    Get My Free Updates →
                                </Button>
                                <div className="text-center pt-2">
                                    <Link href="/pulse" className="text-sm font-bold text-[#C9A96E] hover:underline">
                                        Or take the full 2-minute survey for personalized data →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
