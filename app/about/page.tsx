
import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Target, DollarSign, Users, Globe, Scale, Fingerprint } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPlatformStats } from '@/lib/actions/providers'

export const metadata: Metadata = {
    title: 'About Injector Index — Independent Provider Scoring for Aesthetic Medicine',
    description: 'Injector Index is an independent research platform that scores aesthetic injectors on natural results, fair pricing, and verified credentials. Nobody pays for a higher rank.',
}

export default async function AboutPage() {
    const stats = await getPlatformStats()

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Injector Index",
        "url": "https://injectorindex.com",
        "description": "Independent research platform that scores aesthetic medicine providers on natural results, fair pricing, and verified credentials.",
        "founder": {
            "@type": "Person",
            "name": "John Linneman",
            "sameAs": "https://www.linkedin.com/in/[john-linkedin-slug]"
        },
        "foundingDate": "2026",
        "foundingLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Portland",
                "addressRegion": "OR",
                "addressCountry": "US"
            }
        },
        "sameAs": [
            "https://www.linkedin.com/company/[injector-index-slug]",
            "https://twitter.com/[InjectorIndex]",
            "https://www.crunchbase.com/organization/[injector-index-slug]"
        ]
    }

    return (
        <div className="bg-[#0d1420] min-h-screen pb-24">
            <JsonLd data={organizationSchema} />

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-[#0d1420] py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1420] via-[#111a28] to-[#0f141c]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37] opacity-[0.05] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-10 shadow-lg backdrop-blur-md">
                        <Globe className="w-4 h-4 mr-2" />
                        Independent Research Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-10 leading-[1.05] tracking-tight">
                        An Independent Index for <br />
                        <span className="text-[#d4af37] italic">Aesthetic Medicine</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-8">
                        Injector Index is a research platform that scores and ranks aesthetic injectors using public data — patient review language, verified pricing, and federal credential databases. We built it because patients deserve better information before making a healthcare decision.
                    </p>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        We are not a clinic. We don&apos;t perform procedures. We don&apos;t accept advertising from providers. And nobody pays for a higher score.
                    </p>
                </div>
            </section>

            {/* 2. THE NUMBERS (Horizontal Stat Bar) */}
            <section className="relative z-20 -mt-10 mb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-[#101827] rounded-[2.5rem] shadow-2xl border border-white/[0.06] p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                            <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                                {stats.providers.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Providers Indexed</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                                {stats.cities.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Cities Covered</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                                {stats.reviews.toLocaleString()}+
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Patient Reviews</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                                4.2
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Avg. Score Signals</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WHAT WE DO (Methodology) */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">What We Do</h2>
                        <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                            We index aesthetic medicine providers across the United States and score them on four data-driven signals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {[
                            {
                                icon: Target,
                                label: 'Natural Results',
                                desc: 'Semantic analysis of patient review language identifies injectors whose patients consistently describe subtle, natural outcomes — not frozen foreheads or overdone results.'
                            },
                            {
                                icon: DollarSign,
                                label: 'Fair Pricing',
                                desc: 'We collect real per-unit pricing and compare each provider against their local market average. You see whether a clinic charges above, at, or below the norm for your city — before you walk in the door.'
                            },
                            {
                                icon: ShieldCheck,
                                label: 'Credential Integrity',
                                desc: 'Every indexed provider is cross-referenced against the federal NPI (National Provider Identifier) database, the government\'s official registry of licensed healthcare providers. If a provider\'s credentials don\'t verify, it affects their score.'
                            },
                            {
                                icon: Users,
                                label: 'Patient Trust',
                                desc: 'We analyze review consistency and sentiment patterns over time, flagging providers with sudden rating shifts, review clustering, or language patterns associated with incentivized reviews.'
                            }
                        ].map((item) => (
                            <div key={item.label} className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#d4af37]/20 hover:shadow-2xl hover:shadow-[#d4af37]/5 hover:scale-[1.02] transition-all duration-300">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[#d4af37] w-fit mb-8 group-hover:bg-[#d4af37]/10 transition-colors duration-300">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{item.label}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/methodology"
                            className="inline-flex items-center gap-2 text-[#d4af37] font-bold text-lg hover:underline group"
                        >
                            Read the full scoring methodology
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. EDITORIAL INDEPENDENCE (Visually Distinct Block) */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-[#101827] border border-white/[0.06] p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
                            <Scale className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 text-[#d4af37] font-black uppercase tracking-widest text-[10px] mb-8 bg-[#d4af37]/10 px-4 py-1.5 rounded-full border border-[#d4af37]/20">
                                <Scale className="w-3 h-3" />
                                Platform Policy
                            </div>
                            <h2 className="text-4xl font-display font-bold text-white mb-10 leading-tight">Editorial Independence</h2>

                            <div className="space-y-8 text-xl text-gray-400 font-light leading-relaxed">
                                <p className="text-2xl font-bold text-white italic border-l-4 border-[#d4af37] pl-8 py-2">
                                    &quot;No provider pays for placement, ranking, or score improvement. Ever.&quot;
                                </p>
                                <p>
                                    Providers can claim their free listing to update pricing, photos, and contact information. Providers can purchase a Featured badge for visibility — but Featured placement is a visual ad only. It does not influence scores. Scores are calculated from public data using the same methodology for every provider, whether they&apos;ve claimed their listing or not.
                                </p>
                                <p>
                                    We publish this policy because the aesthetic industry is full of directories that sell top placement to the highest bidder and call it &quot;recommended.&quot; We think that&apos;s a problem. Patients searching for a medical provider deserve rankings based on data, not ad spend.
                                </p>
                                <p className="font-medium text-white">
                                    If we ever change this policy, we&apos;ll say so publicly. But we won&apos;t.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BUILT BY */}
            <section className="py-24 px-4 border-t border-white/[0.06]">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="w-20 h-20 bg-white/[0.03] rounded-2xl border border-white/[0.06] flex items-center justify-center mx-auto mb-10">
                        <Fingerprint className="w-10 h-10 text-[#d4af37]" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tight">Built By</h2>
                    <div className="space-y-6 text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto text-left">
                        <p>
                            Injector Index was founded in 2026 by <strong className="text-white">John Linneman</strong> in <strong className="text-white">Portland, Oregon</strong>. The platform grew out of research into how patients actually evaluate aesthetic providers — and the finding that most existing tools (review sites, directory listings, medspa marketing) don&apos;t give patients what they need to make informed decisions.
                        </p>
                        <p>
                            The scoring algorithm was developed through analysis of tens of thousands of patient reviews, identifying the specific language patterns that correlate with patient satisfaction, natural results, and provider trustworthiness. The platform is independently operated and has no financial relationships with product manufacturers, medical associations, or provider networks.
                        </p>
                        <div className="pt-8 text-center">
                            <Link href="/contact" className="text-[#d4af37] font-bold hover:underline">
                                Questions about the platform, methodology, or data: Contact support →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. DISCLAIMERS */}
            <footer className="container mx-auto max-w-5xl px-4 py-16 border-t border-white/[0.06]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[11px] text-gray-600 font-light leading-relaxed">
                    <div className="space-y-4">
                        <div className="font-bold uppercase tracking-widest text-[#d4af37]">Medical Information</div>
                        <p>
                            Injector Index is an independent provider directory and research index for aesthetic medicine. We are not a clinic, we do not perform medical procedures, and we do not provide clinical advice.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="font-bold uppercase tracking-widest text-[#d4af37]">Verification Policy</div>
                        <p>
                            NPI verification confirms the existence of a valid federal provider registration. We are not a medical board or licensing authority. Always consult directly with your provider about their qualifications and experience.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="font-bold uppercase tracking-widest text-[#d4af37]">Scoring & Data</div>
                        <p>
                            All data is gathered from public records to facilitate independent research of aesthetic providers. Scores are informational and should be one factor — not the only factor — in your provider selection.
                        </p>
                    </div>
                </div>
                <div className="mt-16 text-center text-gray-700 text-[10px] uppercase font-bold tracking-[0.3em]">
                    Portland • OR • 2026
                </div>
            </footer>
        </div>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
