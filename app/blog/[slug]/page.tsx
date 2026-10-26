
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { NICHE } from '@/config/niche'
import { ArrowLeft, Clock } from 'lucide-react'
import BlogCtaBar from '@/components/blog/BlogCtaBar'


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
        { slug: 'celebrity-plastic-surgery-transparency-2025' },
        { slug: 'botox-before-your-first-treatment' },
        { slug: 'glp-1-face-after-weight-loss-options' },
        { slug: 'hot-girl-fall-glow-up-guide' },
        { slug: 'erewhon-flex-psychology' },
        { slug: 'stanley-owala-basic-fomo' },
        { slug: 'the-ick-disgust-psychology' },
        { slug: 'neurodivergent-tiktok-language' },
        { slug: 'fda-fake-botox-warning-2025' },
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
            url: `/blog/${post.slug}`,
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
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
            "name": "Verified Aesthetics",
            "url": "https://www.verifiedaesthetics.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Verified Aesthetics",
            "url": "https://www.verifiedaesthetics.com"
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
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.verifiedaesthetics.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.verifiedaesthetics.com/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.verifiedaesthetics.com/blog/${post.slug}` }
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
            <BlogCtaBar />
        </main>
    )
}
