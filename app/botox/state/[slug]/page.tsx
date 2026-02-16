import { getStateStats, getCitiesInState } from '@/lib/actions/providers'
import { StateHero } from '@/components/state/StateHero'
import { CityList } from '@/components/state/CityList'
import { STATE_MAP, getStateName } from '@/lib/constants'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface StatePageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
    const resolvedParams = await params
    const slug = resolvedParams.slug.toLowerCase()
    const stateCode = STATE_MAP[slug]

    if (!stateCode) return { title: 'State Not Found' }

    const stateName = getStateName(stateCode)

    return {
        title: `Best Botox Providers in ${stateName} | Compare Costs & Reviews`,
        description: `Find top-rated Botox injectors and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in every major city.`,
    }
}

export default async function StatePage({ params }: StatePageProps) {
    const resolvedParams = await params
    const slug = resolvedParams.slug.toLowerCase()
    const stateCode = STATE_MAP[slug]

    if (!stateCode) {
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

            <section className="bg-gray-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
                            Botox Regulations & Safety in {stateName}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Licensing Requirements</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    In {stateName}, Botox injections must typically be performed by a licensed medical professional. This includes Medical Doctors (MDs), Registered Nurses (RNs) under supervision, and Physician Assistants (PAs). Always verify the credentials of your injector before treatment.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Patient Safety Tips</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    When looking for Botox in {stateName}, ensure the facility is medical-grade. Avoid "Botox parties" in non-clinical settings. A reputable provider will always conduct a full consultation and explain the risks and rewards of the treatment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
