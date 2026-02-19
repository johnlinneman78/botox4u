'use client'

import React from 'react'
import { NICHE } from '@/config/niche'

interface LogoProps {
    className?: string
    variant?: 'precision' | 'shield' | 'wordmark'
    theme?: 'light' | 'dark'
}

export function LogoPrecision({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    const textColor = theme === 'dark' ? '#ffffff' : '#1a2332'
    return (
        <svg className={className} viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#f3e5ab" />
                    <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
            </defs>
            <text x="0" y="60" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '48px', fontWeight: '700' }} fill={textColor}>{NICHE.brandName}<tspan fill="url(#goldText)">{NICHE.brandSuffix}</tspan>.com</text>
            <text x="2" y="85" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '10px', fontWeight: '800' }} fill="#94a3b8" letterSpacing="0.4em">{NICHE.name.toUpperCase()} MEDICAL DIRECTORY</text>
        </svg>
    )
}

export function LogoShield({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    const textColor = theme === 'dark' ? '#ffffff' : '#1a2332'
    const subtextColor = theme === 'dark' ? '#cbd5e1' : '#94a3b8'
    return (
        <svg className={className} viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f3e5ab" />
                    <stop offset="45%" stopColor="#d4af37" />
                    <stop offset="55%" stopColor="#b8941f" />
                    <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="1" dy="1" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Shield Icon Container */}
            <g filter="url(#shadow)">
                <path d="M10 20 C10 10 30 5 60 5 C90 5 110 10 110 20 V70 C110 95 60 115 60 115 C60 115 10 95 10 70 V20Z" fill="url(#premiumGold)" />
                <path d="M25 35 L45 85 L95 25" stroke="#1a2332" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Brand Text */}
            <text x="135" y="65" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '56px', fontWeight: '800' }} fill={textColor} letterSpacing="-0.02em">
                {NICHE.brandName}<tspan fill="#d4af37">{NICHE.brandSuffix}</tspan>
            </text>
            <text x="402" y="55" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '24px', fontWeight: '400' }} fill={subtextColor}>.com</text>
            <text x="138" y="95" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '11px', fontWeight: '700' }} fill="#d4af37" letterSpacing="0.35em">PREMIUM {NICHE.providerType.toUpperCase()} NETWORK</text>
        </svg>
    )
}

export function LogoWordmark({ className = "", theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
    const textColor = theme === 'dark' ? '#ffffff' : '#1a2332'
    return (
        <svg className={className} viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={textColor} />
                    <stop offset="100%" stopColor={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                </linearGradient>
            </defs>
            <text x="0" y="75" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '72px', fontWeight: '800' }} fill="url(#wordGrad)" letterSpacing="-0.04em">{NICHE.brandName}{NICHE.brandSuffix}</text>
            <circle cx="340" cy="55" r="6" fill="#d4af37" />
            <path d="M0 95 H360" stroke="#d4af37" strokeWidth="2" opacity="0.3" />
        </svg>
    )
}

export default function Logo({ className, variant = 'precision', theme = 'light' }: LogoProps) {
    if (variant === 'shield') return <LogoShield className={className} theme={theme} />
    if (variant === 'wordmark') return <LogoWordmark className={className} theme={theme} />
    return <LogoPrecision className={className} theme={theme} />
}
