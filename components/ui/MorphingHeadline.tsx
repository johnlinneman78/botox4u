'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const WORDS = ['Injector', 'Botox Provider', 'Lip Filler Artist', 'Dermatologist', 'Medspa']
const CYCLE_MS = 2800
const FADE_MS = 300
const GAP_MS = 80

export function MorphingHeadline() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [animState, setAnimState] = useState<'visible' | 'fading-out' | 'fading-in'>('visible')
    const [underlineWidth, setUnderlineWidth] = useState(0)
    const [paused, setPaused] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const measureRef = useRef<HTMLSpanElement>(null)
    const morphRef = useRef<HTMLSpanElement>(null)

    // Measure the width of the current morphing word
    const measureWord = useCallback((index: number) => {
        if (measureRef.current) {
            measureRef.current.textContent = WORDS[index]
            setUnderlineWidth(measureRef.current.offsetWidth)
        }
    }, [])

    // Initial measurement
    useEffect(() => {
        measureWord(currentIndex)
    }, [currentIndex, measureWord])

    // Cycling logic
    useEffect(() => {
        if (paused) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
        }

        intervalRef.current = setInterval(() => {
            // Fade out
            setAnimState('fading-out')

            setTimeout(() => {
                // Swap word
                setCurrentIndex((prev) => (prev + 1) % WORDS.length)

                setTimeout(() => {
                    // Fade in
                    setAnimState('fading-in')

                    setTimeout(() => {
                        setAnimState('visible')
                    }, FADE_MS)
                }, GAP_MS)
            }, FADE_MS)
        }, CYCLE_MS)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [paused])

    const morphStyle: React.CSSProperties = {
        display: 'inline-block',
        fontStyle: 'italic',
        color: 'var(--color-gold)',
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        ...(animState === 'fading-out'
            ? { opacity: 0, transform: 'translateY(-8px)' }
            : animState === 'fading-in'
                ? { opacity: 1, transform: 'translateY(0)' }
                : { opacity: 1, transform: 'translateY(0)' }),
    }

    // On first render of fading-in, start from translateY(8px)
    useEffect(() => {
        if (animState === 'fading-in' && morphRef.current) {
            // Force the initial state before transition
            morphRef.current.style.opacity = '0'
            morphRef.current.style.transform = 'translateY(8px)'
            // Trigger reflow
            void morphRef.current.offsetHeight
            morphRef.current.style.opacity = '1'
            morphRef.current.style.transform = 'translateY(0)'
        }
    }, [animState, currentIndex])

    return (
        <h1
            className="font-display font-light text-balance"
            style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                color: 'var(--color-espresso)',
                lineHeight: 1.1,
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            Know Your{' '}
            <span className="relative inline-block">
                <span
                    ref={morphRef}
                    style={morphStyle}
                >
                    {WORDS[currentIndex]}
                </span>
                {/* Underline */}
                <span
                    className="absolute left-0 block"
                    style={{
                        bottom: '-4px',
                        height: '1px',
                        background: 'var(--color-blush)',
                        width: underlineWidth,
                        transition: `width ${FADE_MS}ms ease`,
                    }}
                />
                {/* Hidden measuring span */}
                <span
                    ref={measureRef}
                    className="font-display font-light"
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        fontStyle: 'italic',
                        fontSize: 'inherit',
                        pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                />
            </span>
            <br className="hidden sm:block" />
            {' '}Before You <em style={{ color: 'var(--color-gold)' }}>Book.</em>
        </h1>
    )
}
