import Link from 'next/link'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export default function Footer() {
    const currentYear = 2026

    return (
        <footer className="border-t border-white/[0.06] bg-[#080e17]">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                        <div className="h-12 w-auto mb-5 -ml-1">
                            <Link href="/" className="flex items-center min-w-max flex-shrink-0 hover:opacity-90 transition-opacity">
                                <Logo className="h-full w-auto" variant="shield" />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                            The first provider directory built around clinical quality data — not paid placement.
                        </p>
                    </div>

                    {/* For Patients */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">For Patients</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/find-providers" className="text-gray-500 hover:text-[#d4af37] transition-colors">Find Providers</Link></li>
                            <li><Link href="/calculator" className="text-gray-500 hover:text-[#d4af37] transition-colors">Cost Calculator</Link></li>
                            <li><Link href="/blog" className="text-gray-500 hover:text-[#d4af37] transition-colors">Insights</Link></li>
                            <li><Link href="/faq" className="text-gray-500 hover:text-[#d4af37] transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* For Providers */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">For Providers</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/claim" rel="nofollow" className="text-gray-500 hover:text-[#d4af37] transition-colors">Claim Profile</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-[#d4af37] transition-colors">Pricing & Plans</Link></li>
                            <li><Link href="/methodology" className="text-gray-500 hover:text-[#d4af37] transition-colors">TrueScore™</Link></li>
                        </ul>
                    </div>

                    {/* For Developers */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Developers</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/docs" className="text-gray-500 hover:text-[#d4af37] transition-colors">API Documentation</Link></li>
                            <li><Link href="/api-access" className="text-gray-500 hover:text-[#d4af37] transition-colors">API Access</Link></li>
                            <li><Link href="/llms.txt" className="text-gray-500 hover:text-[#d4af37] transition-colors">AI Knowledge Base</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/privacy" className="text-gray-500 hover:text-[#d4af37] transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-[#d4af37] transition-colors">Terms</Link></li>
                            <li><Link href="/disclaimer" className="text-gray-500 hover:text-[#d4af37] transition-colors">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-700">
                    <p>© {currentYear} {NICHE.siteName}. All rights reserved. Built for patients, not providers.</p>
                    <div className="mt-2">
                        <MedicalDisclaimer variant="inline" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
