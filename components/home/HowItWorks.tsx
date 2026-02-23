import { Dna, ShieldCheck, Cpu, Award, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const FACTORS = [
    {
        title: 'Regen-Ratio™',
        label: 'Primary Signal',
        description: 'What percentage of this provider\'s menu is regenerative medicine (Polynucleotides, Sculptra, PRF, Exosomes) vs. traditional HA filler? Higher biological innovation = higher score.',
        icon: <Dna className="w-7 h-7" />,
        color: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40',
        glow: 'shadow-emerald-500/10',
    },
    {
        title: 'Natural Integrity',
        label: 'Clinical Signal',
        description: 'AI-assisted sentiment analysis of patient reviews. We flag "frozen," "overdone," and "migration" as red flags. We reward "natural," "subtle," and "undetectable" — consistently.',
        icon: <ShieldCheck className="w-7 h-7" />,
        color: 'bg-blue-950/50 text-blue-400 border-blue-800/40',
        glow: 'shadow-blue-500/10',
    },
    {
        title: 'Innovation Score',
        label: 'Growth Signal',
        description: 'Are they offering Daxxify (6–9 month longevity)? Ultrasound-guided injections? AI skin mapping? 2026 providers who adopt cutting-edge tech score higher.',
        icon: <Cpu className="w-7 h-7" />,
        color: 'bg-violet-950/50 text-violet-400 border-violet-800/40',
        glow: 'shadow-violet-500/10',
    },
    {
        title: 'Provider Pedigree',
        label: 'Trust Signal',
        description: 'Verified NPI federal credentials, advanced training in PN protocols, board certifications, and peer-recognized case study contributions.',
        icon: <Award className="w-7 h-7" />,
        color: 'bg-amber-950/50 text-amber-400 border-amber-800/40',
        glow: 'shadow-amber-500/10',
    },
]

const PENALTIES = [
    {
        label: '"Pillow-Face" Penalty',
        desc: 'Reviews mentioning swollen, unnatural, or migrated results trigger an automated Signal deduction.',
        icon: <AlertTriangle className="w-4 h-4" />
    },
    {
        label: 'Prejuvenation Bonus',
        desc: 'Gen Z-focused, conservative micro-dose Daxxify/PN protocols earn a regenerative intelligence premium.',
        icon: <TrendingUp className="w-4 h-4" />
    },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#0d1420] border-t border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-6">
                        <Dna className="w-3.5 h-3.5" /> II-Score™ 2026 Algorithm
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        The Only Score That Rewards <span className="text-[#d4af37]">Regeneration</span>
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        Legacy directories rank by reviews bought and stars paid for. The II-Score™ is the first algorithm built around <span className="text-white font-semibold">2026 biological standards</span> — not marketing budgets.
                    </p>
                </div>

                {/* 4 Pillars */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {FACTORS.map((factor) => (
                        <div
                            key={factor.title}
                            className={`bg-white/[0.02] border border-white/[0.06] rounded-3xl p-7 hover:bg-white/[0.05] transition-all hover:-translate-y-1 hover:shadow-xl ${factor.glow} group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${factor.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                {factor.icon}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-bold text-white">{factor.title}</h3>
                                <span className="text-[10px] font-black text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                                    {factor.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {factor.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bonus / Penalty bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {PENALTIES.map((p) => (
                        <div key={p.label} className="flex items-start gap-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-4">
                            <div className="text-[#d4af37] mt-0.5 shrink-0">{p.icon}</div>
                            <div>
                                <div className="text-sm font-bold text-white mb-0.5">{p.label}</div>
                                <div className="text-xs text-gray-500">{p.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="p-8 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-[2rem] border border-[#d4af37]/15 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">No Pay-to-Rank Policy</div>
                        <p className="text-lg font-bold text-white">Nobody buys a higher II-Score™. Rankings are pure data.</p>
                        <p className="text-sm text-gray-500 mt-1">Providers may buy featured placement (disclosed clearly). Their II-Score remains immutable.</p>
                    </div>
                    <Link
                        href="/methodology"
                        className="shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-[#0d1420] font-black rounded-2xl hover:bg-[#c0a030] shadow-xl shadow-[#d4af37]/10 transition-all text-sm uppercase tracking-widest group"
                    >
                        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        II-Score™ Methodology — Read How We Score
                    </Link>
                </div>
            </div>
        </section>
    )
}
