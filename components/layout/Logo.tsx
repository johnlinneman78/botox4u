'use client'

import React from 'react'

interface LogoProps {
    className?: string
    variant?: 'precision' | 'shield' | 'wordmark'
}

export function LogoPrecision({ className = "" }) {
    return (
        <svg className={className} viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="25" y="60" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '48px', fontWeight: '700' }} fill="#1a2332">Botox-4u.com</text>
            <text x="28" y="82" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '14px', fontWeight: '600' }} fill="#d4af37" letterSpacing="0.3em">MEDICAL DIRECTORY</text>
        </svg>
    )
}

export function LogoShield({ className = "" }) {
    return (
        <svg className={className} viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f7e8a4" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#b8941f" />
                </linearGradient>
            </defs>
            <path d="M28 12 Q34 5 42 12 V78 L38 84 L28 78 V12 Z" fill="url(#shieldGold)" stroke="#1a2332" strokeWidth="2" strokeLinejoin="round" />
            <text x="42" y="48" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '28px', fontWeight: '900' }} fill="#1a2332" textAnchor="middle" letterSpacing="-0.05em">B</text>
            <text x="42" y="60" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '28px', fontWeight: '900' }} fill="#1a2332" textAnchor="middle" letterSpacing="-0.05em">4u</text>
            <polyline points="32,40 39,47 52,35" stroke="#1a2332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="75" y="60" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '36px', fontWeight: '600' }} fill="#1a2332" letterSpacing="-0.02em">Botox</text>
            <text x="175" y="60" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '36px', fontWeight: '800' }} fill="#d4af37" letterSpacing="0.01em">-4u.com</text>
        </svg>
    )
}

export function LogoWordmark({ className = "" }) {
    return (
        <svg className={className} viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
            <text x="25" y="62" style={{ fontFamily: "var(--font-playfair), serif", fontSize: '44px', fontWeight: '700' }} fill="#1a2332" letterSpacing="-0.035em">Botox</text>
            <text x="165" y="62" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '48px', fontWeight: '900' }} fill="#d4af37" letterSpacing="-0.02em">-4u</text>
            <text x="255" y="58" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: '24px', fontWeight: '500' }} fill="#64748b" letterSpacing="0.02em">.com</text>
            <path d="M25 82 L45 78 L65 88 L90 80 L115 90 L135 82" stroke="url(#pulseGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
            <path d="M25 82 L45 78 L65 88 L90 80 L115 90 L135 82" stroke="#d1fae5" strokeWidth="6" strokeLinecap="round" opacity="0.4" fill="none" />
        </svg>
    )
}

export default function Logo({ className, variant = 'precision' }: LogoProps) {
    if (variant === 'shield') return <LogoShield className={className} />
    if (variant === 'wordmark') return <LogoWordmark className={className} />
    return <LogoPrecision className={className} />
}
