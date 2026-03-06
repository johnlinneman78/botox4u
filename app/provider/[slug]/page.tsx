import Link from 'next/link'
import { getProviderBySlug } from '@/lib/actions/providers'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generateMedicalClinicSchema, generateBreadcrumbSchema, generateReviewSchema } from '@/components/seo/JsonLd'
import { analyzeReviewThemes } from '@/components/providers/SemanticInsights'
import { formatCurrency } from '@/lib/utils'
import ProviderProfileClient from '@/components/providers/ProviderProfileClient'

interface ProviderProfileProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProviderProfileProps): Promise<Metadata> {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) return { title: 'Injector Profile | InjectorIndex' }

    // Unique components for the title
    const bizType = provider.businessType || 'Clinic'
    const title = `${provider.name} — ${provider.city} ${bizType} | Clinical Outcomes & 2026 Botox Audit`

    // Highly specific description
    const priceTxt = provider.pricePerUnit ? ` Verified unit price: $${provider.pricePerUnit}.` : ''
    const scoreVal = Math.round(provider.score_total || provider.clarityScore || 0)
    const scoreTxt = scoreVal ? ` Clarity Score™: ${scoreVal}/100.` : ''
    const description = `Analyze the March 2026 data for ${provider.name} in ${provider.city}, ${provider.state}. ${bizType} details cover clinical outcomes, ${scoreTxt}${priceTxt} Based on NPI and local market data.`

    return {
        title: title.slice(0, 70),
        description: description.slice(0, 165),
        alternates: {
            canonical: `https://www.injectorindex.com/provider/${provider.slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://www.injectorindex.com/provider/${provider.slug}`,
            images: [
                {
                    url: provider.hero_image_url || provider.imageUrl || `https://www.injectorindex.com/og-default.png`,
                    width: 1200,
                    height: 630,
                    alt: `${provider.name} — ${provider.city}`,
                }
            ]
        },
        robots: { index: true, follow: true }
    }
}

export default async function ProviderProfilePage({ params }: ProviderProfileProps) {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) {
        notFound()
    }

    const schema = generateMedicalClinicSchema(provider)
    const reviewSchema = generateReviewSchema(provider)
    const reviews = provider.top_reviews || provider.reviews || []
    const themes = analyzeReviewThemes(reviews)

    const enhancedSchema = { ...schema }
    if (themes.totalAnalyzed > 0 && themes.strengths.length > 0) {
        (enhancedSchema as any).review = themes.strengths.slice(0, 3).map((theme: any) => ({
            "@type": "Review",
            "reviewBody": `${theme.label} (mentioned in ${theme.percentage}% of ${themes.totalAnalyzed} analyzed reviews)`,
            "author": { "@type": "Organization", "name": "InjectorIndex Clarity Score™ Semantic Analysis" }
        }))
    }

    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: provider.city || 'Providers', item: `/${NICHE.baseSlug}/${(provider.state || 'us').toLowerCase()}/${(provider.city || '').toLowerCase().replace(/ /g, '-')}` },
        { name: provider.name || 'Provider', item: `/provider/${provider.slug || 'unknown'}` }
    ])

    return (
        <>
            <JsonLd data={enhancedSchema} />
            <JsonLd data={reviewSchema} />
            <JsonLd data={breadcrumbs} />
            <ProviderProfileClient provider={provider} themes={themes} />
        </>
    )
}
