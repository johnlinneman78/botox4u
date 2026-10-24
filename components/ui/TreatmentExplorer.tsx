'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { RevealSection } from './RevealSection'

const treatments = [
    {
        label: 'Botox & Dysport',
        query: 'botox',
        title: 'Smooth lines, not your identity.',
        description: 'Neurotoxins relax the muscles that create dynamic wrinkles — forehead lines, crow\'s feet, and frown lines. Results last 3–4 months. Expect $10–$18/unit depending on your city.',
        tags: ['Forehead', 'Crow\'s Feet', '11 Lines', 'Masseter'],
    },
    {
        label: 'Lip Filler',
        query: 'filler',
        title: 'Volume and shape, done right.',
        description: 'Hyaluronic acid fillers add subtle volume and definition to lips. A skilled injector focuses on proportion and balance — not overcorrection. Expect $500–$900/syringe.',
        tags: ['Shape', 'Volume', 'Hydration', 'Border Definition'],
    },
    {
        label: 'Cheek & Jaw Filler',
        query: 'cheek',
        title: 'Structure that looks like yours.',
        description: 'Mid-face and jawline filler restores lost volume and contours the face. Results last 12–18 months. Key: finding someone who sculpts conservatively.',
        tags: ['Cheekbone', 'Jawline', 'Chin', 'Mid-face'],
    },
    {
        label: 'Daxxify',
        query: 'daxxify',
        title: 'Longer-lasting. Peptide-powered.',
        description: 'Daxxify is the newest FDA-approved neurotoxin. It uses a peptide (not a protein) to extend duration — averaging 6 months vs. 3–4 with traditional Botox.',
        tags: ['Long-lasting', 'Peptide', 'FDA Approved'],
    },
    {
        label: 'Sculptra',
        query: 'sculptra',
        title: 'Collagen you build yourself.',
        description: 'Sculptra stimulates your own collagen production over 2–3 sessions. Results are gradual (appearing over weeks) and last up to 2 years. Best for full-face volume loss.',
        tags: ['Collagen', 'Gradual', 'Full-face', 'Long-lasting'],
    },
    {
        label: 'Polynucleotides',
        query: 'polynucleotides',
        title: 'Skin regeneration from within.',
        description: 'The newest category in injectable aesthetics. Polynucleotides (like Ameela and Plinest) stimulate tissue repair at the cellular level. Early results show improved texture, hydration, and elasticity.',
        tags: ['Regenerative', 'Texture', 'Under-eye', 'Bio-remodeling'],
    },
]

export function TreatmentExplorer() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleClick = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index))
    }

    const isOpen = activeIndex !== null

    return (
        <section style={{ padding: 'var(--space-xl) 0' }}>
            <div className="container-content">
                <RevealSection>
                    {/* Eyebrow */}
                    <span
                        className="font-body uppercase font-medium block mb-3"
                        style={{
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-sage)',
                        }}
                    >
                        What Are You Looking For?
                    </span>

                    {/* Title */}
                    <h2
                        className="font-display mb-8"
                        style={{
                            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                            fontWeight: 400,
                            color: 'var(--color-espresso)',
                        }}
                    >
                        Explore treatments — tap one to learn more.
                    </h2>

                    {/* Treatment pills */}
                    <div className="flex flex-wrap gap-2.5 mb-0">
                        {treatments.map((t, i) => (
                            <button
                                key={t.label}
                                onClick={() => handleClick(i)}
                                className="font-body font-medium cursor-pointer transition-all"
                                style={{
                                    fontSize: '13px',
                                    padding: '10px 22px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: `1px solid ${activeIndex === i ? 'var(--color-espresso)' : 'var(--color-border)'}`,
                                    background: activeIndex === i ? 'var(--color-espresso)' : 'var(--color-surface)',
                                    color: activeIndex === i ? 'var(--color-linen)' : 'var(--color-espresso)',
                                    transitionDuration: '200ms',
                                    transitionTimingFunction: 'var(--ease)',
                                    transform: 'scale(1)',
                                }}
                                onMouseEnter={(e) => {
                                    if (activeIndex !== i) {
                                        e.currentTarget.style.background = 'var(--color-blush)'
                                        e.currentTarget.style.borderColor = 'var(--color-blush)'
                                        e.currentTarget.style.transform = 'scale(1.02)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeIndex !== i) {
                                        e.currentTarget.style.background = 'var(--color-surface)'
                                        e.currentTarget.style.borderColor = 'var(--color-border)'
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content panel */}
                    <div
                        ref={contentRef}
                        className="overflow-hidden"
                        style={{
                            maxHeight: isOpen ? 300 : 0,
                            opacity: isOpen ? 1 : 0,
                            transition: 'max-height 380ms var(--ease), opacity 380ms var(--ease)',
                            marginTop: isOpen ? 24 : 0,
                        }}
                    >
                        {activeIndex !== null && (
                            <div
                                className="p-8 rounded-lg"
                                style={{
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <h3
                                    className="font-display font-medium mb-2"
                                    style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                                >
                                    {treatments[activeIndex].title}
                                </h3>
                                <p
                                    className="font-body mb-4"
                                    style={{
                                        fontSize: '15px',
                                        color: 'var(--color-stone)',
                                        lineHeight: 1.7,
                                        maxWidth: 'var(--max-reading)',
                                    }}
                                >
                                    {treatments[activeIndex].description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {treatments[activeIndex].tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/find-providers?q=${treatments[activeIndex].query}`}
                                            aria-label={`Find ${treatments[activeIndex].label} providers`}
                                            className="font-body rounded-pill px-3 py-1 cursor-pointer transition-all"
                                            style={{
                                                fontSize: '11px',
                                                background: 'var(--color-surface)',
                                                color: 'var(--color-espresso)',
                                                border: '1px solid var(--color-border)',
                                                textDecoration: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--color-blush)'
                                                e.currentTarget.style.borderColor = 'var(--color-blush)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'var(--color-surface)'
                                                e.currentTarget.style.borderColor = 'var(--color-border)'
                                            }}
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </RevealSection>
            </div>
        </section>
    )
}
