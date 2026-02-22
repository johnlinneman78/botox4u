import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { ShieldCheck, Target, DollarSign, Users, Search, Brain, BarChart3, HelpCircle, Zap, ExternalLink, ArrowRight, Shield } from 'lucide-react'

export default function MethodologyPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* 1. HERO SECTION */}
            <div className="bg-primary py-32 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 translate-x-1/3" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-secondary text-sm font-bold mb-8">
                        <ShieldCheck className="w-4 h-4" />
                        <span>The 2026 Ranking Methodology</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tight leading-[1.1]">
                        The Score Isn&apos;t <span className="text-secondary">Assigned.</span> <br />It&apos;s Learned.
                    </h1>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                        We built a semantic analysis engine that reads what patients actually say — because stars aren't enough to tell the full story.
                    </p>
                </div>
            </div>

            <div className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* 2. CORE MISSION - THE NETFLIX ANALOGY */}
                    <div className="mb-32">
                        <h2 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-12 text-center">The Philosophy</h2>
                        <div className="prose prose-2xl prose-slate font-light text-gray-600 max-w-none text-center">
                            <p className="mb-0">
                                Netflix didn&apos;t manually rate every movie. They built a system that learned from what customers actually watched, rated, and abandoned.
                            </p>
                            <div className="my-12 flex justify-center">
                                <PlusIcon className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="font-bold text-primary text-3xl mb-8 leading-tight">
                                We do the same thing for Botox providers.
                            </p>
                            <p className="text-lg">
                                The {NICHE.siteName} Index is a data-driven ranking engine that learns from patient language. The more data our engine analyzes, the stronger the &quot;Signal&quot; becomes. We don&apos;t award points; we measure relevance.
                            </p>
                        </div>
                    </div>

                    {/* 3. THE PROBLEM SCREEN - WHY STARS ARE BROKEN */}
                    <div className="mb-32 bg-gray-50 p-12 md:p-20 rounded-[4rem] border border-gray-100 relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-display font-bold text-primary mb-6 tracking-tight leading-tight">Why Star Ratings <br />Are Broken</h2>
                                <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                                    A provider can have 4.9 stars and still leave you with a frozen face. Star ratings alone can be gamed, and they don&apos;t capture the nuance of aesthetic results.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-500 font-black text-[10px]">X</span>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium italic">&quot;The doctor was so nice! 5 stars.&quot; (Doesn't mention the result.)</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-500 font-black text-[10px]">X</span>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium italic">&quot;They have a great loyalty program.&quot; (Marketing, not medicine.)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
                                <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Semantic Flag Example</h4>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-mono text-gray-400">
                                        &quot;I look so frozen, I can&apos;t move my eyebrows.&quot;
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-secondary mx-auto" />
                                    <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center gap-4">
                                        <Zap className="w-6 h-6 text-secondary" />
                                        <div>
                                            <div className="text-secondary font-bold text-xs">Signal Captured</div>
                                            <div className="text-primary font-bold">Inhibited Movement Alert</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. THE FOUR SIGNALS */}
                    <div className="mb-32">
                        <h2 className="text-center text-4xl font-display font-bold text-primary mb-4 tracking-tight">The Four Signals</h2>
                        <p className="text-center text-gray-400 font-light mb-20 max-w-xl mx-auto">
                            Instead of an arbitrary point system, our engine calculates four independent signals to determine a provider&apos;s rank.
                        </p>

                        <div className="grid grid-cols-1 gap-16">
                            {[
                                {
                                    icon: Brain,
                                    label: 'Natural Language Signal',
                                    sub: 'Semantic Output Analysis',
                                    desc: 'Our model is trained to identify language that indicates natural, conservative outcomes. It differentiates between &quot;looking refreshed&quot; and &quot;looking like I had work done.&quot;',
                                    impact: 'High'
                                },
                                {
                                    icon: DollarSign,
                                    label: 'Transparency Signal',
                                    sub: 'Verified Pricing Data',
                                    desc: 'Providers who publish real per-unit pricing receive a boosted signal. Hidden pricing correlates with high-pressure upselling, which our index penalizes.',
                                    impact: 'Medium'
                                },
                                {
                                    icon: ShieldCheck,
                                    label: 'Verification Signal',
                                    sub: 'Federal NPI Sync',
                                    desc: 'We cross-reference every provider against the federal NPI database. If we can&apos;t verify their professional standing, their score is suppressed.',
                                    impact: 'Foundational'
                                },
                                {
                                    icon: BarChart3,
                                    label: 'Consistency Signal',
                                    sub: 'Review Velocity Analysis',
                                    desc: 'Recent data is weighted progressively. A provider who was great in 2019 but has poor reviews in 2026 will see their signal drop rapidly.',
                                    impact: 'Dynamic'
                                }
                            ].map((signal, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-12 items-start group">
                                    <div className="p-6 rounded-[2.5rem] bg-primary text-white shadow-2xl group-hover:bg-secondary transition-colors group-hover:scale-110 transition-transform duration-500">
                                        <signal.icon className="w-10 h-10" />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-secondary font-black text-xs uppercase tracking-[0.2em]">{signal.sub}</span>
                                            <div className="h-px bg-gray-100 flex-1" />
                                            <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Impact: {signal.impact}</span>
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-primary mb-4">{signal.label}</h3>
                                        <p className="text-xl text-gray-500 font-light leading-relaxed mb-6">{signal.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. DYNAMIC SCORING MESSAGE */}
                    <div className="mb-32 p-16 rounded-[4rem] bg-primary text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full" />
                        <h2 className="text-4xl font-display font-bold mb-8">The Score is Dynamic.</h2>
                        <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto mb-12">
                            A provider&apos;s score can change daily based on new data. We don&apos;t believe in permanent rankings. You have to earn your place in the index every single month.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                'Not a paid ranking',
                                'Not a star rating',
                                'Not a static rubric',
                                'Not permanent'
                            ].map((tag) => (
                                <span key={tag} className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20 whitespace-nowrap">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 6. PROVIDER CTA */}
                    <div className="bg-gray-50 border border-gray-100 p-12 md:p-20 rounded-[4rem] text-center">
                        <Shield className="w-16 h-16 text-secondary mx-auto mb-8" />
                        <h3 className="text-4xl font-display font-bold text-primary mb-6">Are you a provider?</h3>
                        <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">
                            Claim your profile to verify your credentials, list your pricing, and ensure our engine has the most accurate data for your practice.
                        </p>
                        <Link href="/claim" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all">
                            <span>Claim Your Free Profile</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="py-20 border-t border-gray-100 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gray-400 font-light leading-relaxed">
                        The {NICHE.siteName} Index is a data-driven semantic engine. Analysis is generated automatically based on patient language patterns and verified public records.
                        <br />
                        <span className="text-[10px] mt-4 block uppercase tracking-widest">© 2026 {NICHE.siteName} — The Authority in Aesthetic Data</span>
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

