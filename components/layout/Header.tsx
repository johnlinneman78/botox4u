'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Menu, X, Shield, Calculator, MessageSquare, UserCheck, Info } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { href: '/find-providers', label: 'Find Providers', icon: Shield },
        { href: '/guide/safety-guide', label: 'Safety Guide', icon: Shield },
        { href: '/calculator', label: 'Cost Calculator', icon: Calculator },
        { href: '/botox-fact-sheet', label: 'Botox Facts', icon: Info },
        { href: '/about', label: 'About', icon: UserCheck },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center h-12 w-auto hover:opacity-90 transition-opacity">
                    <Logo className="h-full" variant="shield" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-slate-600 hover:text-[#d4af37] font-semibold transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/#quick-quote">
                        <Button className="bg-[#1a2332] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-navy-900/10">
                            Get Quote
                        </Button>
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-[#d4af37] transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Tray */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 z-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-slate-700 font-bold transition-all"
                        >
                            <link.icon className="w-5 h-5 text-secondary" />
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/#quick-quote"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#1a2332] text-white font-bold text-center justify-center transition-all"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Get Quote
                    </Link>
                </div>
            )}
        </header>
    )
}
