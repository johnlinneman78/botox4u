'use client'

import Link from 'next/link'
import { NICHE } from '@/config/niche'

export default function Footer() {
    const currentYear = 2026

    const browseLinks = [
        { href: '/find-providers', label: 'All Providers' },
        { href: '/treatments', label: 'By Treatment' },
        { href: '/find-providers?sort=rating', label: 'Top Rated' },
        { href: '/find-providers?q=natural', label: 'Natural Results' },
        { href: '/quiz', label: `${NICHE.name} Price Quiz` },
    ]

    const companyLinks = [
        { href: '/about', label: 'About' },
        { href: '/#how-it-works', label: 'How It Works' },
        { href: '/for-providers', label: 'For Providers' },
        { href: '/blog', label: 'Learn' },
    ]

    const legalLinks = [
        { href: '/privacy', label: 'Privacy' },
        { href: '/terms', label: 'Terms' },
        { href: '/disclaimer', label: 'Contact' },
    ]

    return (
        <footer style={{ background: 'var(--color-deep)' }}>
            <div className="container-content py-16 lg:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
                    {/* Col 1: Logo + tagline */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-5">
                            <span
                                className="inline-block rounded-full"
                                style={{ width: 6, height: 6, background: 'var(--color-sage)' }}
                            />
                            <span
                                className="font-display font-medium"
                                style={{ fontSize: '20px', color: 'var(--color-surface)' }}
                            >
                                InjectorIndex
                            </span>
                        </div>
                        <p
                            className="font-body text-sm leading-relaxed"
                            style={{ color: 'var(--color-taupe)' }}
                        >
                            The independent standard for finding aesthetic injectors. Zero pay-to-rank. Ever.
                        </p>
                    </div>

                    {/* Col 2: Browse Providers */}
                    <div>
                        <h4
                            className="font-body font-medium uppercase mb-4"
                            style={{
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                color: 'var(--color-taupe)',
                            }}
                        >
                            Browse Providers
                        </h4>
                        <ul className="space-y-2.5">
                            {browseLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="font-body text-sm transition-colors"
                                        style={{ color: 'var(--color-stone)' }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-surface)'
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-stone)'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Company */}
                    <div>
                        <h4
                            className="font-body font-medium uppercase mb-4"
                            style={{
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                color: 'var(--color-taupe)',
                            }}
                        >
                            Company
                        </h4>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="font-body text-sm transition-colors"
                                        style={{ color: 'var(--color-stone)' }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-surface)'
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-stone)'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Legal */}
                    <div>
                        <h4
                            className="font-body font-medium uppercase mb-4"
                            style={{
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                color: 'var(--color-taupe)',
                            }}
                        >
                            Legal
                        </h4>
                        <ul className="space-y-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="font-body text-sm transition-colors"
                                        style={{ color: 'var(--color-stone)' }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-surface)'
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.color = 'var(--color-stone)'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(250,248,245,0.06)' }}
                >
                    <p className="font-body text-xs" style={{ color: 'var(--color-stone)' }}>
                        © {currentYear} {NICHE.siteName}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {[
                            { label: 'Instagram', href: 'https://www.instagram.com/injectorindex' },
                            { label: 'TikTok', href: 'https://www.tiktok.com/@injectorindex' },
                            { label: 'Pinterest', href: 'https://www.pinterest.com/injectorindex' },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body text-xs transition-colors"
                                style={{ color: 'var(--color-stone)' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = 'var(--color-surface)'
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = 'var(--color-stone)'
                                }}
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
