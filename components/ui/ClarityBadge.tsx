'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface ClarityBadgeProps {
    score: number
    size?: 'card' | 'profile'
}

function getRingColor(score: number): string {
    if (score >= 90) return 'var(--color-gold)'
    if (score >= 75) return 'var(--color-sage)'
    if (score >= 60) return 'var(--color-border)'
    return 'var(--color-taupe)'
}

export function ClarityBadge({ score, size = 'card' }: ClarityBadgeProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })

    const isProfile = size === 'profile'
    const dimension = isProfile ? 100 : 56
    const viewBox = isProfile ? '0 0 100 100' : '0 0 58 58'
    const r = isProfile ? 45 : 26
    const cx = isProfile ? 50 : 29
    const cy = isProfile ? 50 : 29
    const circumference = 2 * Math.PI * r
    const targetOffset = circumference * (1 - score / 100)
    const ringColor = getRingColor(score)
    const fontSize = isProfile ? '32px' : '18px'

    // Counting animation
    const motionValue = useMotionValue(0)
    const rounded = useTransform(motionValue, (v) => Math.round(v))
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        if (!isInView) return

        const controls = animate(motionValue, score, {
            duration: 1.4,
            ease: 'easeOut',
            delay: 0.2
        })

        const unsubscribe = rounded.on('change', (v) => {
            setDisplayScore(v)
        })

        return () => {
            controls.stop()
            unsubscribe()
        }
    }, [isInView, score, motionValue, rounded])

    return (
        <div
            ref={ref}
            className="relative inline-flex items-center justify-center shrink-0"
            style={{ width: dimension, height: dimension }}
        >
            {/* SVG Ring */}
            <svg
                viewBox={viewBox}
                width={dimension}
                height={dimension}
                className="absolute inset-0"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background ring */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth={2.5}
                />
                {/* Fill ring */}
                <motion.circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={isInView ? { strokeDashoffset: targetOffset } : { strokeDashoffset: circumference }}
                    transition={{
                        duration: 1.2,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.2,
                    }}
                    style={{ willChange: 'stroke-dashoffset' }}
                />
            </svg>

            {/* Score number */}
            <span
                className="font-display font-medium relative z-10"
                style={{
                    fontSize,
                    color: 'var(--color-espresso)',
                }}
            >
                {displayScore}
            </span>
        </div>
    )
}
