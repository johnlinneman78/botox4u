'use client'

import { useEffect, useRef } from 'react'

export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1, ...options }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [options])

    return ref
}

export function RevealSection({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
}) {
    const ref = useInView()

    return (
        <div
            ref={ref}
            className={`reveal-section ${className}`}
            style={{
                opacity: 0,
                transform: 'translateY(20px)',
                transition: `opacity var(--duration-slow) var(--ease), transform var(--duration-slow) var(--ease)`,
                transitionDelay: `${delay}ms`,
            }}
        >
            <style>{`
                .reveal-section.is-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `}</style>
            {children}
        </div>
    )
}
