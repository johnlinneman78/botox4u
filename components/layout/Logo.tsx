'use client'

import React from 'react'
import { NICHE } from '@/config/niche'

interface LogoProps {
    className?: string
    variant?: 'precision' | 'shield' | 'wordmark'
    theme?: 'light' | 'dark'
}

function CheckmarkAccent() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A9E8D"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                marginRight: '2px',
                marginBottom: '4px',
                display: 'inline-block'
            }}
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}

function BrandText({ theme, size = '1.5rem' }: { theme: 'light' | 'dark', size?: string }) {
    // Warm Espresso #3D2B1F for both themes as this is a strictly defined brand color. 
    // If dark theme requires it, we can use a slightly lighter shade, but instructions specify Warm Espresso.
    const textColor = theme === 'dark' ? '#EAE5DF' : '#3D2B1F'
    return (
        <span style={{
            fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif',
            fontWeight: 500, // Medium
            color: textColor,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center'
        }}>
            <CheckmarkAccent />
            {NICHE.siteName}
        </span>
    )
}

export function LogoPrecision({ className = "", theme = 'dark' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex items-center whitespace-nowrap flex-shrink-0 ${className}`}>
            <BrandText theme={theme} size="1.4rem" />
        </div>
    )
}

export function LogoShield({ className = "", theme = 'dark' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${className}`}>
            <BrandText theme={theme} size="1.5rem" />
        </div>
    )
}

export function LogoWordmark({ className = "", theme = 'dark' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex flex-col whitespace-nowrap flex-shrink-0 ${className}`}>
            <BrandText theme={theme} size="2rem" />
        </div>
    )
}

export default function Logo({ className, variant = 'precision', theme = 'dark' }: LogoProps) {
    if (variant === 'shield') return <LogoShield className={className} theme={theme} />
    if (variant === 'wordmark') return <LogoWordmark className={className} theme={theme} />
    return <LogoPrecision className={className} theme={theme} />
}
