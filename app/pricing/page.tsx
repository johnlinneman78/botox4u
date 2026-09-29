import Link from 'next/link'
import { Check, Star, Shield, Zap, TrendingUp, Scale, Lock, BarChart3, Users } from 'lucide-react'
import { NICHE } from '@/config/niche'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'
import { PricingCta } from '@/components/pricing/PricingCta'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `Provider Plans & Pricing — Scale Your Clinic | ${NICHE.siteName}`,
    description: `Choose the visibility tier that fits your clinical goals. Join high-intent patients searching for natural results and regenerative protocols.`,
    alternates: {
        canonical: '/pricing',
    },
    openGraph: {
        title: `Provider Plans & Pricing — Scale Your Clinic | ${NICHE.siteName}`,
        description: `Choose the visibility tier that fits your clinical goals. Join high-intent patients searching for natural results and regenerative protocols.`,
        url: 'https://injectorindex.com/pricing',
    }
}

const getIcon = (index: number) => {
    switch (index) {
        case 0: return <Shield className="w-6 h-6 text-[#C9A96E]" />
        case 1: return <TrendingUp className="w-6 h-6 text-[#C9A96E]" />
        case 2: return <Star className="w-6 h-6 text-[#C9A96E]" />
        default: return <Zap className="w-6 h-6 text-[#C9A96E]" />
    }
}

export default async function PricingPage() {
    const supabase = await getSupabaseServer(await cookies());
    const { data: { user } } = await supabase?.auth.getUser() || { data: { user: null } };

    let providerId: string | undefined;
    if (user) {
        const { data: provider } = await supabase!
            .from('providers')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .single();
        providerId = provider?.id;
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* High-Authority Hero Section */}
            <div className="relative pt-32 pb-24 border-b border-[#3D2B1F]/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-[10px] font-black tracking-widest uppercase mb-8">
                        <Lock className="w-3.5 h-3.5" /> Private 2026 Beta
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-[#3D2B1F] mb-8 leading-tight tracking-tight">
                        The Future of Aesthetics is <br />
                        <span className="text-[#C9A96E]">Regenerative.</span>
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        The era of high-volume HA filler is ending. Patients in 2026 are searching for Polynucleotides, Bio-stimulators, and natural integrity. **VerifiedAesthetics** is the only platform that scores your clinic on clinical innovation — not marketing budget.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3 bg-[#3D2B1F]/5 px-6 py-3 rounded-2xl border border-[#3D2B1F]/10 shadow-2xl">
                            <Users className="w-5 h-5 text-[#C9A96E]" />
                            <span className="text-sm font-bold text-gray-300">Targeting High-Net-Worth Patients</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#3D2B1F]/5 px-6 py-3 rounded-2xl border border-[#3D2B1F]/10 shadow-2xl">
                            <Scale className="w-5 h-5 text-[#8A9E8D]" />
                            <span className="text-sm font-bold text-gray-300">Immutable Clarity Score™ Algorithm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value Pillars */}
            <div className="py-24 bg-[#F2EDE4]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-6">
                                <BarChart3 className="w-6 h-6 text-[#C9A96E]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3D2B1F]">Clarity Score™ Clinical Intelligence</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                We index your menu. Clinics with higher clinical innovation and credential signal earn top-of-city visibility automatically.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-6 h-6 text-[#C9A96E]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3D2B1F]">Verified Conservative</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                Our "Verified" badge isn't for sale. It's an audit of your credentials and patient reviews mentioning facial harmony.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-6 h-6 text-[#C9A96E]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3D2B1F]">Direct Lead Attribution</h3>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                No third-party brokers. Patients contact you directly. We just provide the data that makes them trust you first.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Tiers */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Choose Your Visibility Tier</h2>
                    <p className="text-[#3D2B1F]/60 max-w-xl mx-auto">Scale your clinic's reach across your target market with our data-driven growth tiers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {NICHE.pricingTiers.map((tier, index) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col rounded-[2.5rem] bg-[#F2EDE4] p-8 sm:p-10 shadow-2xl border transition-all duration-500 hover:border-[#C9A96E]/30 ${tier.anchor ? 'border-[#C9A96E] ring-4 ring-[#C9A96E]/10 lg:scale-105 z-20' : 'border-[#3D2B1F]/10'
                                }`}
                        >
                            {tier.anchor && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A96E] text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                                    Strategic Choice
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-display font-bold text-[#3D2B1F] mb-2">{tier.name}</h3>
                                <p className="text-sm text-[#3D2B1F]/60 leading-relaxed min-h-[40px]">
                                    {tier.bestFor}
                                </p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-1">
                                <span className="text-6xl font-display font-bold text-[#3D2B1F]">${tier.price}</span>
                                <span className="text-[#3D2B1F]/60 font-bold uppercase tracking-widest text-xs">/{tier.interval}</span>
                            </div>

                            <div className="flex-grow mb-10">
                                <ul className="space-y-5">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-[#3D2B1F]/70 group/item">
                                            <div className="mt-1 bg-[#C9A96E]/10 rounded-full p-1 group-hover/item:bg-[#C9A96E]/20 transition-colors">
                                                <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                                            </div>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <PricingCta
                                planId={((tier as any).id || tier.name.toLowerCase()) as any}
                                providerId={providerId}
                                isLoggedIn={!!user}
                                className={`w-full py-6 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center ${tier.anchor
                                    ? 'bg-[#C9A96E] hover:bg-[#B5955B] text-white shadow-[#C9A96E]/20'
                                    : 'bg-[#3D2B1F]/5 border-2 border-[#3D2B1F]/10 text-[#3D2B1F] hover:bg-[#3D2B1F]/5 shadow-none'
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-10 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-[3rem] text-center">
                    <p className="text-[#3D2B1F]/70 text-lg mb-6 max-w-2xl mx-auto">
                        "VerifiedAesthetics has completely changed how we frame our regenerative protocols. We're finally getting the high-intent patients who value facial harmony over volume."
                    </p>
                    <div className="text-sm font-bold text-[#3D2B1F] uppercase tracking-widest">— Clinical Director, Scottsdale, AZ</div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[#3D2B1F]/50 text-sm mb-4 italic">Custom multi-location volume pricing available for enterprise groups.</p>
                    <Link href={`mailto:${NICHE.outreach.senderEmail}`} className="inline-flex items-center gap-2 text-[#C9A96E] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                        Contact Sales Development <TrendingUp className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 border-t border-[#3D2B1F]/10 bg-[#FAF8F5]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-display font-bold text-center mb-16 text-[#3D2B1F]">Operational Intelligence FAQ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="font-bold text-[#3D2B1F] text-lg">Can I pay to increase my Clarity Score™?</h4>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                No. The Clarity Score™ is derived from clinical data, public records, and AI sentiment analysis. It is an immutable ranking. Verified clinics may purchase featured placement, but their actual score remains 100% data-driven.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-[#3D2B1F] text-lg">What defines the "Clarity Score™"?</h4>
                            <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">
                                It is a multi-pillar audit measuring injection quality, provider credentials, and adoption of next-gen technology like Polynucleotides and Exosomes. We believe the 2026 market rewards innovators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

