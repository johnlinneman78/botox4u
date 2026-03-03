import { ShieldCheck, Award, BarChart3, Globe, Eye, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const FACTORS = [
    {
        title: 'Credentials',
        label: '25 Points',
        description: 'Board certification, license verification, years of practice, specialized training in aesthetic medicine.',
        icon: <Award className="w-7 h-7" />,
        color: 'bg-[#3D2B1F]/5 text-[#C9A96E] border-[#3D2B1F]/10',
        glow: 'shadow-[#C9A96E]/5',
    },
    {
        title: 'Patient Sentiment',
        label: '30 Points',
        description: 'Our semantic algorithm reads every Google Review and extracts quality signals — not just "5 stars great!" but specific patterns like "natural results," "minimal bruising," "thorough consultation."',
        icon: <ShieldCheck className="w-7 h-7" />,
        color: 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/20',
        glow: 'shadow-[#C9A96E]/10',
    },
    {
        title: 'Review Quality',
        label: '20 Points',
        description: 'Volume matters, but so does consistency. A provider with 200 reviews averaging 4.8 scores higher than one with 20 reviews averaging 4.9.',
        icon: <BarChart3 className="w-7 h-7" />,
        color: 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/20',
        glow: 'shadow-[#C9A96E]/10',
    },
    {
        title: 'Practice Signals',
        label: '15 Points',
        description: 'Complete online presence, responsive to reviews, up-to-date hours, professional photos of actual work.',
        icon: <Globe className="w-7 h-7" />,
        color: 'bg-emerald-950/50 text-[#8A9E8D] border-emerald-800/40',
        glow: 'shadow-[#8A9E8D]/10',
    },
    {
        title: 'Transparency',
        label: '10 Points',
        description: 'Clear pricing information, published credentials, before/after galleries, listed services.',
        icon: <Eye className="w-7 h-7" />,
        color: 'bg-amber-950/50 text-amber-400 border-amber-800/40',
        glow: 'shadow-amber-500/10',
    },
]

const PENALTIES = [
    {
        label: '"Pillow-Face" Penalty',
        desc: 'Reviews mentioning overfilled, unnatural, or migrated results trigger an automated Clarity Score™ deduction.',
        icon: <AlertTriangle className="w-4 h-4" />
    },
    {
        label: 'Innovation Premium',
        desc: 'Clinics utilizing current-generation products and the latest evidence-based techniques earn an algorithmic boost.',
        icon: <TrendingUp className="w-4 h-4" />
    },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#3D2B1F]/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" /> Clarity Score™ 2026 Ranking Algorithm
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6">
                        Your Injector&apos;s Score, <span className="text-[#C9A96E]">Explained.</span>
                    </h2>
                    <div className="flex justify-center mb-8">
                        <Link
                            href="/methodology"
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F]/70 hover:text-[#C9A96E] hover:border-[#C9A96E]/30 transition-all text-xs font-black uppercase tracking-widest group"
                        >
                            <ShieldCheck className="w-4 h-4 text-[#C9A96E] group-hover:scale-110 transition-transform" />
                            Full Clarity Score™ Methodology →
                        </Link>
                    </div>
                    <p className="text-xl text-[#3D2B1F]/70 leading-relaxed font-light">
                        Clarity Score™ isn&apos;t a star rating. It&apos;s a composite score (0-100) built from multiple data signals that no provider can buy their way to the top of.
                    </p>
                </div>

                {/* 5 Pillars */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    {FACTORS.map((factor) => (
                        <div
                            key={factor.title}
                            className={`bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-3xl p-7 hover:bg-[#3D2B1F]/5 transition-all hover:-translate-y-1 hover:shadow-xl ${factor.glow} group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${factor.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                {factor.icon}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-bold text-[#3D2B1F]">{factor.title}</h3>
                            </div>
                            <span className="inline-block text-[10px] font-black text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-lg uppercase tracking-widest mb-3">
                                {factor.label}
                            </span>
                            <p className="text-sm text-[#3D2B1F]/60 leading-relaxed">
                                {factor.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bonus / Penalty bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {PENALTIES.map((p) => (
                        <div key={p.label} className="flex items-start gap-4 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl px-6 py-4">
                            <div className="text-[#C9A96E] mt-0.5 shrink-0">{p.icon}</div>
                            <div>
                                <div className="text-sm font-bold text-[#3D2B1F] mb-0.5">{p.label}</div>
                                <div className="text-xs text-[#3D2B1F]/60">{p.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="p-8 bg-gradient-to-r from-[#C9A96E]/10 to-transparent rounded-[2rem] border border-[#C9A96E]/15 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="text-[#C9A96E] font-black text-xs uppercase tracking-widest mb-2">Independent Accountability</div>
                        <p className="text-lg font-bold text-[#3D2B1F]">Nobody buys a higher Clarity Score™. Rankings are pure data.</p>
                        <p className="text-sm text-[#3D2B1F]/60 mt-1">Providers may buy featured search placement (clearly disclosed). Their Clarity Score™ remains independent and immutable.</p>
                    </div>
                    <div className="shrink-0 text-[#C9A96E]/40">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                </div>
            </div>
        </section>
    )
}
