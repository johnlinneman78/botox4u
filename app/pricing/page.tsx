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
}

const getIcon = (index: number) => {
    switch (index) {
        case 0: return <Shield className="w-6 h-6 text-[#d4af37]" />
        case 1: return <TrendingUp className="w-6 h-6 text-[#d4af37]" />
        case 2: return <Star className="w-6 h-6 text-[#d4af37]" />
        default: return <Zap className="w-6 h-6 text-[#d4af37]" />
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
        <div className="min-h-screen bg-[#0d1420]">
            {/* High-Authority Hero Section */}
            <div className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black tracking-widest uppercase mb-8">
                        <Lock className="w-3.5 h-3.5" /> Private 2026 Beta
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight tracking-tight">
                        The Future of Aesthetics is <br />
                        <span className="text-[#d4af37]">Regenerative.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        The era of high-volume HA filler is ending. Patients in 2026 are searching for Polynucleotides, Bio-stimulators, and natural integrity. **InjectorIndex** is the only platform that scores your clinic on clinical innovation — not marketing budget.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                            <Users className="w-5 h-5 text-[#d4af37]" />
                            <span className="text-sm font-bold text-gray-300">Targeting High-Net-Worth Patients</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                            <Scale className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-gray-300">Immutable TrueScore™ Algorithm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value Pillars */}
            <div className="py-24 bg-[#101827]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-6">
                                <BarChart3 className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">TrueScore™ Clinical Intelligence</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We index your menu. Clinics with higher clinical innovation and credential signal earn top-of-city visibility automatically.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Verified Conservative</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Our "Verified" badge isn't for sale. It's an audit of your credentials and patient reviews mentioning facial harmony.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Direct Lead Attribution</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                No third-party brokers. Patients contact you directly. We just provide the data that makes them trust you first.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Tiers */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Choose Your Visibility Tier</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Scale your clinic's reach across your target market with our data-driven growth tiers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {NICHE.pricingTiers.map((tier, index) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col rounded-[2.5rem] bg-[#101827] p-8 sm:p-10 shadow-2xl border transition-all duration-500 hover:border-[#d4af37]/30 ${tier.anchor ? 'border-[#d4af37] ring-4 ring-[#d4af37]/10 lg:scale-105 z-20' : 'border-white/[0.06]'
                                }`}
                        >
                            {tier.anchor && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#0d1420] text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                                    Strategic Choice
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-display font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                                    {tier.bestFor}
                                </p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-1">
                                <span className="text-6xl font-display font-bold text-white">${tier.price}</span>
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">/{tier.interval}</span>
                            </div>

                            <div className="flex-grow mb-10">
                                <ul className="space-y-5">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-400 group/item">
                                            <div className="mt-1 bg-[#d4af37]/10 rounded-full p-1 group-hover/item:bg-[#d4af37]/20 transition-colors">
                                                <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                                            </div>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <PricingCta
                                planId={tier.name.toLowerCase() as any}
                                providerId={providerId}
                                isLoggedIn={!!user}
                                className={`w-full py-6 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center ${tier.anchor
                                    ? 'bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] shadow-[#d4af37]/20'
                                    : 'bg-white/[0.03] border-2 border-white/10 text-white hover:bg-white/5 shadow-none'
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-10 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] text-center">
                    <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
                        "InjectorIndex has completely changed how we frame our regenerative protocols. We're finally getting the high-intent patients who value facial harmony over volume."
                    </p>
                    <div className="text-sm font-bold text-white uppercase tracking-widest">— Clinical Director, Scottsdale, AZ</div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 text-sm mb-4 italic">Custom multi-location volume pricing available for enterprise groups.</p>
                    <Link href={`mailto:${NICHE.outreach.senderEmail}`} className="inline-flex items-center gap-2 text-[#d4af37] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                        Contact Sales Development <TrendingUp className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 border-t border-white/[0.06] bg-[#0d1420]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-display font-bold text-center mb-16 text-white">Operational Intelligence FAQ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg">Can I pay to increase my TrueScore™?</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                No. The TrueScore™ is derived from clinical data, public records, and AI sentiment analysis. It is an immutable ranking. Verified clinics may purchase featured placement, but their actual score remains 100% data-driven.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg">What defines the "TrueScore™"?</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                It is a multi-pillar audit measuring injection quality, provider credentials, and adoption of next-gen technology like Polynucleotides and Exosomes. We believe the 2026 market rewards innovators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

