import { getProviderBySlug } from '@/lib/actions/providers'
import { notFound } from 'next/navigation'
import { VerifyForm } from './VerifyForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function VerifyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    // Fetch through the same path as the claim landing page, which resolves
    // real slugs. The old lib/supabase/server client
    // (createServerComponentClient from @supabase/auth-helpers-nextjs,
    // handed the raw async cookies() from next/headers, which that package
    // predates) returned no row for real slugs on Next 16, so this page
    // 404'd for every clinic while the landing page worked.
    const provider = await getProviderBySlug(slug)

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-[#F2EDE4] rounded-[3rem] shadow-2xl border border-[#3D2B1F]/10 overflow-hidden">
                    <div className="p-12 pb-6 border-b border-[#3D2B1F]/10">
                        <div className="flex items-center gap-2 text-[#C9A96E] font-bold text-sm uppercase tracking-widest mb-4">
                            <span>Step 1 of 3</span>
                            <span className="w-12 h-1 bg-[#3D2B1F]/5 rounded-full relative overflow-hidden">
                                <span className="absolute top-0 left-0 w-1/3 h-full bg-[#C9A96E]" />
                            </span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-[#3D2B1F] mb-2">Verify Your Practice</h1>
                        <p className="text-[#3D2B1F]/60 font-light">To protect patient trust, we require verification of your clinic email and NPI credential.</p>
                        <p className="text-xs text-[#C9A96E] mt-2 font-semibold">🎁 Free for 30 days — no credit card required.</p>
                    </div>

                    <div className="p-12 pt-8">
                        <VerifyForm provider={provider} />
                    </div>
                </div>

                <p className="text-center mt-12 text-sm text-[#3D2B1F]/50 font-light max-w-md mx-auto">
                    Verification is typically instant. Your NPI will be cross-referenced against federal records.
                </p>
            </div>
        </div>
    )
}
