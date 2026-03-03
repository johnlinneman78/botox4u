'use client'

import { ReactNode, useRef, useCallback, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealOnScrollProps {
    children: ReactNode
    delay?: number
    y?: number
    className?: string
}

export function RevealOnScroll({
    children,
    delay = 0,
    y = 32,
    className = '',
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-60px' })

    // Remove will-change after animation completes to free memory
    const handleAnimationComplete = useCallback(() => {
        if (ref.current) {
            ref.current.style.willChange = 'auto'
        }
    }, [])

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay,
            }}
            style={{ willChange: 'transform' }}
            onAnimationComplete={handleAnimationComplete}
        >
            {children}
        </motion.div>
    )
}
