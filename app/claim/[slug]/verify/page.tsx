import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { VerifyForm } from './VerifyForm'

export default async function VerifyPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-gray-50 min-h-screen py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-12 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest mb-4">
                            <span>Step 1 of 3</span>
                            <span className="w-12 h-1 bg-gray-100 rounded-full relative overflow-hidden">
                                <span className="absolute top-0 left-0 w-1/3 h-full bg-secondary" />
                            </span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-primary mb-2">Verify Your Practice</h1>
                        <p className="text-gray-500 font-light">To protect patient trust, we require verification of your clinic email and NPI credential.</p>
                    </div>

                    <div className="p-12 pt-8">
                        <VerifyForm provider={provider} />
                    </div>
                </div>

                <p className="text-center mt-12 text-sm text-gray-400 font-light max-w-md mx-auto">
                    Verification is typically instant. Your NPI will be cross-referenced against federal records.
                </p>
            </div>
        </div>
    )
}
