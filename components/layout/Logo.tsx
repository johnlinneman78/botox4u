'use client'

import React from 'react'
import { NICHE } from '@/config/niche'

interface LogoProps {
    className?: string
    variant?: 'precision' | 'shield' | 'wordmark'
    theme?: 'light' | 'dark'
}

// Renders "InjectorIndex" + ".com" in gold
function BrandText({ theme, size = '1.5rem' }: { theme: 'light' | 'dark', size?: string }) {
    const textColor = theme === 'dark' ? '#ffffff' : '#1a2332'
    return (
        <span style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontWeight: 800,
            color: textColor,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
        }}>
            InjectorIndex
            <span style={{ color: '#d4af37', fontWeight: 700 }}>.com</span>
        </span>
    )
}

export function LogoPrecision({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex items-center whitespace-nowrap flex-shrink-0 ${className}`}>
            <BrandText theme={theme} size="1.4rem" />
        </div>
    )
}

export function LogoShield({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex items-center gap-3 whitespace-nowrap flex-shrink-0 ${className}`}>
            {/* Shield Icon */}
            <svg width="36" height="44" viewBox="0 0 110 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <defs>
                    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f3e5ab" />
                        <stop offset="45%" stopColor="#d4af37" />
                        <stop offset="55%" stopColor="#b8941f" />
                        <stop offset="100%" stopColor="#d4af37" />
                    </linearGradient>
                    <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                        <feOffset dx="1" dy="1" result="offsetblur" />
                        <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <g filter="url(#shieldShadow)">
                    <path d="M10 20 C10 10 30 5 55 5 C80 5 100 10 100 20 V70 C100 95 55 115 55 115 C55 115 10 95 10 70 V20Z" fill="url(#shieldGold)" />
                    <path d="M25 38 L45 82 L88 28" stroke="#1a2332" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </svg>
            <BrandText theme={theme} size="1.5rem" />
        </div>
    )
}

export function LogoWordmark({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    return (
        <div className={`flex flex-col whitespace-nowrap flex-shrink-0 ${className}`}>
            <BrandText theme={theme} size="2rem" />
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #d4af37, transparent)', marginTop: '4px' }} />
        </div>
    )
}

export default function Logo({ className, variant = 'precision', theme = 'light' }: LogoProps) {
    if (variant === 'shield') return <LogoShield className={className} theme={theme} />
    if (variant === 'wordmark') return <LogoWordmark className={className} theme={theme} />
    return <LogoPrecision className={className} theme={theme} />
}
