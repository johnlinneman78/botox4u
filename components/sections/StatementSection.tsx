'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, animate } from 'framer-motion'

interface StatementSectionProps {
    topScore?: number
}

export function StatementSection({ topScore = 94 }: StatementSectionProps) {
    const [displayScore, setDisplayScore] = useState(0)
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, topScore, {
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (value) => setDisplayScore(Math.round(value))
            })
            return () => controls.stop()
        }
    }, [isInView, topScore])

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
            {/* Interactive blooming glow */}
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

            {/* Giant background number - dopamine moment */}
            <motion.span
                className="font-display absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
                style={{
                    fontSize: 'clamp(200px, 30vw, 400px)',
                    fontWeight: 300,
                    color: 'rgba(201, 169, 110, 0.04)',
                    lineHeight: 1,
                }}
                initial={{ opacity: 0, scale: 0.9, y: '-45%' }}
                animate={isInView ? { opacity: 1, scale: 1, y: '-50%' } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {displayScore}
            </motion.span>

            {/* Foreground content */}
            <motion.div
                className="relative z-10 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                    everything ads <em className="italic" style={{ color: 'var(--color-gold)' }}>won&apos;t.</em>
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
                    Our Clarity Score™ analyzes clinical credentials, verified patient outcome signals, and price transparency to score every provider independently. No pay-to-play, no shortcuts.
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
