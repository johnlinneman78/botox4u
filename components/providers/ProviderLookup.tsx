'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSearchParams } from 'next/navigation'
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
    const searchParams = useSearchParams()
    const plan = searchParams.get('plan') || 'free'

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
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isSearching ? 'text-[#C9A96E] animate-pulse' : 'text-[#3D2B1F]/70'}`} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => query.length >= 3 && setShowDropdown(true)}
                            placeholder="Enter your clinic name..."
                            className="w-full h-16 pl-12 pr-4 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E] placeholder:text-[#3D2B1F]/50 transition-all text-lg"
                        />
                    </div>

                    {showDropdown && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-[#3D2B1F]/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {results.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setSelectedProvider(p)
                                        setShowDropdown(false)
                                    }}
                                    className="w-full p-4 hover:bg-[#3D2B1F]/5 text-left border-b border-[#3D2B1F]/10 last:border-0 transition-colors group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-[#3D2B1F] group-hover:text-[#C9A96E] transition-colors">{p.name}</div>
                                            <div className="text-xs text-[#3D2B1F]/60">{p.city}, {p.state}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-widest mb-1">Clarity Score™</div>
                                            <div className="text-lg font-black text-[#C9A96E]">{Math.round(p.score_total)}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {query.length >= 3 && results.length === 0 && !isSearching && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FAF8F5] border border-[#3D2B1F]/10 rounded-2xl p-4 text-center text-[#3D2B1F]/60 text-sm">
                            No clinic found matching "{query}". <Link href={`/provider/signup?plan=${plan}`} className="text-[#C9A96E] font-bold hover:underline">Create a Free Account →</Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-[#C9A96E]/20 to-transparent border border-[#C9A96E]/30 rounded-[2rem] p-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96E] text-white text-[10px] font-black tracking-widest uppercase mb-4">
                                <CheckCircle2 className="w-3 h-3" /> Already Indexed
                            </div>
                            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-1">{selectedProvider.name}</h3>
                            <p className="text-[#3D2B1F]/70 text-sm">{selectedProvider.city}, {selectedProvider.state}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest mb-1">Data-Generated Score</div>
                            <div className="text-5xl font-display font-black text-[#3D2B1F] leading-none">
                                {Math.round(selectedProvider.score_total)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#3D2B1F]/5 rounded-2xl p-4 border border-[#3D2B1F]/10">
                            <div className="text-[10px] font-black text-[#3D2B1F]/60 uppercase tracking-widest mb-2">Visibility Rank</div>
                            <div className="text-[#3D2B1F] font-bold">Top 15% in {selectedProvider.city}</div>
                        </div>
                        <div className="bg-[#3D2B1F]/5 rounded-2xl p-4 border border-[#3D2B1F]/10">
                            <div className="text-[10px] font-black text-[#3D2B1F]/60 uppercase tracking-widest mb-2">Claim Status</div>
                            <div className="text-amber-500 font-bold flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-amber-500" /> Action Required
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/provider/signup?id=${selectedProvider.id}&plan=${plan}`} className="flex-1 inline-flex items-center justify-center w-full bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black py-6 rounded-xl shadow-xl shadow-[#C9A96E]/10 transition-all uppercase tracking-widest text-xs group">
                            Create Account to Claim
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProvider(null)}
                            className="bg-transparent border-[#3D2B1F]/10 text-[#3D2B1F]/70 hover:bg-[#3D2B1F]/5 py-6 rounded-xl text-xs font-bold uppercase tracking-widest"
                        >
                            Not my clinic
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
