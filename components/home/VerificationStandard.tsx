import { ShieldCheck, Target, DollarSign, Activity } from 'lucide-react'
import { NICHE } from '@/config/niche'

export default function VerificationStandard() {
    const standards = [
        {
            title: 'Natural Results Filter',
            desc: 'We use sentiment analysis on thousands of patient reviews to identify injectors known for conservative, "not overdone" results.',
            icon: Target,
        },
        {
            title: 'NPI Database Audit',
            desc: `Every provider's credentials are cross-referenced against the federal registry to confirm their professional licensing and status.`,
            icon: Activity,
        },
        {
            title: 'Real Pricing Scraper',
            desc: `We aggregate self-reported and public pricing data to show you the actual per-unit cost before you walk in the door.`,
            icon: DollarSign,
        },
        {
            title: 'Data-Driven Trust',
            desc: 'Providers earn their rank through consistent patient satisfaction and clinical transparency, not by paying for placement.',
            icon: ShieldCheck,
        }
    ]

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6">
                            🛡️ INDEPENDENT AUDIT
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-6">
                            Our Transparency <span className="text-secondary tracking-tighter">Standard</span>
                        </h2>
                        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                            40% of patients fear over-injection. We built a data protocol to help you find the injectors who value <span className="text-primary font-bold">natural results</span> as much as you do.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {standards.map((s) => (
                            <div key={s.title} className="flex gap-6 items-start group">
                                <div className="p-4 rounded-3xl bg-white text-secondary shrink-0 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                                    <s.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-primary tracking-tight">{s.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-light">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-[2.5rem] bg-[#1a2332] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
                        <div>
                            <div className="text-secondary font-black text-xs uppercase tracking-widest mb-2">Patient Protection</div>
                            <h4 className="text-2xl font-bold mb-2">Nobody pays for a better score.</h4>
                            <p className="text-gray-300 font-light">Clinics can buy featured placement, but they cannot buy points in the results quality or trust categories.</p>
                        </div>
                        <div className="shrink-0">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-secondary font-bold shadow-sm">
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
