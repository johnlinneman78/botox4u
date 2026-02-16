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

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (city) params.set('city', city)
        else params.delete('city')

        if (state) params.set('state', state)
        else params.delete('state')

        if (tier) params.set('tier', tier)
        else params.delete('tier')

        // Clear query if specific location is set to avoid confusion
        if (city || state) params.delete('q')

        router.push(`/find-providers?${params.toString()}`)
    }

    const resetFilters = () => {
        setCity('')
        setState('')
        setTier('')
        router.push('/find-providers')
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Los Angeles"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:text-gray-400 text-primary"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        State
                    </label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. CA"
                        maxLength={2}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:text-gray-400 text-primary uppercase"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Provider Tier
                    </label>
                    <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-primary appearance-none cursor-pointer"
                    >
                        <option value="">All Tiers</option>
                        <option value="premium">Premium</option>
                        <option value="featured">Featured</option>
                        <option value="free">Standard</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        className="flex-1 py-2.5"
                        onClick={handleSearch}
                    >
                        Apply Filters
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4 py-2.5"
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
            </div>
        </div>
    )
}

function BadgeOnFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
            {label}
            <button onClick={onRemove} className="hover:text-primary transition-colors">✕</button>
        </span>
    )
}
