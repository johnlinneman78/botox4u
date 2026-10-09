import { Metadata } from 'next'
import { formatScore } from '@/lib/scoring'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, STATE_MAP, TREATMENTS } from '@/lib/constants'
import { CityStats } from '@/components/city/CityStats'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { CityFAQ } from '@/components/city/CityFAQ'
import { PriceMeter } from '@/components/city/PriceMeter'
import { PromoteClinicCard } from '@/components/providers/PromoteClinicCard'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { CityHero } from '@/components/city/CityHero'
import Hero from '@/components/Hero'
import CityMap from '@/components/CityMap'
import { LeadForm } from '@/components/providers/LeadForm'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd, generateBreadcrumbSchema, generateItemListSchema, generateFAQPageSchema } from '@/components/seo/JsonLd'
import { GeolocationSorter } from '@/components/providers/GeolocationSorter'
import { Suspense } from 'react'
import { QuizBanner } from '@/components/lead-funnel/QuizBanner'

interface CityPageProps {
    params: Promise<{ state: string; city: string }>
    searchParams?: Promise<{ lat?: string; lng?: string }>
}

export async function generateStaticParams() {
    return NICHE.cities.map((cityObj) => {
        const parts = cityObj.slug.split('/')
        return {
            state: parts[0],
            city: parts[1]
        }
    })
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { state, city } = await params
    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const stateCode = state.toUpperCase()
    const stateName = STATE_MAP[stateCode] || stateCode

    const now = new Date()
    const month = now.toLocaleString('en-US', { month: 'long' })
    const year = now.getFullYear()
    const providers = await getProvidersWithSearch({ city: cityName, state: stateCode })
    const providerCount = providers.length > 0 ? providers.length : 'top'
    const avgPrice = providers.map(p => p.price_per_unit).filter(Boolean)[0]
    const title = `Botox in ${cityName}, ${stateCode}: Prices & Verified Injectors (${year})`
    const description = avgPrice
        ? `Compare ${providerCount} Botox & filler injectors in ${cityName}. See price per unit (from $${avgPrice}), confirmed credentials and patient reviews side by side. No paid placement. Updated ${month} ${year}.`
        : `Compare ${providerCount} Botox & filler injectors in ${cityName}, ${stateCode}. Confirmed credentials, published pricing and patient reviews side by side. No paid placement. Updated ${month} ${year}.`
    const url = `/${NICHE.baseSlug}/${state.toLowerCase()}/${city.toLowerCase()}`

    return {
        title: title.slice(0, 70),
        description: description.slice(0, 155),
        openGraph: {
            title,
            description,
            url,
            siteName: 'VerifiedAesthetics',
            type: 'website',
        },
        alternates: {
            canonical: url
        }
    }
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
    const sParams = await searchParams
    const userLat = sParams?.lat ? parseFloat(sParams.lat) : undefined
    const userLng = sParams?.lng ? parseFloat(sParams.lng) : undefined
    const { state, city } = await params

    const stateCode = state.toUpperCase()
    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const stateName = STATE_MAP[stateCode] || stateCode

    const providers = await getProvidersWithSearch({
        city: cityName,
        state: stateCode,
        userLat,
        userLng
    })
    const stats = await getCityStats(cityName)
    const nearbyCities = await getNearbyCities(cityName, stateCode)
    const stateSlug = REVERSE_STATE_MAP[stateCode]

    if (!providers.length && !stats) {
        notFound()
    }

    const mapProviders = providers.map((p: any) => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        slug: p.slug,
        listingTier: p.listingTier,
        rating: p.averageRating,
        clarityScore: p.clarityScore ?? p.score_total ?? null
    }));

    const itemListSchema = generateItemListSchema(providers.slice(0, 50), cityName)
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Directory', item: `/${NICHE.baseSlug}` },
        { name: stateSlug || stateCode, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}` },
        { name: cityName, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}` }
    ])

    const avg = stats?.avgCost || 15;
    const faqSchema = generateFAQPageSchema(
        cityName,
        stateCode,
        stats?.avgCost ? stats.avgCost - 2 : (NICHE.priceRange.min + 2),
        stats?.avgCost ? stats.avgCost + 2 : (NICHE.priceRange.max - 2),
        providers.length
    )

    return (
        <main
            className="min-h-screen pb-24"
            style={{ background: 'var(--color-bg)' }}
        >
            <Suspense fallback={null}>
                {/* GeolocationSorter removed from city pages to prevent unintended redirects */}
            </Suspense>
            <JsonLd data={itemListSchema} />
            <JsonLd data={breadcrumbs} />
            <JsonLd data={faqSchema} />

            <div
                className="border-b"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--color-stone)' }}>
                    <Link href="/" className="hover:text-[var(--color-espresso)] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/${NICHE.baseSlug}`} className="hover:text-[var(--color-espresso)] transition-colors">Directory</Link>
                    <span>/</span>
                    {stateSlug && (
                        <>
                            <Link href={`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`} className="hover:text-[var(--color-espresso)] transition-colors capitalize">
                                {stateSlug.replace(/-/g, ' ')}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span style={{ color: 'var(--color-espresso)' }}>{cityName}</span>
                </div>
            </div>

            <CityHero
                city={cityName}
                state={stateCode}
                treatmentName={NICHE.name}
                providerCount={providers.length}
            />
            {/* Optimized SEO Summary — Unique & Minimal */}
            <div className="container-content mt-6 mb-2">
                <div className="max-w-3xl">
                    <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                        Our {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} report for {cityName} analyzes {providers.length} aesthetic clinics to determine clinical quality without paid orientation.
                        Each provider is audited for credentialing and pricing transparency.
                        {stats?.avgCost ? ` Local market analysis shows average pricing in ${cityName} is currently $${stats.avgCost} per unit.` : ''}
                    </p>
                </div>
            </div>

            <div className="container-content -mt-16 relative z-20">
                {stats && (
                    <CityStats
                        city={cityName}
                        avgCost={stats.avgCost}
                        providerCount={stats.providerCount}
                        avgRating={stats.avgRating}
                    />
                )}

                <div className="mt-10 rounded-3xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
                    <CityMap
                        providers={mapProviders}
                        citySlug={`${city}-${state.toLowerCase()}`}
                        userLat={userLat}
                        userLng={userLng}
                    />
                </div>

                <div className="mt-12 mb-16">
                    <PriceMeter
                        avgCost={stats?.avgCost || 15}
                        city={cityName}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2" id="listings">
                        <div className="flex justify-between items-center mb-8">
                            <h2
                                className="text-3xl font-display font-medium"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                Verified Providers in {cityName}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {providers.length > 0 ? (
                                providers.slice(0, 100).map((provider: any) => (
                                    <EnhancedProviderCard key={provider.id} provider={provider} />
                                ))
                            ) : (
                                <div
                                    className="p-16 text-center rounded-3xl border shadow-sm"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                >
                                    <h3
                                        className="text-2xl font-display font-medium mb-4"
                                        style={{ color: 'var(--color-espresso)' }}
                                    >
                                        Verifying Providers in {cityName}
                                    </h3>
                                    <p className="max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                        We're currently verifying pricing and clinical credentials for clinics in {cityName}. Check back soon for the full report.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-20">
                            <CostComparisonTable
                                id="pricing-guide"
                                title={`Typical ${NICHE.name} Costs in ${cityName} by Area`}
                                rows={NICHE.calculator.treatmentAreas.map(area => ({
                                    label: area.label,
                                    units: `${area.minUnits || area.defaultUnits}-${area.maxUnits || area.defaultUnits * 1.5} Units`,
                                    costRange: `$${(stats?.avgCost || 14) * (area.minUnits || area.defaultUnits)} - $${(stats?.avgCost || 14) * (area.maxUnits || area.defaultUnits * 1.5)}`,
                                    notes: area.description || ''
                                }))}
                                footer={`*Pricing estimates in ${cityName} are based on a local average of $${stats?.avgCost || 14}/${NICHE.priceUnit.split(' ').slice(-1)}.`}
                            />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <LeadForm
                            city={cityName}
                            state={stateCode}
                            providerName={`Providers in ${cityName}`}
                        />
                        <PromoteClinicCard city={cityName} />
                    </div>
                </div>

                <div className="mt-24 mb-16">
                    <QuizBanner city={cityName} />
                </div>

                <div className="mt-24 mb-16">
                    <h2
                        className="text-2xl font-display font-medium mb-10"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        Explore Nearby Cities
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                        {nearbyCities.map((city) => (
                            <Link
                                key={city.city}
                                href={`/${NICHE.baseSlug}/${city.state.toLowerCase()}/${city.city.toLowerCase().replace(/\s+/g, '-')}`}
                                className="p-6 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-1"
                                style={{
                                    background: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)'
                                }}
                            >
                                <div className="font-bold text-sm mb-1" style={{ color: 'var(--color-espresso)' }}>{city.city}</div>
                                <div className="text-xs" style={{ color: 'var(--color-stone)' }}>{city.count} {city.count === 1 ? 'Clinic' : 'Clinics'}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-24">
                    <CityFAQ city={cityName} avgCost={stats?.avgCost || 14} />
                </div>

                {/* City Market Intelligence */}
                <section
                    className="mt-24 rounded-3xl border p-8 md:p-16 shadow-sm overflow-hidden relative"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                    <div
                        className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.1] blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ background: 'var(--color-blush)' }}
                    />

                    <div className="text-center mb-12 relative z-10">
                        <p
                            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                            style={{ color: 'var(--color-gold)' }}
                        >
                            Market Intelligence
                        </p>
                        <h2
                            className="text-4xl font-display font-medium"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            {cityName} Aesthetic Market Report: 2026
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                <p>
                                    {cityName} has <strong style={{ color: 'var(--color-espresso)' }}>{providers.length}+ verified aesthetic injectors</strong> on VerifiedAesthetics,
                                    with an average Botox price of <strong style={{ color: 'var(--color-espresso)' }}>${stats?.avgCost || 14} per unit</strong> as of {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.
                                </p>
                                <p>
                                    {(stats?.avgCost || 14) > 15
                                        ? ` This places ${cityName} above the national average, reflecting the city's premium aesthetic market and concentration of board-certified specialists.`
                                        : (stats?.avgCost || 14) < 13
                                            ? ` This is below the national average, making ${cityName} one of the more accessible major markets for cosmetic injectables.`
                                            : ` This is consistent with national pricing trends, ensuring a healthy balance of premium clinical options and competitive rates.`
                                    }
                                </p>
                            </div>

                            <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                <p>
                                    A typical treatment session for the upper face (30–50 units) in {cityName} currently ranges from
                                    <strong style={{ color: 'var(--color-espresso)' }}> ${Math.round((stats?.avgCost || 14) * 30)} to ${Math.round((stats?.avgCost || 14) * 50)}</strong>.
                                </p>
                                <p>
                                    Our rankings show a high adoption rate of clinical innovations like Daxxify (for longevity) and biostimulators like Sculptra among {cityName}'s top-tier injectors.
                                </p>
                            </div>
                        </div>

                        {providers.length > 0 && (
                            <div className="pt-10 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <h3
                                    className="text-xl font-display font-medium mb-6"
                                    style={{ color: 'var(--color-espresso)' }}
                                >
                                    Top Clinical Rankings in {cityName}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {providers.slice(0, 4).map((p: any) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between p-4 rounded-xl border bg-white"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <Link href={`/provider/${p.slug}`} className="font-semibold text-sm hover:text-[var(--color-gold)] transition-colors">
                                                {p.name}
                                            </Link>
                                            <div className="text-xs font-bold" style={{ color: 'var(--color-gold)' }}>
                                                Score: {formatScore(p.clarityScore ?? p.score_total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex flex-wrap gap-6 justify-center">
                            <Link href="/blog/pricing-report-2026" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                📊 Full Pricing Report →
                            </Link>
                            <Link href="/methodology" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                📐 Selection Methodology →
                            </Link>
                            <Link href="/blog/best-injectors-guide" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                🔍 Patient Safe Guide →
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="mt-24 pt-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div
                        className="text-xl font-display font-medium mb-8"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        Complete Provider Directory: {cityName}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {providers.map((p: any) => (
                            <Link
                                key={`dir-${p.id}`}
                                href={`/provider/${p.slug}`}
                                className="text-sm hover:text-[var(--color-gold)] transition-colors truncate font-medium"
                                style={{ color: 'var(--color-stone)' }}
                            >
                                {p.name}
                            </Link>
                        ))}
                    </div>
                    {providers.length === 0 && (
                        <p className="text-sm italic" style={{ color: 'var(--color-stone)' }}>No additional providers found in {cityName} at this time.</p>
                    )}
                    <p className="mt-12 text-[10px] uppercase tracking-wider leading-relaxed max-w-2xl" style={{ color: 'var(--color-taupe)' }}>
                        This directory includes all observed and elite injectors in the {cityName} area. We continuously audit and add new clinics based on clinical excellence and pricing transparency.
                    </p>
                </div>

                {NICHE.cities.filter(c => c.slug.startsWith(state.toLowerCase() + '/') && c.slug !== `${state.toLowerCase()}/${city.toLowerCase()}`).length > 0 && (
                    <div className="mt-16 pt-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <h2 className="text-xl font-display font-medium mb-6" style={{ color: 'var(--color-espresso)' }}>
                            Nearby Cities in {stateName}
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {NICHE.cities
                                .filter(c => c.slug.startsWith(state.toLowerCase() + '/') && c.slug !== `${state.toLowerCase()}/${city.toLowerCase()}`)
                                .map(c => {
                                    const cName = c.slug.split('/')[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                    return (
                                        <Link
                                            key={c.slug}
                                            href={`/${NICHE.baseSlug}/${c.slug}`}
                                            className="px-4 py-2 border rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-stone)' }}
                                        >
                                            Botox in {cName}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <MedicalDisclaimer />
                </div>
            </div>
        </main>
    )
}
