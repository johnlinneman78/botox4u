'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/find-providers?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20 md:py-28">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-balance">
                        Find Top Botox Providers Near You
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90">
                        Compare prices, read reviews, and book consultations with verified injectors across the United States
                    </p>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Enter city or zip code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                                Search
                            </Button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push('/calculator')}
                            className="bg-white/10 hover:bg-white/20 border-white/20"
                        >
                            📊 Treatment Cost Estimator
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push('/botox/beverly-hills-ca')}
                            className="bg-white/10 hover:bg-white/20 border-white/20"
                        >
                            📍 Botox in Beverly Hills
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-4xl font-bold mb-2">1,000+</div>
                            <div className="text-white/80">Verified Providers</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-4xl font-bold mb-2">$475</div>
                            <div className="text-white/80">Average Cost</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-4xl font-bold mb-2">50</div>
                            <div className="text-white/80">States Covered</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
