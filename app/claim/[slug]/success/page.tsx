import { getProviderBySlug } from '@/lib/actions/providers'
import { notFound } from 'next/navigation'
import { SuccessView } from './SuccessView'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile Claimed Successfully | VerifiedAesthetics',
    robots: { index: false, follow: false },
}

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    // Same fetch path as the claim landing page (see verify/page.tsx: the
    // lib/supabase/server client returned no row for real slugs, 404ing
    // every claim step after the landing page).
    const provider = await getProviderBySlug(slug)

    if (!provider) {
        notFound()
    }

    return <SuccessView provider={provider} />
}
