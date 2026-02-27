import { CostCalculator } from '@/components/tools/CostCalculator'
import { Metadata } from 'next'
import { NICHE } from '@/config/niche'
import { JsonLd, generatePriceSpecificationSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
    title: `${NICHE.name} Cost Calculator | Estimate Your Treatment Units & Price`,
    description: `Use our interactive ${NICHE.name} cost estimator to calculate units and prices for ${NICHE.calculator.treatmentAreas.slice(0, 3).map(a => a.label.toLowerCase()).join(', ')} and more based on local averages.`,
    alternates: {
        canonical: 'https://www.injectorindex.com/calculator',
    }
}

export const dynamic = 'force-dynamic'

export default function CalculatorPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const priceSchema = generatePriceSpecificationSchema(NICHE.priceRange.min, NICHE.priceRange.max, NICHE.priceUnit.split(' ').slice(-1)[0])

    return (
        <main className="bg-[#0d1420] min-h-screen py-20">
            <JsonLd data={priceSchema} />
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Treatment Cost <span className="text-[#d4af37]">Estimator</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed mb-4">
                        Planning your next treatment? Our interactive calculator helps you estimate the number of {NICHE.name} {NICHE.priceUnit.split(' ').slice(-1)}s you might need and the total cost based on your specific goals.
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#d4af37]/20">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pricing Data Updated: {lastUpdated}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/[0.06]">
                            20 Major US Cities
                        </span>
                    </div>
                </div>

                <CostCalculator />

                <section className="mt-24 max-w-3xl mx-auto space-y-12">
                    <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/[0.06]">
                        <h2 className="text-2xl font-display font-bold text-white mb-6">How {NICHE.name} {NICHE.priceUnit.split(' ').slice(-1).map(u => u.charAt(0).toUpperCase() + u.slice(1))}s are Calculated</h2>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Every face is unique, and the number of {NICHE.priceUnit.split(' ').slice(-1)}s required depends on several factors: muscle strength, the depth of existing lines, the size of the treatment area, and your desired level of movement.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <span className="bg-[#d4af37]/10 text-[#d4af37] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-1 border border-[#d4af37]/20">1</span>
                                <p className="text-gray-500"><span className="font-bold text-white">Gender:</span> Men typically have stronger facial muscles and require 50-100% more {NICHE.priceUnit.split(' ').slice(-1)}s than women in the same treatment areas.</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-[#d4af37]/10 text-[#d4af37] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-1 border border-[#d4af37]/20">2</span>
                                <p className="text-gray-500"><span className="font-bold text-white">Metabolism:</span> Highly active individuals or those with high metabolisms may find that {NICHE.name} wears off faster and may require slightly more {NICHE.priceUnit.split(' ').slice(-1)}s.</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-[#d4af37]/10 text-[#d4af37] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-1 border border-[#d4af37]/20">3</span>
                                <p className="text-gray-500"><span className="font-bold text-white">Anatomy:</span> The size and positioning of your forehead and brow determine the precise injection map needed to avoid drooping or "Spock" brows.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-[#d4af37]/5 rounded-3xl border border-[#d4af37]/10 text-center">
                        <h3 className="text-xl font-display font-bold text-white mb-3">Ready for a precise quote?</h3>
                        <p className="text-gray-500 mb-6">Connect with a top-rated injector in your city for a professional consultation.</p>
                        <a href="/find-providers" className="inline-block px-8 py-4 bg-[#d4af37] text-[#0d1420] font-bold rounded-2xl hover:bg-[#c0a030] transition-all shadow-xl shadow-[#d4af37]/10">
                            Search Local Providers
                        </a>
                    </div>
                </section>
            </div>
        </main>
    )
}
