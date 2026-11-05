'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

// Short trust explanation — what the score is, in plain words.
//
// The old version animated a big "94" as if it were a score. It wasn't
// any provider's score; it was decoration, and it sat next to a stale
// description of the formula. This version says what the Clarity Score
// actually measures (v4: patient reviews 40, published pricing 10,
// contact details 7, rescaled from 57) and keeps NPI matching separate,
// because NPI verification is not part of the score.

export function StatementSection() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden selection:bg-gold/30"
            style={{
                background: 'var(--color-deep)',
                padding: '120px 48px',
                textAlign: 'center',
            }}
        >
            {/* Soft glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)',
                }}
                animate={isInView ? {
                    scale: [0.8, 1.2, 1],
                    opacity: [0, 0.6, 0.4],
                } : {}}
                transition={{ duration: 2.5, ease: "easeOut" }}
            />

            {/* Foreground content */}
            <motion.div
                className="relative z-10 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                <span
                    className="font-body uppercase font-bold block mb-6"
                    style={{
                        fontSize: '12px',
                        letterSpacing: '0.4em',
                        color: 'var(--color-gold)',
                        opacity: 0.8
                    }}
                >
                    The Selection Standard
                </span>

                <h2
                    className="font-display mb-8"
                    style={{
                        fontWeight: 300,
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        color: 'var(--color-bg)',
                        lineHeight: 1.05,
                        letterSpacing: '-0.02em'
                    }}
                >
                    The number that tells you <br className="hidden md:block" />
                    what you can confirm <em className="italic" style={{ color: 'var(--color-gold)' }}>before you book.</em>
                </h2>

                <p
                    className="font-body mx-auto mb-12"
                    style={{
                        fontSize: '18px',
                        color: 'var(--color-taupe)',
                        lineHeight: 1.6,
                        maxWidth: '600px',
                    }}
                >
                    The Clarity Score summarizes patient-review, published-pricing, and contact-information signals.
                    Practitioner NPI matching is shown separately — it never adds points, and no badge is never a
                    penalty. No pay-to-play, no shortcuts.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/methodology"
                        className="group relative px-10 py-5 rounded-full font-body font-bold text-sm tracking-widest uppercase transition-all duration-500 overflow-hidden"
                        style={{
                            background: 'var(--color-gold)',
                            color: 'var(--color-espresso)',
                        }}
                    >
                        <span className="relative z-10">How It&apos;s Calculated</span>
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            style={{ opacity: 0.1 }}
                        />
                    </Link>

                    <Link
                        href="/find-providers"
                        className="font-body font-medium text-sm tracking-widest uppercase py-3 border-b border-transparent hover:border-gold transition-all duration-300"
                        style={{ color: 'var(--color-taupe)' }}
                    >
                        See Local Rankings →
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}
