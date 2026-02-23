'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface ProviderFiltersProps {
    currentCity?: string
    currentState?: string
}

export function ProviderFilters({ currentCity = '', currentState = '' }: ProviderFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [city, setCity] = useState(currentCity)
    const [state, setState] = useState(currentState)
    const [tier, setTier] = useState(searchParams.get('tier') || '')
    const [type, setType] = useState(searchParams.get('type') || '')
    const [view, setView] = useState(searchParams.get('view') || 'specialist')

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (city) params.set('city', city)
        else params.delete('city')

        if (state) params.set('state', state)
        else params.delete('state')

        if (tier) params.set('tier', tier)
        else params.delete('tier')

        if (type) params.set('type', type)
        else params.delete('type')

        if (view) params.set('view', view)
        else params.set('view', 'specialist')

        if (city || state) params.delete('q')

        router.push(`/find-providers?${params.toString()}`)
    }

    const resetFilters = () => {
        setCity('')
        setState('')
        setTier('')
        setType('')
        setView('specialist')
        router.push('/find-providers')
    }

    return (
        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.06] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Los Angeles"
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37]/30 outline-none transition-all placeholder:text-gray-700 text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        State
                    </label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. CA"
                        maxLength={2}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37]/30 outline-none transition-all placeholder:text-gray-700 text-white uppercase"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Provider Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37]/30 outline-none transition-all text-white appearance-none cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="artisan">Artisan (Independent/Specialist)</option>
                        <option value="institutional">Institutional (Clinic/Medspa)</option>
                    </select>
                </div>

                <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Filter Integrity
                    </label>
                    <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                        <button
                            onClick={() => setView('specialist')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'specialist' ? 'bg-[#d4af37] text-[#0d1420]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Specialists
                        </button>
                        <button
                            onClick={() => setView('general')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'general' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            General
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        className="flex-1 py-3 font-bold bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] shadow-lg shadow-[#d4af37]/10 transition-all text-sm uppercase tracking-wider"
                        onClick={handleSearch}
                    >
                        Find Providers
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4 py-2.5 border-white/10 text-gray-500 hover:bg-white/5"
                        onClick={resetFilters}
                        title="Reset Filters"
                    >
                        ↺
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {searchParams.get('city') && (
                    <BadgeOnFilter label={`City: ${searchParams.get('city')}`} onRemove={() => { setCity(''); handleSearch(); }} />
                )}
                {searchParams.get('state') && (
                    <BadgeOnFilter label={`State: ${searchParams.get('state')}`} onRemove={() => { setState(''); handleSearch(); }} />
                )}
                {searchParams.get('tier') && (
                    <BadgeOnFilter label={`Tier: ${searchParams.get('tier')}`} onRemove={() => { setTier(''); handleSearch(); }} />
                )}
                {searchParams.get('type') && (
                    <BadgeOnFilter label={`Type: ${searchParams.get('type')}`} onRemove={() => { setType(''); handleSearch(); }} />
                )}
                {searchParams.get('view') && searchParams.get('view') === 'general' && (
                    <BadgeOnFilter label={`View: General Directory`} onRemove={() => { setView('specialist'); handleSearch(); }} />
                )}
            </div>
        </div>
    )
}

function BadgeOnFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold rounded-full border border-[#d4af37]/20">
            {label}
            <button onClick={onRemove} className="hover:text-white transition-colors">✕</button>
        </span>
    )
}
