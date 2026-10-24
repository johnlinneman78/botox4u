import { getProviderBySlug } from '@/lib/actions/providers'
import { notFound, redirect } from 'next/navigation'
import { EditForm } from './EditForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Edit Provider Profile | VerifiedAesthetics',
    robots: { index: false, follow: false },
}

export default async function EditPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ verify?: string }> }) {
    const { slug } = await params
    const sParams = await searchParams

    // Basic verification check: if no verify param, redirect back
    if (!sParams.verify) {
        redirect(`/claim/${slug}/verify`)
    }

    // Same fetch path as the claim landing page (see verify/page.tsx: the
    // lib/supabase/server client returned no row for real slugs, 404ing
    // every claim step after the landing page).
    const provider = await getProviderBySlug(slug)

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[#F2EDE4] rounded-[4rem] shadow-2xl border border-[#3D2B1F]/10 overflow-hidden">
                    <div className="p-12 md:p-16 pb-6 border-b border-[#3D2B1F]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[#C9A96E] font-bold text-sm uppercase tracking-widest mb-4">
                                <span>Step 2 of 3</span>
                                <span className="w-24 h-1 bg-[#3D2B1F]/5 rounded-full relative overflow-hidden">
                                    <span className="absolute top-0 left-0 w-2/3 h-full bg-[#C9A96E]" />
                                </span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-[#3D2B1F] mb-2">Claim Your Profile</h1>
                            <p className="text-[#3D2B1F]/60 font-light">Confirm your practice details and pricing to update your 2026 Index Score.</p>
                            <p className="text-xs text-[#C9A96E] mt-2 font-semibold">🎁 Free for 30 days — no credit card required.</p>
                        </div>
                        <div className="px-6 py-4 bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#3D2B1F] rounded-3xl text-center">
                            <div className="text-xs uppercase font-bold text-[#C9A96E] mb-1">Current Score</div>
                            <div className="text-3xl font-display font-bold text-[#3D2B1F]">{provider.grade || 'C'}</div>
                        </div>
                    </div>

                    <div className="p-12 md:p-16 pt-8">
                        <EditForm provider={provider} initialNpi={sParams.verify} />
                    </div>
                </div>
            </div>
        </div>
    )
}
