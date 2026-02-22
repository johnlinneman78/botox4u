import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { NICHE } from '@/config/niche'
import { ShieldCheck, Target, DollarSign, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function ClaimLandingPage({ params }: { params: { slug: string } }) {
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
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <div className="bg-primary text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 translate-x-1/3" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold mb-8">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Practice Profile ID: {provider.id.slice(0, 8)}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-[1.1]">
                        Is this <span className="text-secondary">{provider.name}</span> in {provider.city}?
                    </h1>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mb-10">
                        Patients are actively searching for providers in <strong>{provider.city}</strong>. Claim your free profile to ensure your pricing and credentials are represented accurately.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/claim/${provider.slug}/verify`}
                            className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                        >
                            <span>Yes, This is My Practice</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors"
                        >
                            How the Index Works
                        </Link>
                    </div>
                </div>
            </div>

            {/* WHY CLAIM SECTION */}
            <div className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-display font-bold text-primary mb-16 text-center">Why Claim Your Profile?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-secondary w-fit mb-6">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4">Fix "Not Listed" Pricing</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Profiles with unlisted pricing are filtered out by 65% of our users. Adding your cost-per-unit increases lead conversion significantly.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-secondary w-fit mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4">Verify Your Credentials</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Link your profile to your NPI license to earn the "NPI Verified" badge and Signal 3 trust points.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-secondary w-fit mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4">Natural Results Signal</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Confirm your practice philosophy and showcase your natural results to attract aesthetic patients who value a conservative look.
                            </p>
                        </div>
                    </div>

                    {/* STEPS PREVIEW */}
                    <div className="mt-24 p-12 rounded-[3rem] border border-gray-100 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { step: '1', label: 'Verify', desc: 'Confirm email/NPI' },
                                { step: '2', label: 'Edit', desc: 'Update your data' },
                                { step: '3', label: 'Pricing', desc: 'List your rates' },
                                { step: '4', label: 'Live', desc: 'Boost your rank' }
                            ].map((s) => (
                                <div key={s.step} className="flex flex-col items-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 shadow-lg">
                                        {s.step}
                                    </div>
                                    <div className="font-bold text-primary">{s.label}</div>
                                    <div className="text-sm text-gray-400 font-light">{s.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-gray-400 font-light mb-8 max-w-xl mx-auto">
                            The {NICHE.siteName} Index is an independent data platform. Claiming your profile is free and does not require a credit card.
                        </p>
                        <div className="flex items-center justify-center gap-8 opacity-40">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-widest">Takes 2 Minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-widest">NPI Integrated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-20 border-t border-gray-100 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gray-400 font-light leading-relaxed">
                        Questions? Contact <Link href={`mailto:${NICHE.outreach.senderEmail}`} className="text-secondary font-medium">{NICHE.outreach.senderEmail}</Link>
                    </p>
                </div>
            </footer>
        </div>
    )
}
