import { Metadata } from 'next'
import { Suspense } from 'react'
import { getStateStats, getCitiesInState } from '@/lib/actions/providers'
import { STATE_MAP, getStateName } from '@/lib/constants'
import { StateHero } from '@/components/state/StateHero'
import { CityList } from '@/components/state/CityList'
import { NICHE } from '@/config/niche'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface StatePageProps {
    params: Promise<{ state: string }>
}

export async function generateStaticParams() {
    return Object.values(STATE_MAP).map(s => ({
        state: s.toLowerCase()
    }))
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
    const { state } = await params
    const stateCode = state.toUpperCase()
    if (!Object.values(STATE_MAP).includes(stateCode)) return { title: 'Not Found' }

    const stateName = getStateName(stateCode)
    const cities = await getCitiesInState(stateCode)

    const indexing = cities.length > 0
        ? { index: true, follow: true }
        : { index: false, follow: true }

    return {
        title: `Botox Providers in ${stateName} | VerifiedAesthetics`,
        description: `Find top-rated Botox providers in ${stateName}. Browse by city, compare Clarity Scores™, and read verified patient reviews.`,
        alternates: {
            canonical: `/${NICHE.baseSlug}/${state.toLowerCase()}`
        },
        robots: indexing
    }
}

export default async function StatePage({ params }: StatePageProps) {
    const { state } = await params
    const stateCode = state.toUpperCase()

    if (!Object.values(STATE_MAP).includes(stateCode)) {
        notFound()
    }

    const stateName = getStateName(stateCode)
    const stats = await getStateStats(stateCode)
    const cities = await getCitiesInState(stateCode)

    return (
        <main
            className="min-h-screen pb-24"
            style={{ background: 'var(--color-bg)' }}
        >
            <div
                className="border-b"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--color-stone)' }}>
                    <Link href="/" className="hover:text-[var(--color-espresso)] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/${NICHE.baseSlug}`} className="hover:text-[var(--color-espresso)] transition-colors">Directory</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--color-espresso)' }}>{stateName}</span>
                </div>
            </div>
            <Suspense fallback={null}>
                <StateHero
                    stateName={stateName}
                    providerCount={stats?.providerCount || 0}
                    avgCost={stats?.avgCost ?? null}
                    cityCount={stats?.cityCount || 0}
                />
            </Suspense>
            <div className="container-content space-y-16">
                <CityList
                    cities={cities}
                    stateName={stateName}
                />

                {cities.length > 0 && (
                    <section className="bg-white/50 border border-[var(--color-border)] rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-display font-medium text-[var(--color-espresso)] mb-6">
                            The {stateName} Aesthetic Market: 2026 Analysis
                        </h2>

                        <div className="prose prose-lg prose-stone max-w-none text-[var(--color-stone)] leading-relaxed font-body">
                            <p>
                                The demand for high-quality aesthetic injectables in {stateName} has evolved significantly. Patients are increasingly prioritizing preventative treatments and natural-looking results over the heavy modifications of the past. This shift requires injectors who possess not only exceptional technical skill but also a refined artistic eye. In major metropolitan areas across {stateName}, medical spas, dermatology clinics, and independent aesthetic practices have expanded their offerings to include advanced neuromodulators like Daxxify and a wider array of biostimulatory treatments.
                            </p>
                            <p>
                                Pricing for Botox and dermal fillers in {stateName} varies widely based on geographic location, practitioner credentials, and the overall clinical environment. While initial cost is a factor, our data consistently shows that prioritizing a board-certified professional or a highly specialized registered nurse yields superior long-term outcomes. The Clarity Score™ system was developed specifically to help patients navigate this complex landscape. By analyzing clinical safety records, patient outcome consistency, and the transparency of pricing models, VerifiedAesthetics surfaces the most reliable practitioners in {stateName}.
                            </p>
                            <p>
                                When evaluating a Botox provider in {stateName}, it's essential to look beyond marketing claims. A high Clarity Score™ indicates a clinic that maintains rigorous medical standards while delivering the nuanced, undetectable enhancements that define modern aesthetic medicine. Whether you reside in the state's largest city or a growing suburban community, our verified directory connects you with professionals who understand facial anatomy, prioritize patient safety above all else, and consistently achieve beautiful, harmonious results. Our 2026 data continues to monitor market shifts, ensuring that you have access to the most accurate and up-to-date provider intelligence available.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}
