'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from './Button'

interface ScrollCTAProps {
    variant?: 'homepage' | 'profile'
    providerName?: string
    providerCity?: string
    providerState?: string
    clarityScore?: number
    phoneNumber?: string
    googlePlaceId?: string
}

export function ScrollCTA({
    variant = 'homepage',
    providerName,
    providerCity,
    providerState,
    clarityScore,
    phoneNumber,
    googlePlaceId,
}: ScrollCTAProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isDuringHours, setIsDuringHours] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 600)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const hour = new Date().getHours()
        setIsDuringHours(hour >= 9 && hour < 17)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50"
                    style={{
                        background: 'var(--color-bg)',
                        borderTop: '1px solid var(--color-border)',
                        boxShadow: '0 -4px 16px rgba(42,31,22,0.06)',
                    }}
                >
                    <div className="container-content py-3 flex items-center justify-between gap-4">
                        {variant === 'profile' && providerName ? (
                            <>
                                <div className="hidden sm:block">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="font-display font-medium"
                                            style={{ fontSize: '18px', color: 'var(--color-espresso)' }}
                                        >
                                            {providerName}
                                        </span>
                                        {clarityScore && (
                                            <span
                                                className="font-display text-sm"
                                                style={{ color: 'var(--color-gold)' }}
                                            >
                                                {clarityScore}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-body text-xs" style={{ color: 'var(--color-stone)' }}>
                                        📍 {providerCity}, {providerState}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 ml-auto">
                                    {phoneNumber && (
                                        <a
                                            href={`tel:${phoneNumber}`}
                                            className="font-body text-sm font-medium transition-colors hidden md:inline-flex items-center gap-2"
                                            style={{ color: 'var(--color-espresso)' }}
                                        >
                                            {isDuringHours && (
                                                <span
                                                    className="inline-block rounded-full animate-pulse-dot"
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        background: 'var(--color-sage)',
                                                    }}
                                                />
                                            )}
                                            Call the Clinic
                                        </a>
                                    )}
                                    {googlePlaceId && (
                                        <a
                                            href={`https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-body text-sm font-medium transition-colors hidden md:inline-flex"
                                            style={{ color: 'var(--color-espresso)' }}
                                        >
                                            Get Directions
                                        </a>
                                    )}
                                    <a href="#quote-form">
                                        <Button variant="primary" size="sm">
                                            Request a Consultation →
                                        </Button>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <p
                                    className="font-body text-sm hidden sm:block"
                                    style={{ color: 'var(--color-stone)' }}
                                >
                                    Find top-rated Botox & filler providers near you
                                </p>
                                <Link href="/find-providers" className="ml-auto">
                                    <Button variant="primary" size="sm">
                                        Find My Injector Match →
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
