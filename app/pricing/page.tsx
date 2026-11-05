import Link from 'next/link'
import { Check, Shield, Zap, BarChart3, Scale, Users } from 'lucide-react'
import { NICHE } from '@/config/niche'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `List Your Clinic Free | ${NICHE.siteName}`,
    description: `Your clinic listing is free, and stays free: your logo, photos, description, services, hours, and contact details. No card, no trial, no paid plan.`,
    alternates: {
        canonical: '/pricing',
    },
    openGraph: {
        title: `List Your Clinic Free | ${NICHE.siteName}`,
        description: `Your clinic listing is free, and stays free: your logo, photos, description, services, hours, and contact details. No card, no trial, no paid plan.`,
        url: 'https://www.verifiedaesthetics.com/pricing',
    }
}

const FREE_FEATURES = [
    'Listing in the directory',
    'Appears in city search results',
    'Name, location, and credential display',
    'Clarity Score™ visible',
    'Your logo, photos, and description',
    'Your services and hours',
    'Corrections any time',
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 border-b border-[#3D2B1F]/10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-[#3D2B1F] mb-8 leading-tight tracking-tight">
                        List your clinic. <br />
                        <span className="text-[#C9A96E]">Free.</span>
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Your listing, your logo, your photos, your description, your services, your hours, your contact details. All free, and they stay free. No card, no trial, no paid plan right now.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3 bg-[#3D2B1F]/5 px-6 py-3 rounded-2xl border border-[#3D2B1F]/10 shadow-2xl">
                            <Users className="w-5 h-5 text-[#C9A96E]" />
                            <span className="text-sm font-bold text-[#3D2B1F]">Listing, claiming, and corrections are free</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#3D2B1F]/5 px-6 py-3 rounded-2xl border border-[#3D2B1F]/10 shadow-2xl">
                            <Scale className="w-5 h-5 text-[#8A9E8D]" />
                            <span className="text-sm font-bold text-[#3D2B1F]">Payment never changes a score</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* What the free listing includes */}
            <div className="py-24 bg-[#F2EDE4]/50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-12 text-center">What the free listing includes</h2>
                    <div className="divide-y divide-[#3D2B1F]/10 border-y border-[#3D2B1F]/10">
                        <div className="flex items-start gap-5 py-8">
                            <Shield className="w-6 h-6 text-[#C9A96E] shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">Your listing, complete</h3>
                                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                    Your logo, photos, description, services, hours, and contact details, all on your profile, all free.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5 py-8">
                            <BarChart3 className="w-6 h-6 text-[#C9A96E] shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">A score patients can check</h3>
                                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                    The Clarity Score™ is three things we can show: patient reviews, a published per-unit price, and contact details. Payment earns zero points. The breakdown is below.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5 py-8">
                            <Zap className="w-6 h-6 text-[#C9A96E] shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">Patients contact you directly</h3>
                                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                    No third-party brokers. Your website and phone number are on your listing, so patients reach you, not a middleman.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Free Listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">One listing. Free.</h2>
                    <p className="text-[#3D2B1F]/60 max-w-xl mx-auto">Everything a patient needs to find you and check your work, with nothing held back for a paid tier.</p>
                </div>

                <div className="max-w-xl mx-auto">
                    <div className="flex flex-col rounded-[2.5rem] bg-[#F2EDE4] p-8 sm:p-10 border border-[#C9A96E] ring-4 ring-[#C9A96E]/10">
                        <div className="mb-8">
                            <h3 className="text-2xl font-display font-bold text-[#3D2B1F] mb-2">Free</h3>
                            <p className="text-sm text-[#3D2B1F]/60 leading-relaxed min-h-[40px]">
                                Every provider. Listing is free, and stays free.
                            </p>
                        </div>

                        <div className="mb-10 flex items-baseline gap-1">
                            <span className="text-6xl font-display font-bold text-[#3D2B1F]">$0</span>
                            <span className="text-[#3D2B1F]/60 font-bold uppercase tracking-widest text-xs">/forever</span>
                        </div>

                        <div className="flex-grow mb-10">
                            <ul className="space-y-5">
                                {FREE_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-[#3D2B1F]/70 group/item">
                                        <div className="mt-1 bg-[#C9A96E]/10 rounded-full p-1 group-hover/item:bg-[#C9A96E]/20 transition-colors">
                                            <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                                        </div>
                                        <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/claim"
                            className="w-full py-6 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center bg-[#C9A96E] hover:bg-[#B5955B] text-white shadow-[#C9A96E]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A96E]"
                        >
                            Claim your listing, free
                        </Link>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 border-t border-[#3D2B1F]/10 bg-[#FAF8F5]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-display font-bold text-center mb-16 text-[#3D2B1F]">How the listing and the score work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#3D2B1F] text-lg">Can I pay to increase my Clarity Score™?</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                No. Payment earns zero points. The score has three inputs: patient reviews, up to 40 points; a published per-unit price, up to 10 points; and contact details, a working website and phone number, up to 7 points. That is 57 points, scaled to 100. Booking links, quote requests, featured placement, and payment earn zero points.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#3D2B1F] text-lg">What is the Clarity Score™?</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                It measures how much a patient can confirm about a provider before booking: patient reviews (up to 40 points), a published per-unit price (up to 10), and contact details (up to 7). That is 57 points, scaled to 100. NPI matching is shown separately and never adds points. A provider with fewer than 5 reviews shows as Not enough data.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#3D2B1F] text-lg">Is my listing really free?</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                Yes. Listing, claiming, corrections, logo, photos, description, services, and hours are free, and stay free. There are no paid plans right now.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#3D2B1F] text-lg">How do I claim my listing?</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                Find your clinic on the claim page and create an account. Every claim is reviewed before it is approved. Nothing is marked claimed or verified until that review is complete.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
