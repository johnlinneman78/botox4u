'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getProvidersWithSearch } from '@/lib/actions/providers'

interface ProviderMatch {
    id: string
    name: string
    city: string
    state: string
    score_total: number
    slug: string
    is_verified: boolean
}

export function ProviderLookup() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<ProviderMatch[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<ProviderMatch | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (val: string) => {
        setQuery(val)
        if (val.length < 3) {
            setResults([])
            setShowDropdown(false)
            return
        }

        setIsSearching(true)
        try {
            const matches = await getProvidersWithSearch({ query: val, view: 'specialist' }) // specialists first
            // Also search non-specialists if needed
            const allMatches = await getProvidersWithSearch({ query: val, view: 'all' })
            setResults(allMatches.slice(0, 5))
            setShowDropdown(true)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="max-w-xl w-full">
            {!selectedProvider ? (
                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isSearching ? 'text-[#d4af37] animate-pulse' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => query.length >= 3 && setShowDropdown(true)}
                            placeholder="Enter your clinic name..."
                            className="w-full h-16 pl-12 pr-4 bg-white/[0.03] border border-white/[0.1] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] placeholder:text-gray-600 transition-all text-lg"
                        />
                    </div>

                    {showDropdown && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {results.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setSelectedProvider(p)
                                        setShowDropdown(false)
                                    }}
                                    className="w-full p-4 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{p.name}</div>
                                            <div className="text-xs text-gray-500">{p.city}, {p.state}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Current II-Score</div>
                                            <div className="text-lg font-black text-[#d4af37]">{Math.round(p.score_total)}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {query.length >= 3 && results.length === 0 && !isSearching && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-white/10 rounded-2xl p-4 text-center text-gray-500 text-sm">
                            No clinic found matching "{query}". <Link href="/provider/new" className="text-[#d4af37] font-bold hover:underline">Add yours →</Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 rounded-[2rem] p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37] text-[#0d1420] text-[10px] font-black tracking-widest uppercase mb-4">
                                <CheckCircle2 className="w-3 h-3" /> Already Indexed
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{selectedProvider.name}</h3>
                            <p className="text-gray-400 text-sm">{selectedProvider.city}, {selectedProvider.state}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-1">Data-Generated Score</div>
                            <div className="text-5xl font-display font-black text-white leading-none">
                                {Math.round(selectedProvider.score_total)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Visibility Rank</div>
                            <div className="text-white font-bold">Top 15% in {selectedProvider.city}</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Claim Status</div>
                            <div className="text-amber-500 font-bold flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-amber-500" /> Action Required
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/provider/claim?id=${selectedProvider.id}`} className="flex-1">
                            <Button className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black py-6 rounded-xl shadow-xl shadow-[#d4af37]/10 transition-all uppercase tracking-widest text-xs group">
                                Claim & Upgrade Profile
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProvider(null)}
                            className="bg-transparent border-white/10 text-gray-400 hover:bg-white/5 py-6 rounded-xl text-xs font-bold uppercase tracking-widest"
                        >
                            Not my clinic
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
