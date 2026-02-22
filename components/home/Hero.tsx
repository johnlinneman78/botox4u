'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Search, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import Link from 'next/link'

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
    const [isLocal, setIsLocal] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setUserCoords({ lat: latitude, lng: longitude })

                // Portland Check (Rough bbox)
                if (latitude > 45.4 && latitude < 45.6 && longitude > -122.8 && longitude < -122.5) {
                    setIsLocal(true)
                }
            }, (err) => console.log('Geolocation disabled'), { timeout: 10000 })
        }
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        let url = `/find-providers`
        const params = new URLSearchParams()

        if (searchQuery.trim()) {
            params.set('q', searchQuery)
        }

        if (userCoords) {
            params.set('lat', userCoords.lat.toString())
            params.set('lng', userCoords.lng.toString())
        }

        if (params.toString()) {
            url += `?${params.toString()}`
        }

        router.push(url)
    }

    const bullets = [
        "Avoid over-injection with our Natural Results filter",
        "See real per-unit pricing before you book",
        "Every provider NPI-verified against federal records"
    ]

    return (
        <section className="relative bg-[#1a2332] text-white py-24 md:py-32 overflow-hidden min-h-[70vh] flex items-center">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
                {/* Gold Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] opacity-[0.05] blur-[160px] rounded-full pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge/Logo */}
                    <div className="flex justify-center mb-10">
                        <div className="h-16 w-auto">
                            <Logo variant="shield" className="h-full" theme="dark" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.1] text-balance">
                        {isLocal ? (
                            <>Portland's Most Transparent <span className="text-[#d4af37]">Botox Index</span></>
                        ) : (
                            <>Find Your Perfect Injector. <span className="text-[#d4af37]">Without the Guesswork.</span></>
                        )}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
                        We score every provider on natural results, real pricing, and verified credentials — so you can compare in minutes.
                    </p>

                    {/* Bullets */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
                        {bullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm md:text-base font-medium text-white/90">
                                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
                                <span>{bullet}</span>
                            </div>
                        ))}
                    </div>

                    {/* Search bar is the visual anchor */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-0 shadow-2xl shadow-black/40 rounded-2xl overflow-hidden border border-white/10">
                            <div className="relative flex-1 bg-white">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter City or Zip Code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-16 pl-14 pr-6 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-16 px-10 bg-[#d4af37] hover:bg-[#c0a030] text-[#1a2332] font-bold text-lg transition-all rounded-none"
                            >
                                Compare Botox Prices Near Me
                            </Button>
                        </form>
                    </div>

                    {/* Secondary CTA */}
                    <div className="mb-12">
                        <Link href="/find-providers" className="text-gray-400 hover:text-[#d4af37] font-medium transition-colors inline-flex items-center gap-2">
                            Or browse top-scoring providers <span className="text-xl">→</span>
                        </Link>
                    </div>

                    {/* Trust Strip */}
                    <div className="pt-8 border-t border-white/10 inline-block">
                        <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase">
                            100% independent. Nobody pays for a higher score. Backed by 15,000+ provider reviews analyzed.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
