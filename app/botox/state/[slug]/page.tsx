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

    // If it's a known state name (e.g., new-york)
    const stateCode = STATE_MAP[slug]
    if (stateCode) {
        const stateName = getStateName(stateCode)
        return {
            title: `Best ${NICHE.name} Providers in ${stateName} | Compare Costs & Reviews`,
            description: `Find top-rated ${NICHE.name} providers and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in every major city.`,
            alternates: {
                canonical: `https://www.injectorindex.com/botox/${stateCode.toLowerCase()}`
            }
        }
    }

    // If it's already an abbreviation (e.g., ny)
    if (Object.values(STATE_MAP).includes(slug.toUpperCase())) {
        const stateName = getStateName(slug.toUpperCase())
        return {
            title: `Best ${NICHE.name} Providers in ${stateName} | Compare Costs & Reviews`,
            description: `Find top-rated ${NICHE.name} providers and medical spas across ${stateName}. View average costs, patient reviews, and verified clinics in every major city.`,
            alternates: {
                canonical: `https://www.injectorindex.com/botox/${slug.toLowerCase()}`
            }
        }
    }

    return { title: 'Location Not Found' }
}

export default async function StatePage({ params }: StatePageProps) {
    const resolvedParams = await params
    const slug = resolvedParams.slug.toLowerCase()

    // Redirect /botox/state/new-york -> /botox/ny
    const stateCode = STATE_MAP[slug]
    if (stateCode) {
        redirect(`/botox/${stateCode.toLowerCase()}`)
    }

    // Redirect /botox/state/ny -> /botox/ny
    if (Object.values(STATE_MAP).includes(slug.toUpperCase())) {
        redirect(`/botox/${slug.toLowerCase()}`)
    }

    // Handle potential old city URLs in /state/ folder
    // For now, if it's not a state, we 404
    notFound()
}
