import Link from 'next/link'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="h-14 w-auto mb-6 -ml-2">
                            <Link href="/" className="flex items-center min-w-max flex-shrink-0 hover:opacity-90 transition-opacity">
                                <Logo className="h-full w-auto" variant="shield" />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            The Independent Injector Index for Aesthetic Medicine.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.linkedin.com/company/[injector-index-slug]" target="_blank" rel="noopener" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <a href="https://twitter.com/[InjectorIndex]" target="_blank" rel="noopener" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-primary">For Patients</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/find-providers" className="text-gray-600 hover:text-primary transition-colors">Find Providers</Link></li>
                            <li><Link href="/calculator" className="text-gray-600 hover:text-primary transition-colors">Cost Calculator</Link></li>
                            <li><Link href="/guide/botox-cost-guide" className="text-gray-600 hover:text-primary transition-colors">Cost Guide</Link></li>
                            <li><Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-primary">For Providers</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/provider/claim" className="text-gray-600 hover:text-primary transition-colors">Claim Listing</Link></li>
                            <li><Link href="/provider/login" className="text-gray-600 hover:text-primary transition-colors">Provider Login</Link></li>
                            <li><Link href="/pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-primary">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/disclaimer" className="text-gray-600 hover:text-primary transition-colors">Medical Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    <p className="mb-4 font-bold text-primary">
                        {NICHE.siteName} is built for patients, not providers.<br />
                        Rankings are based on data — nobody pays for a higher score.
                    </p>
                    <p>© {currentYear} {NICHE.siteName} All rights reserved.</p>
                    <div className="mt-4">
                        <MedicalDisclaimer variant="inline" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
