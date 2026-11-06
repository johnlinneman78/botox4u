import { Metadata } from 'next'
import { getProvidersWithSearch, getCityStats, getNearbyCities } from '@/lib/actions/providers'
import { REVERSE_STATE_MAP, STATE_MAP } from '@/lib/constants'
import { CostComparisonTable } from '@/components/seo/CostComparisonTable'
import { CityFAQ } from '@/components/city/CityFAQ'
import { PromoteClinicCard } from '@/components/providers/PromoteClinicCard'
import { CityProviderList } from '@/components/city/CityProviderList'
import CityMap from '@/components/CityMap'
import { LeadForm } from '@/components/providers/LeadForm'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd, generateBreadcrumbSchema, generateItemListSchema, generateFAQPageSchema } from '@/components/seo/JsonLd'
import { Suspense } from 'react'
import { PriceWidget } from '@/components/price-pool/PriceWidget'
import { PriceReportWidget } from '@/components/providers/PriceReportWidget'
import { DividerPhoto } from '@/components/redesign/DividerPhoto'
import { orderFeaturedFirst, splitFeatured } from '@/lib/featured-listings'
import { PriceReportStickyBar } from '@/components/providers/PriceReportStickyBar'

// City page — Catchafire-style redesign (Nov 6, 2026, branch
// va/redesign-catchafire-v4). Same live data and flows as before, new
// layout from the redesign preview: split hero with a live stats card,
// filter pills, one lounge divider before the provider list, text-only
// provider cards, a full quote form wired to the leads table, a price
// panel driven by real ranges (never hardcoded figures), a pricing
// divider, then "What did you pay" with the real report widget.
//
// The preview's Atlanta figures ($10.00 from, $12.00 most common) are
// NOT used here: they came from a task brief and clash with the live
// page ("No clinic in Atlanta has published a price yet"). The stats
// card below shows only live data: provider count, average rating, and
// a published-price average only when one actually exists.

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
    // Zero-click, high-impression search terms (Oct 2026 Search Console):
    // "botox houston" 183 impressions / 0 clicks, "botox chicago" 155 / 0,
    // plus the Nov 3 3-month export: Los Angeles, New York, Miami,
    // Nashville, Dallas, Atlanta, Boston all at position 40+ with
    // thousands of impressions. Front-load the exact search phrase
    // in the title for all of them and lead the description with the
    // price-transparency hook that already works elsewhere in search.
    // No price is invented: with no real price pool yet, the copy
    // promises comparison and credentials, not a rate.
    const isZeroClickCity = ['Houston', 'Chicago', 'Los Angeles', 'New York', 'Miami', 'Nashville', 'Dallas', 'Atlanta', 'Boston'].includes(cityName)
    const title = isZeroClickCity
        ? `Botox ${cityName}: Prices & Injectors (${year})`
        : `Botox in ${cityName}, ${stateCode}: Prices & Injectors (${year})`
    const description = isZeroClickCity
        ? `Botox in ${cityName}, ${stateCode}. Compare injectors, confirmed credentials and published pricing side by side. Sponsored placements are clearly labeled. Updated ${month} ${year}.`
        : avgPrice
            ? `Compare ${providerCount} Botox & filler injectors in ${cityName}. See price per unit (from $${avgPrice}), confirmed credentials and patient reviews side by side. Sponsored placements are clearly labeled. Updated ${month} ${year}.`
            : `Compare ${providerCount} Botox & filler injectors in ${cityName}, ${stateCode}. Confirmed credentials, published pricing and patient reviews side by side. Sponsored placements are clearly labeled. Updated ${month} ${year}.`
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

    const itemListSchema = generateItemListSchema(orderFeaturedFirst(providers).slice(0, 50), cityName)
    // Sponsored section + unpaid list (see lib/featured-listings.ts):
    // featured providers render above the unpaid results in their own
    // labeled section, never mixed into the ranked order. The unpaid
    // list keeps its independent order from the query.
    const { featured: featuredProviders, rest: unpaidProviders } = splitFeatured(providers)
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Directory', item: `/${NICHE.baseSlug}` },
        { name: stateSlug || stateCode, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}` },
        { name: cityName, item: `/${NICHE.baseSlug}/${stateCode.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}` }
    ])

    const faqSchema = generateFAQPageSchema(
        cityName,
        stateCode,
        stats?.avgCost != null ? stats.avgCost - 2 : null,
        stats?.avgCost != null ? stats.avgCost + 2 : null,
        providers.length
    )

    const hasPublishedPrice = stats?.avgCost != null

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

            <div className="container-content">
                <p className="text-[13px] pt-6" style={{ color: 'var(--color-stone)' }}>
                    <Link href="/" className="hover:underline">Home</Link>
                    {' / '}
                    <Link href={`/${NICHE.baseSlug}`} className="hover:underline">Directory</Link>
                    {' / '}
                    {stateSlug && (
                        <>
                            <Link href={`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`} className="hover:underline capitalize">
                                {stateSlug.replace(/-/g, ' ')}
                            </Link>
                            {' / '}
                        </>
                    )}
                    <span style={{ color: 'var(--color-espresso)' }}>{cityName}</span>
                </p>

                {/* Hero + stats card: live numbers only. No hardcoded
                    market figures. When no clinic in this city has
                    published a price, the card says so instead of
                    inventing a rate. */}
                <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-11 items-start pt-6 pb-2">
                    <div>
                        <p
                            className="text-[11px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: 'var(--color-gold)' }}
                        >
                            {cityName}, {stateCode} · Regional guide
                        </p>
                        <h1
                            className="font-display font-bold mt-3.5 mb-4"
                            style={{ fontSize: 'clamp(40px, 5vw, 58px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                        >
                            Best Botox and filler providers in {cityName}, {stateCode}
                        </h1>
                        <p className="text-[18px] max-w-[36rem]" style={{ color: 'var(--color-stone)', lineHeight: 1.6 }}>
                            Compare {providers.length} providers across {cityName}. Unpaid results are ranked by Clarity Score. Sponsored placement never changes that order.
                        </p>
                    </div>
                    <aside
                        className="bg-white border rounded-[16px] p-6 md:p-7"
                        style={{ borderColor: 'var(--color-border)' }}
                        aria-label={`${cityName} at a glance`}
                    >
                        <h2
                            className="font-display font-bold mb-4"
                            style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                        >
                            {cityName} at a glance
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <b
                                    className="block font-display font-bold"
                                    style={{ fontSize: '30px', lineHeight: 1.1, color: 'var(--color-espresso)' }}
                                >
                                    {providers.length}
                                </b>
                                <span className="text-[13px]" style={{ color: 'var(--color-stone)' }}>providers listed</span>
                            </div>
                            <div>
                                <b
                                    className="block font-display font-bold"
                                    style={{ fontSize: '30px', lineHeight: 1.1, color: 'var(--color-espresso)' }}
                                >
                                    {stats?.avgRating != null ? stats.avgRating.toFixed(1) : 'n/a'} / 5
                                </b>
                                <span className="text-[13px]" style={{ color: 'var(--color-stone)' }}>average rating</span>
                            </div>
                            <div>
                                <b
                                    className="block font-display font-bold"
                                    style={{ fontSize: '30px', lineHeight: 1.1, color: 'var(--color-espresso)' }}
                                >
                                    {hasPublishedPrice ? `$${stats!.avgCost}` : 'Not published'}
                                </b>
                                <span className="text-[13px]" style={{ color: 'var(--color-stone)' }}>
                                    {hasPublishedPrice ? 'average, per unit' : 'price, per unit'}
                                </span>
                            </div>
                        </div>
                        <p
                            className="text-[13px] mt-4 pt-3.5 border-t"
                            style={{ color: 'var(--color-stone)', borderColor: 'var(--color-border)' }}
                        >
                            {hasPublishedPrice
                                ? 'Market figures from VerifiedAesthetics data.'
                                : `No ${cityName} clinic has published a per-unit price on its own listing yet.`}
                        </p>
                    </aside>
                </section>

                <div className="mt-10 rounded-3xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
                    <CityMap
                        providers={mapProviders}
                        citySlug={`${city}-${state.toLowerCase()}`}
                        userLat={userLat}
                        userLng={userLng}
                    />
                </div>

                <PriceReportStickyBar city={cityName} />

                {/* Provider list: filter pills, lounge divider, text-only cards */}
                <div id="listings" className="mt-12 scroll-mt-24">
                    <CityProviderList
                        city={cityName}
                        featured={featuredProviders}
                        unpaid={unpaidProviders}
                        cityAvgCost={stats?.avgCost ?? null}
                        divider={{
                            src: '/images/redesign/clinic-lounge.webp',
                            alt: 'Warm, bright med spa reception lounge',
                            caption: 'Bright, calm clinic spaces set the tone.',
                        }}
                    />
                </div>

                {/* Request a quote: the full form, wired to the real leads
                    table through LeadForm. Requests are held in John's
                    queue and reviewed before forwarding, never auto-sent. */}
                <section className="mt-16">
                    <p
                        className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                        style={{ color: 'var(--color-gold)' }}
                    >
                        Request a quote
                    </p>
                    <LeadForm
                        city={cityName}
                        state={stateCode}
                        providerName={`Providers in ${cityName}`}
                        providerOptions={providers.map((p: any) => ({ id: p.id, name: p.name }))}
                        showMessage
                        title={`Get a price from a clinic in ${cityName}.`}
                        subtitle="Tell us what you want and we pass it to the clinic."
                        submitLabel="Send my quote request"
                    />
                </section>

                {/* Price panel: the real range when the pool has one, or an
                    honest empty state when it does not. Never a hardcoded
                    figure. */}
                <section className="mt-16">
                    <p
                        className="text-[11px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: 'var(--color-gold)' }}
                    >
                        Botox in {cityName}
                    </p>
                    <h2
                        className="font-display font-bold mt-3 mb-3"
                        style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                    >
                        What Botox costs in {cityName} right now.
                    </h2>
                    <p className="text-[16px] max-w-[40rem] mb-8" style={{ color: 'var(--color-stone)' }}>
                        {hasPublishedPrice
                            ? `Clinics in ${cityName} publish per-unit prices, and patients report what they paid. Together that is the real price picture here.`
                            : `No ${cityName} clinic has published a per-unit price on its own listing yet. That is why the patient-reported range matters. It is the only real price data here until clinics publish.`}
                    </p>
                    <PriceWidget
                        cities={NICHE.cities}
                        fixedCity={{ name: cityName, state: stateCode, slug: `${state.toLowerCase()}/${city.toLowerCase()}` }}
                        initialAvgCost={stats?.avgCost ?? null}
                        initialProviderCount={stats?.providerCount ?? providers.length}
                    />

                    <div className="mt-16">
                        <CostComparisonTable
                            id="pricing-guide"
                            title={`Typical ${NICHE.name} Costs in ${cityName} by Area`}
                            rows={NICHE.calculator.treatmentAreas.map(area => ({
                                label: area.label,
                                units: `${area.minUnits || area.defaultUnits}-${area.maxUnits || area.defaultUnits * 1.5} Units`,
                                costRange: stats?.avgCost != null
                                    ? `$${stats.avgCost * (area.minUnits || area.defaultUnits)} - $${stats.avgCost * (area.maxUnits || area.defaultUnits * 1.5)}`
                                    : 'Price not published',
                                notes: area.description || ''
                            }))}
                            footer={stats?.avgCost != null
                                ? `*Pricing estimates in ${cityName} are based on a local average of $${stats.avgCost}/${NICHE.priceUnit.split(' ').slice(-1)}.`
                                : `*No clinic in ${cityName} has published a price yet. Ask clinics for a per-unit quote.`}
                        />
                    </div>
                </section>

                <DividerPhoto
                    src="/images/redesign/pricing-discussion.webp"
                    alt="Patient looking at a treatment menu on a tablet in a clinic reception area"
                    caption="The menu, with the price next to it."
                />

                {/* What did you pay: 3 steps + the real report widget */}
                <section className="mt-4">
                    <div className="max-w-[640px] mb-8">
                        <p
                            className="text-[11px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: 'var(--color-gold)' }}
                        >
                            Patient reported · Botox in {cityName}
                        </p>
                        <h2
                            className="font-display font-bold mt-3 mb-3"
                            style={{ fontSize: 'clamp(30px, 3.8vw, 42px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                        >
                            What did you pay in {cityName}?
                        </h2>
                        <p className="text-[17px]" style={{ color: 'var(--color-stone)' }}>
                            Your report is the price data. We publish a range at 20 reports, and a full range at 100. No single report is ever shown on its own.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                        {[
                            { step: 'Step 1', title: 'You report', text: 'What you paid, per unit. About 30 seconds.' },
                            { step: 'Step 2', title: 'We combine', text: 'Your report goes to a review queue. We publish only combined ranges.' },
                            { step: 'Step 3', title: 'Everyone can see', text: 'The next patient sees real ranges before booking, and clinics feel the pressure to publish.' },
                        ].map((s) => (
                            <div
                                key={s.step}
                                className="bg-white border rounded-[16px] p-6"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <p
                                    className="text-[12px] font-bold uppercase tracking-[0.1em]"
                                    style={{ color: 'var(--color-gold)' }}
                                >
                                    {s.step}
                                </p>
                                <h3
                                    className="font-display font-bold my-2"
                                    style={{ fontSize: '23px', color: 'var(--color-espresso)' }}
                                >
                                    {s.title}
                                </h3>
                                <p className="text-[15px]" style={{ color: 'var(--color-stone)' }}>{s.text}</p>
                            </div>
                        ))}
                    </div>
                    <PriceReportWidget initialCity={cityName} initialTreatment="botox" />
                    <p className="text-[13px] mt-3" style={{ color: 'var(--color-stone)' }}>
                        Anonymous. Only combined ranges ever publish, never a single report.
                    </p>
                </section>

                {/* Claim panel + nearby cities */}
                <section className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <PromoteClinicCard city={cityName} />
                        <div
                            className="bg-white border rounded-[16px] p-7"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <h3
                                className="font-display font-bold mb-2.5"
                                style={{ fontSize: '26px', color: 'var(--color-espresso)' }}
                            >
                                Explore nearby cities
                            </h3>
                            <ul className="flex flex-col">
                                {nearbyCities.map((nearby) => (
                                    <li key={nearby.city}>
                                        <Link
                                            href={`/${NICHE.baseSlug}/${nearby.state.toLowerCase()}/${nearby.city.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="flex justify-between items-baseline py-2.5 border-b last:border-b-0"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <b className="font-display" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>{nearby.city}</b>
                                            <span className="text-sm" style={{ color: 'var(--color-stone)' }}>{nearby.count} {nearby.count === 1 ? 'clinic' : 'clinics'}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="mt-16">
                    {stats?.avgCost != null && (
                        <CityFAQ city={cityName} avgCost={stats.avgCost} />
                    )}
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
                                    {cityName} has <strong style={{ color: 'var(--color-espresso)' }}>{providers.length} aesthetic providers listed</strong> on VerifiedAesthetics
                                    {stats?.avgCost != null ? (
                                        <>, with an average Botox price of <strong style={{ color: 'var(--color-espresso)' }}>${stats.avgCost} per unit</strong> as of {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.</>
                                    ) : (
                                        <>. No clinic in {cityName} has published a Botox price yet.</>
                                    )}
                                </p>
                            </div>

                            <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                {stats?.avgCost != null && (
                                    <p>
                                        A typical treatment session for the upper face (30–50 units) in {cityName} currently ranges from
                                        <strong style={{ color: 'var(--color-espresso)' }}> ${Math.round(stats.avgCost * 30)} to ${Math.round(stats.avgCost * 50)}</strong>.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-6 justify-center">
                            <Link href="/blog/pricing-report-2026" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                📊 Full Pricing Report →
                            </Link>
                            <Link href="/methodology" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                📐 Selection Methodology →
                            </Link>
                            <Link href="/blog/how-to-find-good-botox-injector" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--color-stone)' }}>
                                🔍 Patient Safe Guide →
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="mt-16">
                    <MedicalDisclaimer />
                </div>
            </div>
        </main>
    )
}
