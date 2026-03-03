import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { ShieldCheck, Target, DollarSign, Users, Search, Brain, BarChart3, HelpCircle, Zap, ExternalLink, ArrowRight, Shield } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `Our Methodology — How We Rank Injectors | ${NICHE.siteName}`,
    description: `Learn how Clarity Score™ uses semantic analysis and clinical quality data to rank aesthetic providers. We prioritize natural results and pricing transparency.`,
    alternates: {
        canonical: 'https://www.injectorindex.com/methodology',
    },
    openGraph: {
        title: `Our Methodology — How We Rank Injectors | ${NICHE.siteName}`,
        description: `Learn how Clarity Score™ uses semantic analysis and clinical quality data to rank aesthetic providers. We prioritize natural results and pricing transparency.`,
        url: 'https://www.injectorindex.com/methodology',
    }
}

export default function MethodologyPage() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            {/* 1. HERO SECTION */}
            <div className="bg-[#FAF8F5] py-32 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C9A96E]/5 -skew-x-12 translate-x-1/3" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#C9A96E] text-sm font-bold mb-8">
                        <ShieldCheck className="w-4 h-4" />
                        <span>The 2026 Ranking Methodology</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-[#3D2B1F] mb-8 tracking-tight leading-[1.1]">
                        The Clarity Score™ Isn&apos;t <span className="text-[#C9A96E]">Assigned.</span> <br />It&apos;s Learned.
                    </h1>
                    <p className="text-2xl text-[#3D2B1F]/70 font-light leading-relaxed max-w-2xl mx-auto">
                        We built a semantic analysis engine that reads what patients actually say — because stars aren't enough to tell the full story.
                    </p>
                </div>
            </div>

            <div className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* 2. CORE MISSION - THE NETFLIX ANALOGY */}
                    <div className="mb-32">
                        <h2 className="text-xs font-black text-[#C9A96E] uppercase tracking-[0.3em] mb-12 text-center">The Philosophy</h2>
                        <div className="prose prose-2xl prose-invert font-light text-[#3D2B1F]/70 max-w-none text-center">
                            <p className="mb-0">
                                Netflix didn&apos;t manually rate every movie. They built a system that learned from what customers actually watched, rated, and abandoned.
                            </p>
                            <div className="my-12 flex justify-center">
                                <PlusIcon className="w-8 h-8 text-gray-700" />
                            </div>
                            <p className="font-bold text-[#3D2B1F] text-3xl mb-8 leading-tight">
                                We do the same thing for Botox providers.
                            </p>
                            <p className="text-lg">
                                The {NICHE.siteName} Index is a proprietary data-driven ranking engine that learns from patient language and clinical quality patterns. The more data our engine analyzes, the stronger the &quot;Signal&quot; becomes. We don&apos;t award points based on a static rubric; we measure clinical and aesthetic relevance through proprietary clinical quality data.
                            </p>
                        </div>
                    </div>

                    {/* 3. THE PROBLEM SCREEN - WHY STARS ARE BROKEN */}
                    <div className="mb-32 bg-[#3D2B1F]/5 p-12 md:p-20 rounded-[4rem] border border-[#3D2B1F]/10 relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-display font-bold text-[#3D2B1F] mb-6 tracking-tight leading-tight">Why Star Ratings <br />Are Broken</h2>
                                <p className="text-xl text-[#3D2B1F]/60 font-light leading-relaxed mb-8">
                                    A provider can have 4.9 stars and still leave you with a frozen face. Star ratings alone can be gamed, and they don&apos;t capture the nuance of aesthetic results.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-400 font-black text-[10px]">X</span>
                                        </div>
                                        <span className="text-sm text-[#3D2B1F]/60 font-medium italic">&quot;The doctor was so nice! 5 stars.&quot; (Doesn't mention the result.)</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-400 font-black text-[10px]">X</span>
                                        </div>
                                        <span className="text-sm text-[#3D2B1F]/60 font-medium italic">&quot;They have a great loyalty program.&quot; (Marketing, not medicine.)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#F2EDE4] p-10 rounded-[3rem] shadow-xl border border-[#3D2B1F]/10">
                                <h4 className="text-sm font-black text-[#3D2B1F] uppercase tracking-widest mb-6">Semantic Flag Example</h4>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-xs font-mono text-[#3D2B1F]/60">
                                        &quot;I look so frozen, I can&apos;t move my eyebrows.&quot;
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#C9A96E] mx-auto" />
                                    <div className="p-6 rounded-2xl bg-[#C9A96E]/5 border border-[#C9A96E]/20 flex items-center gap-4">
                                        <Zap className="w-6 h-6 text-[#C9A96E]" />
                                        <div>
                                            <div className="text-[#C9A96E] font-bold text-xs">Signal Captured</div>
                                            <div className="text-[#3D2B1F] font-bold">Inhibited Movement Alert</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. THE FOUR SIGNALS */}
                    <div className="mb-32">
                        <h2 className="text-center text-4xl font-display font-bold text-[#3D2B1F] mb-4 tracking-tight">The Four Signals</h2>
                        <p className="text-center text-[#3D2B1F]/50 font-light mb-20 max-w-xl mx-auto">
                            Our proprietary engine analyzes dozens of independent data vectors—which we group into four primary Signals—to determine a provider&apos;s rank.
                        </p>

                        <div className="grid grid-cols-1 gap-16">
                            {[
                                {
                                    icon: Brain,
                                    label: 'Natural Language Signal',
                                    sub: 'Semantic Output Analysis',
                                    desc: 'Our model is trained to identify language that indicates natural, conservative outcomes. It differentiates between &quot;looking refreshed&quot; and &quot;looking like I had work done.&quot;'
                                },
                                {
                                    icon: DollarSign,
                                    label: 'Transparency Signal',
                                    sub: 'Verified Pricing Data',
                                    desc: 'Providers who publish real per-unit pricing strengthen their transparency score. Hidden pricing often correlates with high-pressure sales environments, which our engine detects and penalizes.'
                                },
                                {
                                    icon: ShieldCheck,
                                    label: 'Verification Signal',
                                    sub: 'Federal NPI Sync',
                                    desc: 'We cross-reference every provider against the federal NPI database. If we can&apos;t verify their professional standing, their index presence is restricted.'
                                },
                                {
                                    icon: BarChart3,
                                    label: 'Consistency Signal',
                                    sub: 'Review Velocity Analysis',
                                    desc: 'Recent data is prioritized through recurring audits. A provider who was great in 2019 but has poor reviews in 2026 will see their signal fluctuate based on current performance.'
                                }
                            ].map((signal, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-12 items-start group">
                                    <div className="p-6 rounded-[2.5rem] bg-[#F2EDE4] text-[#C9A96E] border border-[#3D2B1F]/10 shadow-2xl group-hover:bg-[#C9A96E]/10 group-hover:border-[#C9A96E]/20 transition-all group-hover:scale-110 duration-500">
                                        <signal.icon className="w-10 h-10" />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-[#C9A96E] font-black text-xs uppercase tracking-[0.2em]">{signal.sub}</span>
                                            <div className="h-px bg-[#3D2B1F]/5 flex-1" />
                                            <span className="px-3 py-1 bg-[#3D2B1F]/5 rounded-full text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-tighter border border-[#3D2B1F]/10">Signal Active</span>
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">{signal.label}</h3>
                                        <p className="text-xl text-[#3D2B1F]/60 font-light leading-relaxed mb-6">{signal.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. DYNAMIC SCORING MESSAGE */}
                    <div className="mb-32 p-16 rounded-[4rem] bg-[#F2EDE4] text-[#3D2B1F] text-center relative overflow-hidden border border-[#3D2B1F]/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E] opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full blur-[80px]" />
                        <h2 className="text-4xl font-display font-bold mb-8">The Clarity Score™ is Dynamic.</h2>
                        <p className="text-xl text-[#3D2B1F]/70 font-light leading-relaxed max-w-2xl mx-auto mb-12">
                            A provider&apos;s score can change daily based on new data. We don&apos;t believe in permanent rankings. You have to earn your place in the index every single month.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                'Not a paid ranking',
                                'Not a star rating',
                                'Not a static rubric',
                                'Not permanent'
                            ].map((tag) => (
                                <span key={tag} className="px-6 py-2 bg-[#3D2B1F]/5 rounded-full text-sm font-bold border border-[#3D2B1F]/10 whitespace-nowrap">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 6. PROVIDER CTA */}
                    <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 p-12 md:p-20 rounded-[4rem] text-center">
                        <Shield className="w-16 h-16 text-[#C9A96E] mx-auto mb-8" />
                        <h3 className="text-4xl font-display font-bold text-[#3D2B1F] mb-6">Are you a provider?</h3>
                        <p className="text-xl text-[#3D2B1F]/60 font-light leading-relaxed max-w-xl mx-auto mb-10">
                            Claim your profile to verify your credentials, list your pricing, and ensure our engine has the most accurate data for your practice.
                        </p>
                        <Link href="/claim" className="inline-flex items-center gap-3 bg-[#C9A96E] text-white px-10 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:shadow-[#C9A96E]/10 hover:scale-[1.02] transition-all">
                            <span>Claim Your Free Profile</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="py-20 border-t border-[#3D2B1F]/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-[#3D2B1F]/50 font-light leading-relaxed">
                        The {NICHE.siteName} Index is a data-driven semantic engine. Analysis is generated automatically based on patient language patterns and verified public records.
                        <br />
                        <span className="text-[10px] mt-4 block uppercase tracking-widest text-gray-700">© 2026 {NICHE.siteName} — The Authority in Aesthetic Data</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )
}

