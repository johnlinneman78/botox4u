import Link from 'next/link'
import { headers } from 'next/headers'
import { MapPin, ChevronRight } from 'lucide-react'
import { NICHE } from '@/config/niche'

const FEATURED_CITIES = [
    { name: 'New York', state: 'NY', slug: 'ny/new-york', avgCost: 18, providers: 142, tag: '🔬 Clinical Precision', avgII: 92, trueScore: 94, topSearch: 'Botox, Lip Filler' },
    { name: 'Los Angeles', state: 'CA', slug: 'ca/los-angeles', avgCost: 14, providers: 128, tag: '🌟 Celebrity Standard', avgII: 88, trueScore: 91, topSearch: 'Botox, Jawline' },
    { name: 'Miami', state: 'FL', slug: 'fl/miami', avgCost: 16, providers: 95, tag: '☀️ Luxury Market', avgII: 84, trueScore: 89, topSearch: 'Lip Filler, Jawline' },
    { name: 'Chicago', state: 'IL', slug: 'il/chicago', avgCost: 12, providers: 82, tag: '💼 Value Leader', avgII: 82, trueScore: 87, topSearch: 'Botox, Dysport' },
    { name: 'Dallas', state: 'TX', slug: 'tx/dallas', avgCost: 13, providers: 78, tag: '🤠 Rapid Growth', avgII: 83, trueScore: 85, topSearch: 'Botox, Filler' },
    { name: 'Houston', state: 'TX', slug: 'tx/houston', avgCost: 12, providers: 85, tag: '🚀 Volume Center', avgII: 81, trueScore: 84, topSearch: 'Botox, Fillers' },
    { name: 'Seattle', state: 'WA', slug: 'wa/seattle', avgCost: 16, providers: 72, tag: '🔬 Innovation Hub', avgII: 86, trueScore: 88, topSearch: 'Botox, Fillers' },
    { name: 'Scottsdale', state: 'AZ', slug: 'az/scottsdale', avgCost: 13, providers: 64, tag: '🌵 Med-Spa Capital', avgII: 85, trueScore: 86, topSearch: 'Botox, Filler' },
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
                            Real pricing, verified credentials, and TrueScore™ rankings — every city.
                        </p>
                    </div>
                    <Link href={`/${NICHE.baseSlug}`} className="group flex items-center gap-3 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-6 py-2.5 rounded-xl font-black text-sm hover:bg-[#d4af37]/20 transition-all shrink-0">
                        Browse All Cities
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d4af37] text-[#0d1420] text-[10px]">22</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sorted.map((city) => (
                        <Link key={city.slug} href={`/${NICHE.baseSlug}/${city.slug}`} className="group">
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
                                    <p className="text-[10px] text-gray-500 font-bold mb-3">{city.tag}</p>
                                )}

                                <div className="space-y-1.5 text-[11px]">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Avg. per unit</span>
                                        <span className="font-bold text-[#d4af37]">${city.avgCost}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>TrueScore™</span>
                                        <span className="font-bold text-[#d4af37]">{city.trueScore}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Providers indexed</span>
                                        <span className="font-bold text-white">{city.providers}</span>
                                    </div>
                                    {city.topSearch && (
                                        <div className="pt-2 mt-2 border-t border-white/[0.05]">
                                            <div className="text-[9px] text-gray-700 uppercase font-black mb-0.5">Most searched:</div>
                                            <div className="text-[10px] text-gray-400 font-medium italic">{city.topSearch}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors flex items-center gap-1">
                                    View Rankings <ChevronRight className="w-3 h-3" />
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
