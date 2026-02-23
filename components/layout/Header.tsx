'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Menu, X, Shield, Calculator, Info, UserCheck, TrendingUp } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { href: '/find-providers', label: 'Find Providers', icon: Shield },
        { href: '/calculator', label: 'Cost Calculator', icon: Calculator },
        { href: '/audit', label: 'Free Clinic Audit', icon: UserCheck },
        { href: '/blog', label: 'Intelligence', icon: TrendingUp },
        { href: '/pricing', label: 'For Providers', icon: Info },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0d1420]/95 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
                    <Logo className="h-11" variant="shield" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-400 hover:text-[#d4af37] font-semibold transition-colors text-sm"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/find-providers">
                        <Button className="bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-[#d4af37]/10 text-sm">
                            Find Injectors
                        </Button>
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Tray */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[73px] inset-x-0 bg-[#0d1420] border-b border-white/[0.06] shadow-2xl p-4 flex flex-col gap-2 z-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 font-bold transition-all"
                        >
                            <link.icon className="w-5 h-5 text-[#d4af37]" />
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/find-providers"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#d4af37] text-[#0d1420] font-black text-center justify-center transition-all mt-2"
                    >
                        <Shield className="w-5 h-5" />
                        Find Injectors
                    </Link>
                </div>
            )}
        </header>
    )
}
