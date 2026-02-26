import { Dna, ShieldCheck, Cpu, Award, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const FACTORS = [
    {
        title: 'Injection Quality',
        label: 'Primary Weight (40%)',
        description: 'AI-assisted analysis of patient reviews and result consistency. We prioritize "natural," "subtle," and "refined" results over "frozen" or "migrated" red flags.',
        icon: <ShieldCheck className="w-7 h-7" />,
        color: 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20',
        glow: 'shadow-[#d4af37]/10',
    },
    {
        title: 'Provider Credentials',
        label: 'Trust Weight (25%)',
        description: 'Verified NPI federal registration, board certifications, and clinical experience. We bridge the gap between "aesthetician" and "medical elite."',
        icon: <Award className="w-7 h-7" />,
        color: 'bg-blue-950/50 text-blue-400 border-blue-800/40',
        glow: 'shadow-blue-500/10',
    },
    {
        title: 'Innovation Adoption',
        label: 'Growth Weight (20%)',
        description: 'Adoption of next-gen tech: Daxxify (longevity), Exosomes, and Ultrasound-guided injections. Moving beyond legacy 1990s protocols.',
        icon: <Cpu className="w-7 h-7" />,
        color: 'bg-violet-950/50 text-violet-400 border-violet-800/40',
        glow: 'shadow-violet-500/10',
    },
    {
        title: 'Treatment Range',
        label: 'Breadth Weight (15%)',
        description: 'Evaluating the clinician\'s full scope. From masseter Botox (TMJ) to advanced full-face liquid lifts and biostimulators.',
        icon: <TrendingUp className="w-7 h-7" />,
        color: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40',
        glow: 'shadow-emerald-500/10',
    },
]

const PENALTIES = [
    {
        label: '"Pillow-Face" Penalty',
        desc: 'Reviews mentioning overfilled, unnatural, or migrated results trigger an automated TrueScore™ deduction.',
        icon: <AlertTriangle className="w-4 h-4" />
    },
    {
        label: 'Innovation Premium',
        desc: 'Gen Z-focused, conservative micro-dose protocols and bio-stimulator expertise earn an algorithmic boost.',
        icon: <TrendingUp className="w-4 h-4" />
    },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#0d1420] border-t border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" /> TrueScore™ 2026 Ranking Algorithm
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        The First Data-Driven <span className="text-[#d4af37]">Standard</span> for Injectors
                    </h2>
                    <div className="flex justify-center mb-8">
                        <Link
                            href="/methodology"
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all text-xs font-black uppercase tracking-widest group"
                        >
                            <ShieldCheck className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                            Full TrueScore™ Methodology →
                        </Link>
                    </div>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        Legacy directories rank by reviews bought and stars paid for. <span className="text-white font-semibold">TrueScore™</span> is the first independent algorithm built around <span className="text-white font-semibold">clinical quality</span> — not marketing budgets.
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
                        <div className="text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">Independent Accountability</div>
                        <p className="text-lg font-bold text-white">Nobody buys a higher TrueScore™. Rankings are pure data.</p>
                        <p className="text-sm text-gray-500 mt-1">Providers may buy featured search placement (clearly disclosed). Their TrueScore remains independent and immutable.</p>
                    </div>
                    <div className="shrink-0 text-[#d4af37]/40">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                </div>
            </div>
        </section>
    )
}
