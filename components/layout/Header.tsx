import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-display font-bold text-primary">
                        Botox Directory
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/find-providers" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Find Providers
                    </Link>
                    <Link href="/cost-calculator" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Cost Calculator
                    </Link>
                    <Link href="/guide/botox-cost-guide" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Cost Guide
                    </Link>
                    <Link href="/provider/login">
                        <Button variant="outline" size="sm">
                            Provider Login
                        </Button>
                    </Link>
                </nav>

                {/* Mobile menu button - will implement later */}
                <button className="md:hidden p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    )
}
