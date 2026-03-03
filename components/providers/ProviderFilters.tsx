'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NICHE } from '@/config/niche'

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

    const handleSearch = (overrideView?: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (city) params.set('city', city)
        else params.delete('city')

        if (state) params.set('state', state)
        else params.delete('state')

        if (tier) params.set('tier', tier)
        else params.delete('tier')

        if (type) params.set('type', type)
        else params.delete('type')

        const finalView = typeof overrideView === 'string' ? overrideView : view
        if (finalView) params.set('view', finalView)
        else params.set('view', 'specialist')

        if (city || state) params.delete('q')

        router.push(`/find-providers?${params.toString()}`)
    }

    const handleRemoveFilter = (key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)

        if (key === 'city') setCity('')
        if (key === 'state') setState('')
        if (key === 'tier') setTier('')
        if (key === 'type') setType('')
        if (key === 'view') {
            setView('specialist')
            params.set('view', 'specialist')
        }

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
        <div
            className="p-6 rounded-2xl border mb-8"
            style={{
                background: 'white',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label
                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        City
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Los Angeles"
                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-[var(--color-taupe)]"
                        style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-espresso)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div>
                    <label
                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        State
                    </label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. CA"
                        maxLength={2}
                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-[var(--color-taupe)] uppercase"
                        style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-espresso)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div>
                    <label
                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        Provider Type
                    </label>
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                            style={{
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-espresso)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">All Types</option>
                            <option value="artisan">Artisan (Independent/Specialist)</option>
                            <option value="institutional">Institutional (Clinic/Medspa)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <label
                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        Filter Integrity
                    </label>
                    <div
                        className="flex rounded-xl p-1"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                        <button
                            onClick={() => { setView('specialist'); handleSearch('specialist'); }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'specialist' ? 'shadow-sm' : ''}`}
                            style={{
                                background: view === 'specialist' ? 'white' : 'transparent',
                                color: view === 'specialist' ? 'var(--color-espresso)' : 'var(--color-taupe)'
                            }}
                        >
                            Specialists
                        </button>
                        <button
                            onClick={() => { setView('general'); handleSearch('general'); }}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'general' ? 'shadow-sm' : ''}`}
                            style={{
                                background: view === 'general' ? 'white' : 'transparent',
                                color: view === 'general' ? 'var(--color-espresso)' : 'var(--color-taupe)'
                            }}
                        >
                            General
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="md:col-start-4 flex gap-2">
                    <Button
                        variant="primary"
                        className="flex-1 py-3"
                        onClick={() => handleSearch()}
                    >
                        Find Providers
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4"
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('lat', pos.coords.latitude.toString());
                                    params.set('lng', pos.coords.longitude.toString());
                                    router.push(`/find-providers?${params.toString()}`);
                                });
                            }
                        }}
                        title="Search Near Me"
                    >
                        <MapPin className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4"
                        onClick={resetFilters}
                        title="Reset Filters"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {searchParams.get('city') && (
                    <BadgeOnFilter label={`City: ${searchParams.get('city')}`} onRemove={() => handleRemoveFilter('city')} />
                )}
                {searchParams.get('state') && (
                    <BadgeOnFilter label={`State: ${searchParams.get('state')}`} onRemove={() => handleRemoveFilter('state')} />
                )}
                {searchParams.get('tier') && (
                    <BadgeOnFilter label={`Tier: ${searchParams.get('tier')}`} onRemove={() => handleRemoveFilter('tier')} />
                )}
                {searchParams.get('type') && (
                    <BadgeOnFilter label={`Type: ${searchParams.get('type')}`} onRemove={() => handleRemoveFilter('type')} />
                )}
                {searchParams.get('view') && searchParams.get('view') === 'general' && (
                    <BadgeOnFilter label={`View: General Directory`} onRemove={() => handleRemoveFilter('view')} />
                )}
            </div>
        </div>
    )
}

function BadgeOnFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full border"
            style={{
                background: 'var(--color-surface)',
                color: 'var(--color-espresso)',
                borderColor: 'var(--color-border)'
            }}
        >
            {label}
            <button
                onClick={onRemove}
                className="hover:text-[var(--color-sage)] transition-colors ml-1"
                aria-label={`Remove filter ${label}`}
            >
                ✕
            </button>
        </span>
    )
}
