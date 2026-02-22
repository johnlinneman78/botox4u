
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { NICHE } from '@/config/niche'
import { ArrowLeft, Clock, Mail, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BlogPostPageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = BLOG_POSTS.find(p => p.slug === params.slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: `${post.title} | ${NICHE.siteName} Blog`,
        description: post.metaDescription,
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            type: 'article',
            url: `https://injectorindex.com/blog/${post.slug}`,
            // images: [{ url: '/images/og-blog.jpg' }] // Pinterest image placeholder
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = BLOG_POSTS.find(p => p.slug === params.slug)
    if (!post) notFound()

    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "author": {
            "@type": "Organization",
            "name": "Injector Index",
            "url": "https://injectorindex.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Injector Index",
            "url": "https://injectorindex.com"
        },
        "datePublished": post.publishDate,
        "dateModified": post.publishDate
    }

    // FAQ Schema
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

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://injectorindex.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://injectorindex.com/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://injectorindex.com/blog/${post.slug}` }
        ]
    }

    return (
        <main className="min-h-screen bg-white">
            <JsonLd data={articleSchema} />
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            <div className="bg-gray-50 border-b border-gray-100 mb-12">
                <div className="container mx-auto px-4 py-16 text-center">
                    <Link href="/blog" className="inline-flex items-center text-sm font-bold text-secondary mb-8 hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                        <Clock className="w-3 h-3" />
                        5 Minute Read
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        {post.publishDate}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-primary max-w-4xl mx-auto leading-tight">
                        {post.title}
                    </h1>
                </div>
            </div>

            <article className="container mx-auto px-4 max-w-3xl pb-24">
                {/* Render content as markdown/html - using a simple div for now since we have string content */}
                <div className="prose prose-lg prose-gray max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-headings:text-primary
          prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-primary prose-table:border prose-table:rounded-xl prose-table:overflow-hidden">
                    {post.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="text-3xl mt-12 mb-6">{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="text-2xl mt-10 mb-4">{line.replace('### ', '')}</h3>
                        if (line.startsWith('|')) return null; // Table handling is complex, skip for skeletal view or use a component
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} className="mb-6 text-gray-600 leading-relaxed font-light">{line}</p>
                    })}

                    {/* FAQ Section */}
                    <div className="mt-20 border-t border-gray-100 pt-16">
                        <h2 className="text-3xl font-display font-bold text-primary mb-10 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            {post.faqs.map((faq, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-primary mb-4">{faq.question}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* Blog CTA Bar */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs mb-4">
                                <BarChart3 className="w-4 h-4" />
                                Botox Pulse Data
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                                Get Free Botox Pricing for Your Area
                            </h2>
                            <p className="text-gray-500 text-lg font-light leading-relaxed">
                                Join 2,400+ patients getting monthly pricing updates, provider scores, and patient insights.
                            </p>
                        </div>
                        <div className="w-full md:w-auto min-w-[320px]">
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                                    />
                                </div>
                                <Button className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg rounded-xl">
                                    Get My Free Updates →
                                </Button>
                                <div className="text-center pt-2">
                                    <Link href="/pulse" className="text-sm font-bold text-secondary hover:underline">
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
