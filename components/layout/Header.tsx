'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Menu, X, Shield, Calculator, Info, Sparkles, TrendingUp, Code } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { href: '/find-providers', label: 'Find Providers', icon: Shield },
        { href: '/calculator', label: 'Cost Calculator', icon: Calculator },
        { href: '/blog', label: 'Insights', icon: TrendingUp },
        { href: '/docs', label: 'Docs & API', icon: Code },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#3D2B1F]/10 bg-[#FAF8F5]/95 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
                    <Logo className="h-11" variant="shield" />
                </Link>

                {/* Mobile: Quiz button + hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <Link href="/quiz">
                        <Button className="bg-[#C9A96E] hover:bg-[#B5955B] text-white font-bold py-2 px-4 rounded-lg transition-all text-xs whitespace-nowrap">
                            Price Quiz
                        </Button>
                    </Link>
                    <button
                        className="p-2 text-[#3D2B1F]/70 hover:text-[#C9A96E] transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[#3D2B1F]/70 hover:text-[#C9A96E] font-semibold transition-colors text-sm"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-6 w-px bg-[#3D2B1F]/10 mx-2" />
                    <Link href="/for-providers">
                        <Button variant="outline" className="border-white/20 text-[#3D2B1F] hover:bg-[#3D2B1F]/5 font-bold py-2.5 px-6 rounded-xl transition-all text-sm">
                            For Providers
                        </Button>
                    </Link>
                    <Link href="/quiz">
                        <Button className="bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-[#C9A96E]/10 text-sm">
                            Price Quiz
                        </Button>
                    </Link>
                </nav>
            </div>

            {/* Mobile Menu Tray */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[73px] inset-x-0 bg-[#FAF8F5] border-b border-[#3D2B1F]/10 shadow-2xl p-4 flex flex-col gap-2 z-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D2B1F]/5 text-[#3D2B1F]/70 font-bold transition-all"
                        >
                            <link.icon className="w-5 h-5 text-[#C9A96E]" />
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/for-providers"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-center justify-center hover:bg-[#3D2B1F]/5 transition-all mt-2"
                    >
                        <Info className="w-5 h-5" />
                        For Providers
                    </Link>
                    <Link
                        href="/quiz"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#C9A96E] text-white font-black text-center justify-center hover:bg-[#B5955B] transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        Take the Price Quiz
                    </Link>
                </div>
            )}
        </header>
    )
}
