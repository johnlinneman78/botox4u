import { ShieldCheck, Dna, DollarSign, Activity, Cpu } from 'lucide-react'

export default function VerificationStandard() {
    const standards = [
        {
            title: 'Clarity Score™ Methodology',
            desc: 'We assess every provider\'s treatment menu: what percentage is innovative (PNs, Daxxify, Exosomes) vs. legacy HA filler? Technical progress = higher trust.',
            icon: ShieldCheck,
            accent: 'text-[#C9A96E]',
            bg: 'bg-[#C9A96E]/10 border-[#C9A96E]/20',
        },
        {
            title: 'NPI Federal Registry',
            desc: 'Every provider\'s credentials are cross-referenced against the federal NPI database. We verify license type, specialty, and active status in real-time.',
            icon: Activity,
            accent: 'text-blue-400',
            bg: 'bg-blue-950/30 border-blue-800/30',
        },
        {
            title: 'Real Pricing Scraper',
            desc: 'We aggregate self-reported and public pricing data — per-unit, per-session, and per-area — so you see exact costs before you book.',
            icon: DollarSign,
            accent: 'text-amber-400',
            bg: 'bg-amber-950/30 border-amber-800/30',
        },
        {
            title: '2026 Innovation Check',
            desc: 'Is this provider offering Daxxify, ultrasound-guided technique, or exosome add-ons? Clinics that adopt 2026 standards get rewarded.',
            icon: Cpu,
            accent: 'text-violet-400',
            bg: 'bg-violet-950/30 border-violet-800/30',
        }
    ]

    return (
        <section className="py-24 bg-[#F2EDE4] border-y border-[#3D2B1F]/10">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                            🛡️ Independent Audit Protocol
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6">
                            Our Transparency <span className="text-[#C9A96E]">Standard</span>
                        </h2>
                        <p className="text-xl text-[#3D2B1F]/70 font-light max-w-2xl mx-auto leading-relaxed">
                            40% of patients fear over-injection. We built a data protocol to find injectors who value <span className="text-[#3D2B1F] font-semibold">biological repair</span> — not volume.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {standards.map((s) => (
                            <div key={s.title} className="flex gap-5 items-start group">
                                <div className={`p-4 rounded-2xl ${s.bg} border shrink-0 group-hover:scale-110 transition-transform`}>
                                    <s.icon className={`w-7 h-7 ${s.accent}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-[#3D2B1F]">{s.title}</h3>
                                    <p className="text-[#3D2B1F]/60 leading-relaxed text-sm">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 rounded-[2.5rem] bg-gradient-to-r from-[#C9A96E]/10 to-transparent border border-[#C9A96E]/15 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="text-[#C9A96E] font-black text-xs uppercase tracking-widest mb-2">Patient Protection</div>
                            <h4 className="text-2xl font-bold text-[#3D2B1F] mb-2">Nobody pays for a better score.</h4>
                            <p className="text-[#3D2B1F]/60 font-light text-sm">Clinics can buy featured placement, but they cannot influence their proprietary clinical signals or trust categories with payment.</p>
                        </div>
                        <div className="shrink-0">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-full text-[#C9A96E] font-bold shadow-sm text-sm">
                                <ShieldCheck className="w-5 h-5" />
                                100% Data Driven
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
