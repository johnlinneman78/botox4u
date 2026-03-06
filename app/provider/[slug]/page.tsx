import Link from 'next/link'
import { getProviderBySlug, getProvidersWithSearch } from '@/lib/actions/providers'
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

    // Title logic
    const fullTitle = `${provider.name} — Botox & Filler in ${provider.city} | InjectorIndex`
    const shortTitle = `${provider.name} — ${provider.city} | InjectorIndex`
    const title = fullTitle.length > 70 ? shortTitle : fullTitle

    // Meta Description logic
    const scoreVal = Math.round(provider.score_total || provider.clarityScore || 0)
    const reviewsCount = provider.reviewCount || 0
    const bizType = provider.businessType || 'Clinic'

    // Simple hash to deterministically rotate patterns
    let hash = 0;
    for (let i = 0; i < provider.slug.length; i++) {
        hash = ((hash << 5) - hash) + provider.slug.charCodeAt(i);
        hash |= 0; // Convert to 32bit int
    }
    const patternIndex = Math.abs(hash) % 3;

    let description = '';
    if (patternIndex === 0) {
        description = `${provider.name} in ${provider.city} — Clarity Score™ ${scoreVal}/100 based on ${reviewsCount} reviews. Compare pricing, credentials, and patient ratings.`
    } else if (patternIndex === 1) {
        description = `Rated ${scoreVal}/100 on InjectorIndex. See ${provider.name}'s credentials, pricing, and ${reviewsCount} patient reviews in ${provider.city}, ${provider.state}.`
    } else {
        description = `${provider.name} — ${provider.city} ${bizType}. ${scoreVal}/100 Clarity Score™ · ${reviewsCount} reviews · Independent ratings and pricing data.`
    }

    return {
        title: title.slice(0, 70),
        description: description.slice(0, 155),
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

    const localProviders = await getProvidersWithSearch({ city: provider.city, state: provider.state, limit: 12 })
    const relatedProviders = localProviders.filter(p => p.slug !== provider.slug).slice(0, 8)

    const scoreVal = Math.round(provider.clarity_score || provider.score_total || 0)

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does Botox cost with ${provider.name} in ${provider.city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Botox in ${provider.city} typically costs $12-$16 per unit depending on the clinical setting and provider expertise. ${provider.name} is assessed at a price index of ${provider.price_per_unit ? '$' + provider.price_per_unit + '/unit' : 'the local average'}, reflecting the market standard for ${provider.businessType || 'Aesthetic Medicine'} providers in the area.`
                }
            },
            {
                "@type": "Question",
                "name": `What is a Clarity Score™ and how did ${provider.name} score?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Clarity Score™ is InjectorIndex's independent rating system that evaluates providers on 5 data signals: patient outcomes, medical credentials, patient reviews, practice quality, and pricing transparency. Scores range from 0-100 without any pay-to-play bias. ${provider.name} currently holds a score of ${scoreVal}/100, indicating their relative position among verified local peers.`
                }
            },
            {
                "@type": "Question",
                "name": `How do I compare Botox providers in ${provider.city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `InjectorIndex lets you compare over ${localProviders.length > 5 ? localProviders.length + '+' : 'several'} verified providers in ${provider.city} by Clarity Score™, estimated pricing, and patient sentiments. Visit our comprehensive ${provider.city} provider rankings page to explore credentials and independent data across the state of ${provider.state}.`
                }
            }
        ]
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)]">
            <JsonLd data={enhancedSchema} />
            <JsonLd data={reviewSchema} />
            <JsonLd data={breadcrumbs} />
            <JsonLd data={faqSchema} />

            <ProviderProfileClient provider={provider} themes={themes} />

            {/* COMPARE PROVIDERS CROSS-LINKING SECTION */}
            {relatedProviders.length > 0 && (
                <section className="container-content py-16 border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                    <h2 className="text-2xl font-display font-medium mb-8" style={{ color: 'var(--color-espresso)' }}>
                        Compare {provider.businessType || 'Providers'} in {provider.city}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedProviders.map((p) => (
                            <Link
                                key={p.id}
                                href={`/provider/${p.slug}`}
                                className="group block p-4 rounded-2xl border transition-all hover:-translate-y-1"
                                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
                            >
                                <div className="font-semibold text-sm mb-1 group-hover:text-[var(--color-gold)] transition-colors" style={{ color: 'var(--color-espresso)' }}>
                                    {p.name}
                                </div>
                                <div className="font-body text-xs" style={{ color: 'var(--color-stone)' }}>
                                    {Math.round(p.clarityScore || p.score_total || 0)}/100 Clarity Score™
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ SECTION TO BOOST WORD COUNT & SEO */}
            <section className="container-content py-16 border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
                <h2 className="text-2xl font-display font-medium mb-8" style={{ color: 'var(--color-espresso)' }}>
                    Frequently Asked Questions about {provider.name}
                </h2>

                <div className="space-y-6 max-w-3xl">
                    <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-espresso)' }}>
                            How much does Botox cost with {provider.name} in {provider.city}?
                        </h3>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Botox in {provider.city} typically costs between $12 and $16 per unit depending on the clinical setting and provider expertise. {provider.name} is assessed at a price index of {provider.price_per_unit ? '$' + provider.price_per_unit + '/unit' : 'the local average'}, reflecting the market standard for {provider.businessType || 'Aesthetic Medicine'} providers in the area. Patients should consult directly with the practice for exact quotes tailored to their treatment goals.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-espresso)' }}>
                            What is a Clarity Score™ and how did {provider.name} score?
                        </h3>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Clarity Score™ is InjectorIndex's independent rating system that evaluates providers on 5 distinct data signals: patient outcomes, medical credentials, patient reviews, practice quality, and pricing transparency. Scores range from 0-100 without any pay-to-play bias. {provider.name} currently holds a score of {scoreVal}/100, indicating their relative performance and position among verified local peers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-espresso)' }}>
                            How do I compare Botox providers in {provider.city}?
                        </h3>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            InjectorIndex lets you compare over {localProviders.length > 5 ? localProviders.length + '+' : 'several'} verified providers in {provider.city} by Clarity Score™, estimated pricing, and patient sentiments. Visit our comprehensive {provider.city} provider rankings page to explore medical credentials, before and after insights, and independent data across the state of {provider.state}.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
