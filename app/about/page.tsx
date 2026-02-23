
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
        <div className="bg-white min-h-screen pb-24">
            <JsonLd data={organizationSchema} />

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-[#1a2332] py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
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
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
                        Injector Index is a research platform that scores and ranks aesthetic injectors using public data — patient review language, verified pricing, and federal credential databases. We built it because patients deserve better information before making a healthcare decision.
                    </p>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        We are not a clinic. We don&apos;t perform procedures. We don&apos;t accept advertising from providers. And nobody pays for a higher score.
                    </p>
                </div>
            </section>

            {/* 2. THE NUMBERS (Horizontal Stat Bar) */}
            <section className="relative z-20 -mt-10 mb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100 p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                            <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">
                                {stats.providers.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Providers Indexed</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">
                                {stats.cities.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Cities Covered</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">
                                {stats.reviews.toLocaleString()}+
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Patient Reviews</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 pl-0 md:pl-4">
                            <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">
                                4.2
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Avg. Score Signals</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WHAT WE DO (Methodology) */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6 tracking-tight">What We Do</h2>
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
                            <div key={item.label} className="group p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                <div className="p-4 rounded-2xl bg-white shadow-sm text-secondary w-fit mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">{item.label}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/methodology"
                            className="inline-flex items-center gap-2 text-secondary font-bold text-lg hover:underline group"
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
                    <div className="bg-[#fbfff0] border border-[#e6f0c8] p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-primary">
                            <Scale className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-8 bg-black/5 px-4 py-1.5 rounded-full">
                                <Scale className="w-3 h-3" />
                                Platform Policy
                            </div>
                            <h2 className="text-4xl font-display font-bold text-primary mb-10 leading-tight">Editorial Independence</h2>

                            <div className="space-y-8 text-xl text-primary/80 font-light leading-relaxed">
                                <p className="text-2xl font-bold text-primary italic border-l-4 border-[#d4af37] pl-8 py-2">
                                    &quot;No provider pays for placement, ranking, or score improvement. Ever.&quot;
                                </p>
                                <p>
                                    Providers can claim their free listing to update pricing, photos, and contact information. Providers can purchase a Featured badge for visibility — but Featured placement is a visual ad only. It does not influence scores. Scores are calculated from public data using the same methodology for every provider, whether they&apos;ve claimed their listing or not.
                                </p>
                                <p>
                                    We publish this policy because the aesthetic industry is full of directories that sell top placement to the highest bidder and call it &quot;recommended.&quot; We think that&apos;s a problem. Patients searching for a medical provider deserve rankings based on data, not ad spend.
                                </p>
                                <p className="font-medium text-primary">
                                    If we ever change this policy, we&apos;ll say so publicly. But we won&apos;t.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BUILT BY */}
            <section className="py-24 px-4 border-t border-gray-100">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-10 shadow-sm">
                        <Fingerprint className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-primary mb-8 tracking-tight">Built By</h2>
                    <div className="space-y-6 text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto text-left">
                        <p>
                            Injector Index was founded in 2026 by <strong>John Linneman</strong> in <strong>Portland, Oregon</strong>. The platform grew out of research into how patients actually evaluate aesthetic providers — and the finding that most existing tools (review sites, directory listings, medspa marketing) don&apos;t give patients what they need to make informed decisions.
                        </p>
                        <p>
                            The scoring algorithm was developed through analysis of tens of thousands of patient reviews, identifying the specific language patterns that correlate with patient satisfaction, natural results, and provider trustworthiness. The platform is independently operated and has no financial relationships with product manufacturers, medical associations, or provider networks.
                        </p>
                        <div className="pt-8 text-center">
                            <Link href="/contact" className="text-secondary font-bold hover:underline">
                                Questions about the platform, methodology, or data: Contact support →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. DISCLAIMERS */}
            <footer className="container mx-auto max-w-5xl px-4 py-16 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[11px] text-gray-400 font-light leading-relaxed">
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
                <div className="mt-16 text-center text-gray-300 text-[10px] uppercase font-bold tracking-[0.3em]">
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
