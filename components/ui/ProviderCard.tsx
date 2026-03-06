'use client'

import React, { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { ClarityBadge } from './ClarityBadge'
import { Search, Shield, Activity, CheckCircle2 } from 'lucide-react'

interface ProviderCardProps {
    name: string
    credentials?: string
    specialties?: string[]
    outcomeTag?: string
    location: string
    distance?: string
    clarityScore: number
    starRating: number
    profileUrl: string
}

// Stagger variants for the card
export const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        }
    }
}

export function ProviderCard({
    name,
    credentials,
    specialties = [],
    outcomeTag,
    location,
    distance,
    clarityScore,
    starRating,
}: ProviderCardProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [scanPhase, setScanPhase] = useState(0)

    const phases = [
        { icon: Search, label: 'Scanning NPI Credentials...' },
        { icon: Activity, label: 'Auditing Outcome Signals...' },
        { icon: Shield, label: 'Verifying Compliance...' },
        { icon: CheckCircle2, label: 'Calculating Clarity Score™' }
    ]

    const handleDemo = (e: React.MouseEvent) => {
        e.preventDefault()
        if (isScanning) return

        setIsScanning(true)
        setScanPhase(0)

        // Cycle through phases
        const interval = setInterval(() => {
            setScanPhase((prev: number) => {
                if (prev >= phases.length - 1) {
                    clearInterval(interval)
                    setTimeout(() => setIsScanning(false), 1200)
                    return prev
                }
                return prev + 1
            })
        }, 800)
    }
    // Generate initials from name
    const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    // Generate star display
    const stars = '★'.repeat(Math.floor(starRating)) + (starRating % 1 >= 0.5 ? '½' : '')

    return (
        <motion.div
            variants={cardItemVariants}
            className="h-full cursor-pointer touch-none"
            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            onClick={handleDemo}
        >
            <div
                className="relative bg-white rounded-2xl p-6 h-full border border-transparent shadow-sm group-hover:shadow-xl group-hover:border-[var(--color-border)] transition-all duration-300 flex flex-col overflow-hidden"
                style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                }}
            >
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="relative w-16 h-16 mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {React.createElement(phases[scanPhase].icon, {
                                        className: "w-6 h-6 text-[#C9A96E]"
                                    })}
                                </div>
                            </div>
                            <motion.p
                                key={scanPhase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-black uppercase tracking-[0.2em] text-[#3D2B1F]"
                            >
                                {phases[scanPhase].label}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Top row: Avatar + Clarity Badge */}
                <div className="flex items-start justify-between mb-6">
                    <div
                        className="rounded-full flex items-center justify-center font-display font-medium text-lg shrink-0"
                        style={{
                            width: 72,
                            height: 72,
                            border: '2px solid var(--color-gold)',
                            background: 'var(--color-surface)',
                            color: 'var(--color-espresso)',
                        }}
                    >
                        {initials}
                    </div>
                    <ClarityBadge score={clarityScore} size="card" />
                </div>

                {/* Name */}
                <h3
                    className="font-display font-medium mb-1 line-clamp-1"
                    style={{ fontSize: '20px', color: 'var(--color-espresso)' }}
                >
                    {name}
                </h3>

                {/* Credentials */}
                {credentials && (
                    <p
                        className="font-body uppercase mb-4 h-4 overflow-hidden"
                        style={{
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-stone)',
                        }}
                    >
                        {credentials}
                    </p>
                )}

                {/* Specialty tags */}
                {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {specialties.slice(0, 3).map((spec) => (
                            <span
                                key={spec}
                                className="font-body rounded-full px-2.5 py-1 whitespace-nowrap"
                                style={{
                                    fontSize: '11px',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-espresso)',
                                }}
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                )}

                {/* Outcome tag */}
                {outcomeTag && (
                    <div className="mb-4">
                        <span
                            className="font-body rounded-full px-2.5 py-1 inline-flex items-center gap-1"
                            style={{
                                fontSize: '11px',
                                background: 'rgba(138, 158, 141, 0.12)',
                                color: 'var(--color-sage)',
                                border: '1px solid rgba(138, 158, 141, 0.2)',
                            }}
                        >
                            ✦ {outcomeTag}
                        </span>
                    </div>
                )}

                <div className="mt-auto" />

                {/* Location + Rating */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border)', opacity: 0.8 }}>
                    <span className="font-body text-[13px]" style={{ color: 'var(--color-stone)' }}>
                        📍 {location}{distance ? ` · ${distance}` : ''}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--color-gold)] text-sm">{stars}</span>
                        <span className="font-body text-xs" style={{ color: 'var(--color-stone)' }}>{starRating}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-5">
                    <span
                        className="font-body text-sm font-medium inline-flex items-center gap-1"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        {name} — {location.split(',')[0]}
                        <motion.span
                            className="ml-1"
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            →
                        </motion.span>
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
