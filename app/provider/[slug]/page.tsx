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

    if (!provider) return { title: 'Provider Not Found' }

    return {
        title: `${provider.name} | ${provider.city} ${NICHE.name} Review`,
        description: `View Clarity Score™, independent reviews, and pricing for ${provider.name} in ${provider.city}. Compare with other top-rated aesthetic injectors near you.`,
        alternates: {
            canonical: `https://www.injectorindex.com/provider/${provider.slug}`,
        },
        openGraph: {
            title: `${provider.name} | ${provider.city} ${NICHE.name} Review`,
            description: `View Clarity Score™, independent reviews, and pricing for ${provider.name} in ${provider.city}.`,
            url: `https://www.injectorindex.com/provider/${provider.slug}`,
            images: [
                {
                    url: provider.hero_image_url || provider.imageUrl || `https://www.injectorindex.com/og-default.png`,
                    width: 1200,
                    height: 630,
                    alt: provider.name,
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
        { name: provider.city, item: `/${NICHE.baseSlug}/${provider.state.toLowerCase()}/${provider.city.toLowerCase().replace(/ /g, '-')}` },
        { name: provider.name, item: `/provider/${provider.slug}` }
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
