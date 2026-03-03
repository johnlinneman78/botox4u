'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProviderCard } from '@/components/ui/ProviderCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { FilterPill } from '@/components/ui/FilterPill'
import { Button } from '@/components/ui/Button'
import { RevealSection } from '@/components/ui/RevealSection'

// Placeholder data
const mockProviders = [
    { name: 'Dr. Sarah Chen', credentials: 'MD, Board Certified Dermatologist', specialties: ['Botox', 'Lip Filler', 'Sculptra'], outcomeTag: 'Natural Results', location: 'New York, NY', distance: '2.3 mi', clarityScore: 94, starRating: 4.9, profileUrl: '/provider/dr-sarah-chen' },
    { name: 'Dr. James Rivera', credentials: 'DO, Facial Aesthetics', specialties: ['Cheek Filler', 'Daxxify'], location: 'New York, NY', distance: '3.1 mi', clarityScore: 88, starRating: 4.8, profileUrl: '/provider/dr-james-rivera' },
    { name: 'Dr. Anika Patel', credentials: 'MD, Oculoplastic Surgeon', specialties: ['Under-Eye Filler', 'Botox'], outcomeTag: 'Conservative Approach', location: 'New York, NY', distance: '1.8 mi', clarityScore: 91, starRating: 4.9, profileUrl: '/provider/dr-anika-patel' },
    { name: 'Dr. Michael Torres', credentials: 'MD, Plastic Surgeon', specialties: ['Full Face Rejuvenation', 'Botox'], location: 'New York, NY', distance: '4.2 mi', clarityScore: 85, starRating: 4.7, profileUrl: '/provider/dr-michael-torres' },
    { name: 'Dr. Emily Nakamura', credentials: 'MD, Cosmetic Dermatologist', specialties: ['Lip Filler', 'Polynucleotides'], outcomeTag: 'Natural Results', location: 'New York, NY', distance: '5.0 mi', clarityScore: 82, starRating: 4.6, profileUrl: '/provider/dr-emily-nakamura' },
    { name: 'Dr. David Kim', credentials: 'MD, Facial Aesthetics', specialties: ['Jaw Filler', 'Masseter Botox'], location: 'New York, NY', distance: '2.8 mi', clarityScore: 79, starRating: 4.5, profileUrl: '/provider/dr-david-kim' },
]

const filterOptions = [
    { label: 'Treatment Type', variant: 'default' as const },
    { label: 'Distance', variant: 'default' as const },
    { label: 'Price Range', variant: 'default' as const },
    { label: 'Rating', variant: 'default' as const },
    { label: 'Availability', variant: 'default' as const },
    { label: 'Natural Results', variant: 'outcome' as const },
]

export default function SearchPage() {
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [loading] = useState(false)

    const city = 'New York'
    const state = 'NY'

    const toggleFilter = (label: string) => {
        setActiveFilters(prev =>
            prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
        )
    }

    return (
        <div style={{ paddingTop: 'var(--nav-height)' }}>
            {/* Page Header */}
            <section className="py-8 lg:py-12" style={{ background: 'var(--color-bg)' }}>
                <div className="container-content">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-4">
                        {[
                            { href: '/', label: 'Home' },
                            { href: '/find-providers', label: 'Search' },
                            { href: '#', label: city },
                        ].map((crumb, i, arr) => (
                            <span key={crumb.label} className="flex items-center gap-2">
                                <Link
                                    href={crumb.href}
                                    className="font-body text-xs transition-colors"
                                    style={{
                                        color: i === arr.length - 1 ? 'var(--color-espresso)' : 'var(--color-taupe)',
                                    }}
                                >
                                    {crumb.label}
                                </Link>
                                {i < arr.length - 1 && (
                                    <span style={{ color: 'var(--color-border)', fontSize: '10px' }}>·</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    <h1
                        className="font-display font-light mb-2"
                        style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                            color: 'var(--color-espresso)',
                        }}
                    >
                        Botox & Filler Providers in {city}, {state}
                    </h1>
                    <p className="font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                        {mockProviders.length} providers found · Sorted by Clarity Score™
                    </p>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <div
                className="sticky z-40"
                style={{
                    top: 'var(--nav-height)',
                    background: 'var(--color-bg)',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div className="container-content py-3">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {filterOptions.map((filter) => (
                            <FilterPill
                                key={filter.label}
                                label={filter.label}
                                variant={filter.variant}
                                active={activeFilters.includes(filter.label)}
                                onToggle={() => toggleFilter(filter.label)}
                            />
                        ))}

                        {/* Sort dropdown */}
                        <div className="ml-auto shrink-0">
                            <button
                                className="font-body text-sm font-medium cursor-pointer flex items-center gap-1"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                Sort: Clarity Score ▾
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <section className="py-10 lg:py-16">
                <div className="container-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))
                            : mockProviders.map((provider, i) => (
                                <RevealSection key={provider.name} delay={i * 60}>
                                    <ProviderCard {...provider} />
                                </RevealSection>
                            ))
                        }
                    </div>

                    {/* Inline CTA */}
                    <RevealSection>
                        <div
                            className="mt-12 p-8 lg:p-10 rounded-lg"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h3
                                className="font-display font-light mb-3"
                                style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                            >
                                What should Botox cost in {city}?
                            </h3>
                            <p
                                className="font-body mb-6"
                                style={{
                                    fontSize: '15px',
                                    color: 'var(--color-stone)',
                                    maxWidth: '520px',
                                    lineHeight: 1.7,
                                }}
                            >
                                Get a personalized price estimate based on your goals and local market rates — free, 60 seconds.
                            </p>
                            <Button variant="primary">
                                Take the Price Quiz →
                            </Button>
                        </div>
                    </RevealSection>

                    {/* Load more */}
                    <div className="mt-10 text-center">
                        <Button variant="secondary">
                            Load more providers
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
