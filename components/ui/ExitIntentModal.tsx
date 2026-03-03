'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'

export function ExitIntentModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if user already dismissed this session
        if (typeof window !== 'undefined') {
            const wasDismissed = sessionStorage.getItem('quiz_modal_dismissed')
            if (wasDismissed) {
                setDismissed(true)
                return
            }
        }

        // Show after 60 seconds
        const timer = setTimeout(() => {
            if (!dismissed) {
                setIsVisible(true)
            }
        }, 60000) // 60 seconds

        return () => clearTimeout(timer)
    }, [dismissed])

    const handleClose = () => {
        setIsVisible(false)
        setDismissed(true)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('quiz_modal_dismissed', 'true')
        }
    }

    if (dismissed) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100]"
                        style={{ background: 'rgba(26, 26, 26, 0.5)', backdropFilter: 'blur(4px)' }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 z-[101] flex items-center justify-center px-4"
                    >
                        <div
                            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(160deg, #FAF8F5 0%, #F2EDE4 100%)',
                                border: '1px solid rgba(181, 147, 107, 0.2)',
                                boxShadow: '0 24px 48px rgba(26, 26, 26, 0.15)',
                            }}
                        >
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-[#1A1A1A]/5"
                                style={{ color: 'var(--color-stone)' }}
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="p-8 sm:p-10 text-center">
                                {/* Icon */}
                                <div
                                    className="mx-auto mb-6 flex items-center justify-center rounded-full"
                                    style={{
                                        width: 64,
                                        height: 64,
                                        background: 'linear-gradient(135deg, #C9A96E 0%, #B5936B 100%)',
                                        boxShadow: '0 4px 12px rgba(201, 169, 110, 0.3)',
                                    }}
                                >
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>

                                {/* Eyebrow */}
                                <span
                                    className="inline-block font-body text-xs font-medium mb-3"
                                    style={{
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: '#B5936B',
                                    }}
                                >
                                    Before you go
                                </span>

                                {/* Headline */}
                                <h2
                                    className="font-display font-semibold mb-3"
                                    style={{
                                        fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                                        color: '#1A1A1A',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    Take Our 30-Second Price Quiz
                                </h2>

                                {/* Subheadline */}
                                <p
                                    className="font-body mx-auto mb-8"
                                    style={{
                                        fontSize: '15px',
                                        color: '#6B5E54',
                                        maxWidth: '380px',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    See what Botox actually costs in your city — plus get our free 2026 Price Guide with insider tips to save hundreds.
                                </p>

                                {/* CTA Button */}
                                <Link href="/quiz" onClick={handleClose}>
                                    <button
                                        className="w-full sm:w-auto font-body font-bold text-white px-8 py-4 rounded-full transition-all hover:-translate-y-0.5"
                                        style={{
                                            background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
                                            fontSize: '14px',
                                            letterSpacing: '0.05em',
                                            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.2)',
                                        }}
                                    >
                                        Take the Quiz — It&apos;s Free →
                                    </button>
                                </Link>

                                {/* Trust */}
                                <p
                                    className="font-body mt-5"
                                    style={{ fontSize: '11px', color: '#9B8F84', letterSpacing: '0.05em' }}
                                >
                                    No spam. Just data. Unsubscribe anytime.
                                </p>
                            </div>

                            {/* Bottom accent bar */}
                            <div
                                style={{
                                    height: 3,
                                    background: 'linear-gradient(90deg, #B5936B, #C9A96E, #B5936B)',
                                }}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
