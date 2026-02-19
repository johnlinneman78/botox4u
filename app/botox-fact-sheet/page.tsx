import { Info, HelpCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import { NICHE } from '@/config/niche'

export default function BotoxFactSheet() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-secondary/5 border-b border-secondary/10 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-[#1a2332] text-xs font-black tracking-widest uppercase mb-6 shadow-lg">
                        Medical Disclaimer: For Educational Purposes Only
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6">The {NICHE.name} Fact Sheet</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about {NICHE.namePlural.toLowerCase()}, {NICHE.priceUnit.split(' ').slice(-1)}s, and what to expect before your first treatment.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto py-16 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-3xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                                <Info className="text-secondary w-8 h-8" />
                                What is {NICHE.name}?
                            </h2>
                            <div className="prose prose-lg text-gray-600">
                                <p>
                                    {NICHE.name} is a professional aesthetic treatment designed to enhance your appearance and boost confidence. While there are several options available, {NICHE.siteName} helps you find the best {NICHE.providerTypePlural} for your needs.
                                </p>
                                <p className="mt-4">
                                    When injected into specific muscles, it blocks the nerve signals that cause contraction, resulting in smoother skin and a more youthful appearance.
                                </p>
                            </div>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-display font-bold text-primary mb-8 flex items-center gap-3">
                                <Clock className="text-secondary w-7 h-7" />
                                Timeline of Results
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="text-secondary font-black text-xl mb-2">2-4 Days</div>
                                    <p className="text-sm text-gray-500">First signs of movement restriction begin to show.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="text-secondary font-black text-xl mb-2">10-14 Days</div>
                                    <p className="text-sm text-gray-500">Peak results. Muscles are fully relaxed and skin is smooth.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="text-secondary font-black text-xl mb-2">3-4 Months</div>
                                    <p className="text-sm text-gray-500">Results gradually fade as muscle movement returns.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-display font-bold text-primary mb-8 flex items-center gap-3">
                                <CheckCircle2 className="text-secondary w-8 h-8" />
                                Common Treatment Areas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {NICHE.calculator.treatmentAreas.map((item, idx) => (
                                    <div key={idx} className="p-6 border border-gray-100 rounded-2xl hover:border-secondary/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-primary">{item.label}</h3>
                                            <span className="text-xs font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded uppercase">{item.minUnits || item.defaultUnits}–{item.maxUnits || item.defaultUnits * 1.5} {NICHE.priceUnit.split(' ').slice(-1)}s</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#1a2332] text-white p-8 rounded-3xl shadow-xl">
                            <ShieldAlert className="w-10 h-10 text-secondary mb-6" />
                            <h3 className="text-xl font-bold mb-4">Safety Checklist</h3>
                            <ul className="space-y-4 text-sm text-gray-300">
                                <li className="flex gap-3">
                                    <span className="text-secondary font-bold">01</span>
                                    <span>Only get treated by licensed MDs, NPs, or RNs.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary font-bold">02</span>
                                    <span>Ensure the product is authentic (Allergan, Galderma, etc).</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary font-bold">03</span>
                                    <span>Request to see the vial and expiration date.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary font-bold">04</span>
                                    <span>Avoid "Botox Parties" in residential homes.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm">
                            <HelpCircle className="w-8 h-8 text-secondary mb-4" />
                            <h3 className="text-lg font-bold text-primary mb-4">{NICHE.priceUnit.split(' ').slice(-1).map(u => u.charAt(0).toUpperCase() + u.slice(1))}s vs. Price?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                Most ethical {NICHE.providerTypePlural} charge <strong>{NICHE.priceUnit}</strong>. Beware of clinics charging "per area," as this often leads to over-paying for small areas or under-treatment for large ones.
                            </p>
                            <a href="/calculator" className="text-sm font-bold text-secondary hover:underline">
                                Try our Unit Calculator →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
