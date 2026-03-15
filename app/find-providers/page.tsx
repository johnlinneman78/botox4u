import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { ProviderFilters } from '@/components/providers/ProviderFilters'
import { Button } from '@/components/ui/Button'
import { getProvidersWithSearch } from '@/lib/actions/providers'
import { GeolocationSorter } from '@/components/providers/GeolocationSorter'
import { NICHE } from '@/config/niche'
import { Dna, ShieldCheck } from 'lucide-react'
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd'
import { StaggeredGrid } from '@/components/ui/StaggeredGrid'

export const metadata: Metadata = {
    title: `Find & Compare Best ${NICHE.name} Providers | Clarity Score™ Verified`,
    description: `Compare local ${NICHE.name} providers by clinical quality and pricing. Find top-rated injectors and medspas near you with our 100% data-driven Clarity Score™ ranking.`,
    alternates: {
        canonical: 'https://www.verifiedaesthetics.com/find-providers',
    },
    openGraph: {
        title: `Find & Compare Best ${NICHE.name} Providers | Clarity Score™ Verified`,
        description: `Compare local ${NICHE.name} providers by clinical quality and pricing. Find top-rated injectors and medspas near you with our 100% data-driven Clarity Score™ ranking.`,
        url: 'https://www.verifiedaesthetics.com/find-providers',
    }
}

export default async function FindProvidersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; city?: string; state?: string; tier?: string; type?: string; view?: string; lat?: string; lng?: string }>
}) {
    const sParams = await searchParams
    const query = sParams.q || ''
    const city = sParams.city || ''
    const state = sParams.state || ''
    const tier = sParams.tier || ''
    const type = sParams.type || ''
    const view = sParams.view
    const userLat = sParams.lat ? parseFloat(sParams.lat) : undefined
    const userLng = sParams.lng ? parseFloat(sParams.lng) : undefined

    const providers = await getProvidersWithSearch({
        query,
        city,
        state,
        tier,
        type,
        view,
        userLat,
        userLng,
        sort: (userLat && userLng) ? 'distance' : undefined
    })

    const itemListSchema = generateItemListSchema(providers.slice(0, 50), city || 'All Locations')

    return (
        <div
            className="min-h-screen py-16"
            style={{ background: 'var(--color-bg)' }}
        >
            <JsonLd data={itemListSchema} />
            <div className="container mx-auto px-6">
                <div className="mb-10">
                    <Suspense fallback={null}>
                        <GeolocationSorter />
                    </Suspense>
                    <h1
                        className="text-4xl md:text-5xl font-display font-medium mb-3"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        Explore {query ? (query.charAt(0).toUpperCase() + query.slice(1)) : NICHE.name} Providers
                    </h1>
                    <p style={{ color: 'var(--color-stone)' }} className="font-body">
                        Found <span className="font-semibold" style={{ color: 'var(--color-espresso)' }}>{providers.length}</span> verified specialists for
                        <span className="font-semibold" style={{ color: 'var(--color-espresso)' }}>
                            {city || state ? ` ${city}${state ? `, ${state}` : ''}` : ` "${query || 'All Locations'}"`}
                        </span>
                    </p>
                </div>

                <Suspense fallback={<div className="h-32 bg-[var(--color-surface)] animate-pulse rounded-2xl mb-8 border border-[var(--color-border)]" />}>
                    <ProviderFilters currentCity={city} currentState={state} />
                </Suspense>

                {/* Algorithm Callout */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div
                        className="rounded-2xl p-6 flex items-start gap-4 max-w-2xl flex-1 border"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <div
                            className="p-3 rounded-xl shrink-0 border shadow-sm"
                            style={{ background: 'white', borderColor: 'var(--color-border)' }}
                        >
                            <ShieldCheck className="w-6 h-6 text-[var(--color-gold)]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[var(--color-espresso)] text-sm mb-1 uppercase tracking-tight">Clarity Score™ Ranking Algorithm</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                Our directory uses a 100% data-driven algorithm. Providers are ranked based on
                                <b style={{ color: 'var(--color-espresso)' }}> Injection Quality</b>,
                                <b style={{ color: 'var(--color-espresso)' }}> Verified Credentials</b>, and
                                <b style={{ color: 'var(--color-espresso)' }}> Clinical Innovation</b>.
                            </p>
                        </div>
                    </div>

                    {view === 'general' && (
                        <div
                            className="border rounded-2xl p-6 flex-1"
                            style={{ background: 'rgba(61, 43, 31, 0.05)', borderColor: 'var(--color-border)' }}
                        >
                            <h4 className="font-bold text-[var(--color-espresso)] text-sm mb-1 uppercase tracking-wider">General Directory Caution</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                These providers either have a <span className="font-bold" style={{ color: 'var(--color-gold)' }}>Clarity Score™: PENDING</span> or insufficient clinical data for a specialist audit. Proceed with manual verification.
                            </p>
                        </div>
                    )}
                </div>

                <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {providers.map((provider: any) => (
                        <EnhancedProviderCard key={provider.id} provider={provider} />
                    ))}
                </StaggeredGrid>

                {providers.length === 0 && (
                    <div
                        className="text-center py-20 rounded-2xl border mt-8"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <h3
                            className="text-2xl font-display font-medium mb-2"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            No results found in this area
                        </h3>
                        <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--color-stone)' }}>
                            We&apos;re constantly adding new providers. Try searching for a nearby city or check back soon!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/find-providers"
                                className="inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 border px-6 py-2.5 text-base"
                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-espresso)' }}
                            >
                                Clear Filters
                            </Link>
                            <Button variant="primary">Notify Me of Local Providers</Button>
                        </div>
                    </div>
                )}

                {/* SEO Content Section */}
                <div
                    className="mt-24 border-t pt-16"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <div className="max-w-4xl">
                        <h2
                            className="text-3xl font-display font-medium mb-10"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            How to Choose the Best Aesthetic Provider
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                <p>
                                    Selecting a clinical provider for aesthetic treatments like {NICHE.name} is a decision that should be based on medical expertise rather than sales tactics or promotional pricing. At {NICHE.siteName}, we advocate for transparency and clinical rigor in the selection process.
                                </p>
                                <p>
                                    A high-quality provider should possess not only the necessary medical certifications but also a deep understanding of facial anatomy and aesthetic harmony. This is why our Clarity Score™ system emphasizes clinical data over paid visibility.
                                </p>
                            </div>
                            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                <p>
                                    When evaluating results in cities like {city || 'New York'}, consider the provider's track record and patient feedback. Look for injectors who offer comprehensive consultations and prioritize natural-looking outcomes.
                                </p>
                                <p>
                                    Our directory is designed to help you navigate the landscape of local medical spas and dermatology clinics by providing verified pricing and credentials, empowering you to make an informed choice for your aesthetic journey.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            <h3
                                className="text-xl font-display font-medium mb-4"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                Credentials and Expertise Matter
                            </h3>
                            <p>
                                Before booking any session, it is essential to verify that your injector is a licensed medical professional, such as a Board-Certified Physician, Physician Assistant (PA), or Registered Nurse (RN) with specialized training in aesthetics. The expertise required for precise and safe injections goes beyond basic certification; it requires an artistic eye and a commitment to patient safety.
                            </p>
                            <p>
                                In addition to licensing, consider the clinic's environment and their adherence to safety protocols. A reputable clinic will always prioritize a clean, sterile environment and will be transparent about the products they use. By using the {NICHE.siteName} directory, you are accessing a curated list of providers who have been vetted through our rigorous clinical audit process.
                            </p>
                            <p>
                                We believe that patients deserve access to reliable information about aesthetic procedures. Whether you are looking for {NICHE.name}, dermal fillers, or other skin rejuvenation treatments, our goal is to connect you with the best local specialists who put patient safety and clinical excellence first.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
