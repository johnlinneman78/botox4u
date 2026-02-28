import { Metadata } from 'next'
import { getStateStats, getCitiesInState } from '@/lib/actions/providers'
import { STATE_MAP, getStateName } from '@/lib/constants'
import { StateHero } from '@/components/state/StateHero'
import { CityList } from '@/components/state/CityList'
import { NICHE } from '@/config/niche'
import { notFound } from 'next/navigation'

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
            canonical: `https://www.injectorindex.com/botox/${state.toLowerCase()}`
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
        <main className="bg-white min-h-screen">
            <StateHero
                stateName={stateName}
                providerCount={stats?.providerCount || 0}
                avgCost={stats?.avgCost || 15}
                cityCount={stats?.cityCount || 0}
            />
            <CityList
                cities={cities}
                stateName={stateName}
            />
        </main>
    )
}
