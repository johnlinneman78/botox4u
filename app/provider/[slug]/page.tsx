import Link from 'next/link'
import { formatScore } from '@/lib/scoring'
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

    if (!provider) return { title: 'Injector Profile | VerifiedAesthetics' }

    // Title logic
    const fullTitle = `${provider.name} — Reviews, Pricing & Credentials | ${provider.city}, ${provider.state}`
    const shortTitle = `${provider.name} — Reviews & Pricing | ${provider.city}`
    const title = fullTitle.length > 65 ? shortTitle : fullTitle

    // Meta Description logic
    const scoreText = formatScore(provider.score_total ?? provider.clarityScore)
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
        description = `${provider.name} in ${provider.city} — Clarity Score™ ${scoreText} based on ${reviewsCount} reviews. Compare pricing, credentials, and patient ratings.`
    } else if (patternIndex === 1) {
        description = `Clarity Score™ ${scoreText} on VerifiedAesthetics. See ${provider.name}'s credentials, pricing, and ${reviewsCount} patient reviews in ${provider.city}, ${provider.state}.`
    } else {
        description = `${provider.name} — ${provider.city} ${bizType}. Clarity Score™ ${scoreText} · ${reviewsCount} reviews · Independent ratings and pricing data.`
    }

    return {
        title: title.slice(0, 70),
        description: description.slice(0, 155),
        alternates: {
            canonical: `/provider/${provider.slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/provider/${provider.slug}`,
            images: [
                {
                    url: provider.hero_image_url || provider.imageUrl || `https://www.verifiedaesthetics.com/og-default.png`,
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
            "author": { "@type": "Organization", "name": "VerifiedAesthetics Clarity Score™ Semantic Analysis" }
        }))
    }

    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: provider.city || 'Providers', item: `/${NICHE.baseSlug}/${(provider.state || 'us').toLowerCase()}/${(provider.city || '').toLowerCase().replace(/ /g, '-')}` },
        { name: provider.name || 'Provider', item: `/provider/${provider.slug || 'unknown'}` }
    ])

    const localProviders = await getProvidersWithSearch({ city: provider.city, state: provider.state, limit: 12 })
    const relatedProviders = localProviders.filter(p => p.slug !== provider.slug).slice(0, 8)

    const scoreText = formatScore(provider.score_total ?? provider.clarityScore)

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How much does Botox cost with ${provider.name} in ${provider.city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": provider.price_per_unit
                        ? `Botox with ${provider.name} in ${provider.city} is listed at $${provider.price_per_unit} per unit.`
                        : `Prices vary by clinic — ${provider.name} does not publish a per-unit price here. Ask the clinic directly for a per-unit quote tailored to your treatment goals.`
                }
            },
            {
                "@type": "Question",
                "name": `What is a Clarity Score™ and how did ${provider.name} score?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The Clarity Score™ measures how much a patient can confirm about a provider before booking: confirmed credentials (40 points), patient reviews (40), published pricing (10) and contact and booking details (10). Paid plans never change it. ${provider.name}: ${scoreText}.`
                }
            },
            {
                "@type": "Question",
                "name": `How do I compare Botox providers in ${provider.city}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `VerifiedAesthetics lets you compare over ${localProviders.length > 5 ? localProviders.length + '+' : 'several'} verified providers in ${provider.city} by Clarity Score™, estimated pricing, and patient sentiments. Visit our comprehensive ${provider.city} provider rankings page to explore credentials and independent data across the state of ${provider.state}.`
                }
            }
        ]
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)]">
            <JsonLd data={enhancedSchema} />
            {reviewSchema && <JsonLd data={reviewSchema} />}
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
                                    Clarity Score™ {formatScore(p.clarityScore ?? p.score_total)}
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
                            {provider.price_per_unit ? (
                                <>Botox with {provider.name} in {provider.city} is listed at ${provider.price_per_unit} per unit. Patients should consult directly with the practice for exact quotes tailored to their treatment goals.</>
                            ) : (
                                <>Prices vary by clinic — {provider.name} does not publish a per-unit price here. Patients should consult directly with the practice for exact quotes tailored to their treatment goals.</>
                            )}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-espresso)' }}>
                            What is a Clarity Score™ and how did {provider.name} score?
                        </h3>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            The Clarity Score™ measures how much a patient can confirm about a provider before booking: confirmed credentials (40 points), patient reviews (40), published pricing (10) and contact and booking details (10). Paid plans never change it. {provider.name}: {scoreText}. <Link href="/methodology" className="underline">How the score works</Link>.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-espresso)' }}>
                            How do I compare Botox providers in {provider.city}?
                        </h3>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            VerifiedAesthetics lets you compare over {localProviders.length > 5 ? localProviders.length + '+' : 'several'} verified providers in {provider.city} by Clarity Score™, estimated pricing, and patient sentiments. Visit our comprehensive {provider.city} provider rankings page to explore medical credentials, before and after insights, and independent data across the state of {provider.state}.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
