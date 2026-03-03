'use client'

import { Button } from '@/components/ui/Button'
import { Search, MapPin, DollarSign, Sparkles } from 'lucide-react'
import { NICHE } from '@/config/niche'

export default function Hero({ city, state, userLat, userLng }: { city?: string, state?: string, userLat?: number, userLng?: number }) {
    return (
        <section
            className="relative overflow-hidden pt-32 pb-24"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Background Decorative elements */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.4] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-blush) 0%, transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.2] blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-sage) 0%, transparent 70%)' }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm border backdrop-blur-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-stone)'
                        }}
                    >
                        <Sparkles className="w-3 h-3 mr-2" style={{ color: 'var(--color-gold)' }} />
                        Transparent Pricing • Verified Providers
                    </div>

                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-display font-medium mb-6 leading-[1.05] tracking-tight"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        {city ? `${city}'s` : "The Nation's"} Most Trusted <br />
                        <span style={{ color: 'var(--color-gold)' }}>Provider Index</span>
                        <span
                            className="block text-3xl md:text-4xl lg:text-5xl mt-4 font-display italic font-light opacity-90"
                            style={{ color: 'var(--color-stone)' }}
                        >
                            ranked by clinical data
                        </span>
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-body"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        Compare verified injectors side-by-side in {city || 'your area'}. See actual per-unit pricing, clinical credentials,
                        and specialized expertise. No pay-to-play rankings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Find Top-Rated Injectors
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View Local Pricing
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-20 pt-10 border-t max-w-5xl mx-auto"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    {[
                        { value: '500+', label: 'Verified Clinics' },
                        { value: '$12–25', label: 'Unit Pricing' },
                        { value: '94', label: 'Top Clarity Score™' },
                        { value: '22', label: 'US Markets' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div
                                className="text-3xl font-display font-medium mb-1"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="text-[10px] uppercase tracking-[0.15em] font-bold"
                                style={{ color: 'var(--color-stone)' }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
