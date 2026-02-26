import { Suspense } from 'react'
import { EnhancedProviderCard } from '@/components/providers/EnhancedProviderCard'
import { ProviderFilters } from '@/components/providers/ProviderFilters'
import { Button } from '@/components/ui/Button'
import { getProvidersWithSearch } from '@/lib/actions/providers'
import { GeolocationSorter } from '@/components/providers/GeolocationSorter'
import { NICHE } from '@/config/niche'
import { Dna, ShieldCheck } from 'lucide-react'

export default async function FindProvidersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; city?: string; state?: string; tier?: string; type?: string; view?: string; lat?: string; lng?: string }>
}) {
    const sParams = await searchParams
    const query = sParams.q || ''
    const city = sParams.city || ''
    const state = sParams.state || ''
    const tier = sParams.tier || ''
    const type = sParams.type || ''
    const view = sParams.view
    const userLat = sParams.lat ? parseFloat(sParams.lat) : undefined
    const userLng = sParams.lng ? parseFloat(sParams.lng) : undefined

    const providers = await getProvidersWithSearch({
        query,
        city,
        state,
        tier,
        type,
        view,
        userLat,
        userLng
    })

    return (
        <div className="bg-[#0d1420] min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <GeolocationSorter />
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        Explore {query ? (query.charAt(0).toUpperCase() + query.slice(1)) : NICHE.name} Providers
                    </h1>
                    <p className="text-gray-500">
                        Showing <span className="font-semibold text-white">{providers.length}</span> results for
                        <span className="font-semibold text-white">
                            {city || state ? ` ${city}${state ? `, ${state}` : ''}` : ` "${query || 'All Locations'}"`}
                        </span>
                    </p>
                </div>

                <Suspense fallback={<div className="h-32 bg-white/[0.02] animate-pulse rounded-2xl mb-8 border border-white/[0.06]" />}>
                    <ProviderFilters currentCity={city} currentState={state} />
                </Suspense>

                {/* Algorithm Callout */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-2xl p-6 flex items-start gap-4 max-w-2xl flex-1">
                        <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] shrink-0">
                            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm mb-1">TrueScore™ Ranking Algorithm</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Our directory uses a 100% data-driven algorithm. Providers are ranked on
                                <b className="text-gray-400"> Injection Quality</b>, <b className="text-gray-400">Verified Credentials</b>, and <b className="text-gray-400">Clinical Innovation</b>.
                            </p>
                        </div>
                    </div>

                    {view === 'general' && (
                        <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6 flex-1">
                            <h4 className="font-bold text-red-400 text-sm mb-1 uppercase tracking-wider">General Directory Caution</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                These providers either have a <span className="text-red-400/80 font-bold">TrueScore™: PENDING</span> or insufficient clinical data for a specialist audit. Proceed with manual verification.
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((provider: any) => (
                        <EnhancedProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>

                {providers.length === 0 && (
                    <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.06] mt-8">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                            No results found in this area
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            We&apos;re constantly adding new providers. Try searching for a nearby city or check back soon!
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="/find-providers"><Button variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5">Clear Filters</Button></a>
                            <Button className="bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420]">Notify Me of Local Providers</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
