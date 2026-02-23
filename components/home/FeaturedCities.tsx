import Link from 'next/link'
import { headers } from 'next/headers'
import { MapPin, ChevronRight } from 'lucide-react'

const FEATURED_CITIES = [
    { name: 'Portland', state: 'OR', slug: 'or/portland', avgCost: 14, providers: 90, regen: true, tag: '🌿 Regen Leader', avgII: 88, regenRatio: 72 },
    { name: 'Seattle', state: 'WA', slug: 'wa/seattle', avgCost: 16, providers: 72, regen: true, tag: '🔬 PN Emerging', avgII: 84, regenRatio: 65 },
    { name: 'San Francisco', state: 'CA', slug: 'ca/san-francisco', avgCost: 19, providers: 54, regen: true, tag: '💎 Bio-Hacking Hub', avgII: 92, regenRatio: 78 },
    { name: 'Los Angeles', state: 'CA', slug: 'ca/los-angeles', avgCost: 14, providers: 128, regen: false, tag: '🌟 Celebrity Standard', avgII: 79, regenRatio: 54 },
    { name: 'New York', state: 'NY', slug: 'ny/new-york', avgCost: 18, providers: 142, regen: false, tag: '🔬 Clinical Precision', avgII: 81, regenRatio: 58 },
    { name: 'Miami', state: 'FL', slug: 'fl/miami', avgCost: 16, providers: 95, regen: false, tag: '☀️ Luxury Market', avgII: 76, regenRatio: 48 },
    { name: 'Chicago', state: 'IL', slug: 'il/chicago', avgCost: 12, providers: 82, regen: false, tag: '💼 Value Leader', avgII: 78, regenRatio: 52 },
    { name: 'Scottsdale', state: 'AZ', slug: 'az/scottsdale', avgCost: 13, providers: 64, regen: false, tag: '🌵 Med-Spa Capital', avgII: 82, regenRatio: 61 },
]

export default async function FeaturedCities() {
    const headerList = await headers()
    const userCity = headerList.get('x-vercel-ip-city') || ''

    const sorted = [...FEATURED_CITIES].sort((a, b) => {
        if (a.name === userCity) return -1
        if (b.name === userCity) return 1
        return 0
    })

    return (
        <section className="py-20 bg-[#101827] border-t border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                            Explore by City
                        </h2>
                        <p className="text-gray-500">
                            Real pricing, verified credentials, and Regen-Ratio™ rankings — every city.
                        </p>
                    </div>
                    <Link href="/botox" className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#d4af37]/20 transition-all shrink-0">
                        Browse All 22 Cities <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sorted.map((city) => (
                        <Link key={city.slug} href={`/botox/${city.slug}`} className="group">
                            <div className={`bg-white/[0.02] border rounded-2xl p-6 hover:bg-white/[0.05] hover:border-[#d4af37]/20 transition-all h-full ${city.name === userCity
                                ? 'border-[#d4af37]/30 bg-[#d4af37]/5'
                                : 'border-white/[0.06]'
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                                        <h3 className="font-bold text-white text-sm">
                                            {city.name}, {city.state}
                                        </h3>
                                    </div>
                                    {city.name === userCity && (
                                        <span className="text-[9px] text-[#d4af37] font-black uppercase tracking-widest bg-[#d4af37]/10 px-2 py-0.5 rounded-full border border-[#d4af37]/20">
                                            Near You
                                        </span>
                                    )}
                                </div>

                                {city.tag && (
                                    <p className="text-xs text-gray-500 mb-3">{city.tag}</p>
                                )}

                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Avg. per unit</span>
                                        <span className="font-bold text-[#d4af37]">${city.avgCost}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Avg. II-Score™</span>
                                        <span className="font-bold text-emerald-400">{city.avgII}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Providers indexed</span>
                                        <span className="font-bold text-white">{city.providers}</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-xs font-bold text-gray-700 group-hover:text-[#d4af37] transition-colors">
                                    View Rankings →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/claim"
                        className="text-sm text-gray-600 hover:text-[#d4af37] font-semibold transition-colors"
                    >
                        Is your clinic missing? Claim your free listing →
                    </Link>
                </div>
            </div>
        </section>
    )
}
