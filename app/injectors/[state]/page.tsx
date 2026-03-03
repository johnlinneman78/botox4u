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
    return {
        title: `${stateName} ${NICHE.name} Providers | Costs & Reviews`,
        description: `Find top-rated ${NICHE.name} providers and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in major cities.`,
        alternates: {
            canonical: `https://www.injectorindex.com/${NICHE.baseSlug}/${state.toLowerCase()}`
        }
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
                    avgCost={stats?.avgCost || 15}
                    cityCount={stats?.cityCount || 0}
                />
            </Suspense>
            <div className="container-content">
                <CityList
                    cities={cities}
                    stateName={stateName}
                />
            </div>
        </main>
    )
}
