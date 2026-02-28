import Link from 'next/link'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-white/[0.06] bg-[#080e17]">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="h-12 w-auto mb-5 -ml-1">
                            <Link href="/" className="flex items-center min-w-max flex-shrink-0 hover:opacity-90 transition-opacity">
                                <Logo className="h-full w-auto" variant="shield" />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                            The first provider directory built around clinical quality data — not paid placement.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href={`https://twitter.com/InjectorIndex`} target="_blank" rel="noopener" className="text-gray-700 hover:text-[#d4af37] transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* For Patients */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">For Patients</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/find-providers" className="text-gray-500 hover:text-[#d4af37] transition-colors">Find Providers</Link></li>
                            <li><Link href="/calculator" className="text-gray-500 hover:text-[#d4af37] transition-colors">Cost Calculator</Link></li>
                            <li><Link href="/blog" className="text-gray-500 hover:text-[#d4af37] transition-colors">2026 Guides</Link></li>
                            <li><Link href="/faq" className="text-gray-500 hover:text-[#d4af37] transition-colors">FAQ</Link></li>
                            <li><Link href="/botox-buyers-guide" className="text-gray-500 hover:text-[#d4af37] transition-colors">Buyers Guide</Link></li>
                        </ul>
                    </div>

                    {/* For Providers */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">For Providers</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/claim" rel="nofollow" className="text-gray-500 hover:text-[#d4af37] transition-colors">Claim Listing</Link></li>
                            <li><Link href="/provider/login" rel="nofollow" className="text-gray-500 hover:text-[#d4af37] transition-colors">Provider Login</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-[#d4af37] transition-colors">Pricing</Link></li>
                            <li><Link href="/methodology" className="text-gray-500 hover:text-[#d4af37] transition-colors">TrueScore™ Methodology</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/privacy" className="text-gray-500 hover:text-[#d4af37] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-[#d4af37] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/disclaimer" className="text-gray-500 hover:text-[#d4af37] transition-colors">Medical Disclaimer</Link></li>
                        </ul>
                        <div className="mt-8 p-4 rounded-2xl bg-[#d4af37]/5 border border-[#d4af37]/10">
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                <span className="text-[#d4af37] font-bold">Rankings are pure data.</span> Nobody pays for a higher TrueScore™. Providers may purchase featured placement, disclosed clearly.
                            </p>
                        </div>
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
