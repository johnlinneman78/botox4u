import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditForm } from './EditForm'

export default async function EditPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ verify?: string }> }) {
    const { slug } = await params
    const sParams = await searchParams

    // Basic verification check: if no verify param, redirect back
    if (!sParams.verify) {
        redirect(`/claim/${slug}/verify`)
    }

    const supabase = await createClient()
    const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-[#0d1420] min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[#101827] rounded-[4rem] shadow-2xl border border-white/[0.06] overflow-hidden">
                    <div className="p-12 md:p-16 pb-6 border-b border-white/[0.06] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-sm uppercase tracking-widest mb-4">
                                <span>Step 2 of 3</span>
                                <span className="w-24 h-1 bg-white/[0.06] rounded-full relative overflow-hidden">
                                    <span className="absolute top-0 left-0 w-2/3 h-full bg-[#d4af37]" />
                                </span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white mb-2">Claim Your Profile</h1>
                            <p className="text-gray-500 font-light">Confirm your practice details and pricing to update your 2026 Index Score.</p>
                            <p className="text-xs text-[#d4af37] mt-2 font-semibold">🎁 Free for 30 days — no credit card required.</p>
                        </div>
                        <div className="px-6 py-4 bg-[#d4af37]/10 border border-[#d4af37]/20 text-white rounded-3xl text-center">
                            <div className="text-xs uppercase font-bold text-[#d4af37] mb-1">Current Score</div>
                            <div className="text-3xl font-display font-bold text-white">{provider.grade || 'C'}</div>
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
