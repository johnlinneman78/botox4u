import { STATE_MAP, getStateName } from '@/lib/constants'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { NICHE } from '@/config/niche'

export const dynamic = 'force-dynamic'

interface StatePageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
    const resolvedParams = await params
    const slug = resolvedParams.slug.toLowerCase()

    const stateCode = STATE_MAP[slug]
    if (stateCode) {
        const stateName = getStateName(stateCode)
        return {
            title: `Best ${NICHE.name} Providers in ${stateName} | Compare Costs & Reviews`,
            description: `Find top-rated ${NICHE.name} providers and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in every major city.`,
            alternates: {
                canonical: `${NICHE.baseUrl}/${NICHE.baseSlug}/${stateCode.toLowerCase()}`
            }
        }
    }

    if (Object.values(STATE_MAP).includes(slug.toUpperCase())) {
        const stateName = getStateName(slug.toUpperCase())
        return {
            title: `Best ${NICHE.name} Providers in ${stateName} | Compare Costs & Reviews`,
            description: `Find top-rated ${NICHE.name} providers and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in every major city.`,
            alternates: {
                canonical: `${NICHE.baseUrl}/${NICHE.baseSlug}/${slug.toLowerCase()}`
            }
        }
    }

    return { title: 'Location Not Found' }
}

export default async function StatePage({ params }: StatePageProps) {
    const resolvedParams = await params
    const slug = resolvedParams.slug.toLowerCase()

    // Redirect /injectors/state/new-york -> /injectors/ny
    const stateCode = STATE_MAP[slug]
    if (stateCode) {
        redirect(`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`)
    }

    // Redirect /injectors/state/ny -> /injectors/ny
    if (Object.values(STATE_MAP).includes(slug.toUpperCase())) {
        redirect(`/${NICHE.baseSlug}/${slug.toLowerCase()}`)
    }

    notFound()
}
