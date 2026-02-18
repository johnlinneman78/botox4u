import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Logo from './Logo'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center h-10 w-auto">
                    <Logo className="h-full" variant="precision" />
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/find-providers" className="text-[#1a2332] hover:text-[#d4af37] font-semibold transition-colors">
                        Find Providers
                    </Link>
                    <Link href="/guide/safety-guide" className="text-slate-500 hover:text-[#1a2332] font-medium transition-colors">
                        Safety Guide
                    </Link>
                    <Link href="/calculator" className="text-slate-500 hover:text-[#1a2332] font-medium transition-colors">
                        Cost Calculator
                    </Link>
                    <Link href="/#quick-quote">
                        <Button className="bg-[#1a2332] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-navy-900/10">
                            Get Quote
                        </Button>
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 text-slate-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    )
}
