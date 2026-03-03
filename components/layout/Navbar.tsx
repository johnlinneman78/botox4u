'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const navLinks = [
        { href: '/find-providers', label: 'Find an Injector' },
        { href: '/#how-it-works', label: 'How It Works' },
        { href: '/for-providers', label: 'For Providers' },
        { href: '/blog', label: 'Learn' },
    ]

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-[100] transition-all"
                style={{
                    height: 'var(--nav-height)',
                    background: scrolled ? 'rgba(250,248,245,0.95)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(16px)' : 'blur(16px)',
                    WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(16px)',
                    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
                    transitionDuration: 'var(--duration-med)',
                    transitionTimingFunction: 'var(--ease)',
                }}
            >
                <div className="container-content h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-0 shrink-0 group">
                        <span
                            className="inline-block rounded-full mr-2 transition-transform group-hover:scale-110"
                            style={{
                                width: 6,
                                height: 6,
                                background: 'var(--color-sage)',
                            }}
                        />
                        <span
                            className="font-display font-medium"
                            style={{
                                fontSize: '22px',
                                color: 'var(--color-espresso)',
                            }}
                        >
                            InjectorIndex
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-body font-medium uppercase transition-colors"
                                style={{
                                    fontSize: '13px',
                                    letterSpacing: '0.06em',
                                    color: 'var(--color-stone)',
                                    transitionDuration: 'var(--duration-med)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--color-espresso)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--color-stone)'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/find-providers"
                            className="font-body font-medium text-sm rounded-pill transition-all hover:-translate-y-px"
                            style={{
                                padding: '10px 24px',
                                background: 'var(--color-espresso)',
                                color: 'var(--color-linen)',
                                transitionDuration: 'var(--duration-fast)',
                                transitionTimingFunction: 'var(--ease)',
                            }}
                        >
                            Find My Injector Match
                        </Link>
                    </nav>

                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden p-2 cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1.5">
                            <span
                                className="block transition-all"
                                style={{
                                    width: 24,
                                    height: 1.5,
                                    background: 'var(--color-espresso)',
                                    transform: mobileOpen ? 'rotate(45deg) translateY(4.5px)' : 'none',
                                    transitionDuration: 'var(--duration-med)',
                                }}
                            />
                            <span
                                className="block transition-all"
                                style={{
                                    width: 24,
                                    height: 1.5,
                                    background: 'var(--color-espresso)',
                                    opacity: mobileOpen ? 0 : 1,
                                    transitionDuration: 'var(--duration-med)',
                                }}
                            />
                            <span
                                className="block transition-all"
                                style={{
                                    width: 24,
                                    height: 1.5,
                                    background: 'var(--color-espresso)',
                                    transform: mobileOpen ? 'rotate(-45deg) translateY(-4.5px)' : 'none',
                                    transitionDuration: 'var(--duration-med)',
                                }}
                            />
                        </div>
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[99]"
                        style={{ background: 'rgba(42,31,22,0.4)' }}
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Drawer */}
                    <div
                        className="fixed top-0 right-0 bottom-0 z-[101] animate-slide-in-right flex flex-col"
                        style={{
                            width: '85%',
                            maxWidth: '360px',
                            background: 'var(--color-deep)',
                            padding: '96px 32px 32px',
                        }}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-6 right-6 p-2 cursor-pointer"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2 2L18 18M18 2L2 18" stroke="var(--color-surface)" strokeWidth="1.5" />
                            </svg>
                        </button>

                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="font-body font-medium text-lg py-3 px-4 rounded-lg transition-colors"
                                    style={{
                                        color: 'var(--color-surface)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(250,248,245,0.05)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-8">
                            <Link
                                href="/find-providers"
                                onClick={() => setMobileOpen(false)}
                                className="block text-center font-body font-medium text-base rounded-pill py-3.5 transition-all"
                                style={{
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-deep)',
                                }}
                            >
                                Find My Injector Match
                            </Link>
                        </div>

                        {/* Footer in drawer */}
                        <div className="mt-auto pt-8">
                            <p
                                className="font-body text-xs"
                                style={{ color: 'var(--color-taupe)' }}
                            >
                                The independent standard for<br />finding aesthetic injectors.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
