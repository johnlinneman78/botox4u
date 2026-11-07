import { NICHE } from '@/config/niche'
import { Search, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ProviderLookup } from '@/components/providers/ProviderLookup'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `Claim Your Free Provider Profile | ${NICHE.siteName}`,
    description: `Are you an aesthetic injector? Claim your free profile and keep your details, prices and contact information accurate.`,
    alternates: {
        canonical: '/claim',
    },
}

export default function ClaimDirectoryPage() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            {/* HERO SECTION */}
            <div className="bg-[#FAF8F5] text-[#3D2B1F] py-24 px-4 overflow-hidden relative border-b border-[#3D2B1F]/10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C9A96E]/5 -skew-x-12 translate-x-1/3" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Provider Network
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        Grow Your Practice with <span className="text-[#C9A96E]">{NICHE.siteName}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#3D2B1F]/70 font-light leading-relaxed max-w-2xl mb-12">
                        Claim your free profile to correct your details, list your prices and add your contact information.
                    </p>

                    <ProviderLookup />
                </div>
            </div>

            {/* BENEFITS GRID */}
            <div className="py-24 px-4 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-[2rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:border-[#C9A96E]/20 transition-all">
                            <div className="h-14 w-14 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center text-[#C9A96E] mb-8">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Your NPI Number</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                We match your profile to your NPI number so patients can look you up. An NPI is an ID number, not a license.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:border-[#C9A96E]/20 transition-all">
                            <div className="h-14 w-14 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center text-[#C9A96E] mb-8">
                                <ArrowRight className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Published Prices</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                Patients here compare prices before they book. A published per-unit price counts toward your Clarity Score.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:border-[#C9A96E]/20 transition-all">
                            <div className="h-14 w-14 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center text-[#C9A96E] mb-8">
                                <Search className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Pricing Control</h3>
                            <p className="text-[#3D2B1F]/60 leading-relaxed font-light">
                                Stop being compared on price without context. List your per-unit rates and specialized treatment packages to attract the right patients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
