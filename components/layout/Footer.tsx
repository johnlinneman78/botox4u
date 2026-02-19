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
                            <Link href="/" className="hover:opacity-90 transition-opacity">
                                <Logo className="h-full w-auto" variant="shield" />
                            </Link>
                        </div>
                        <p className="text-sm text-gray-600">
                            Find the best {NICHE.name} providers near you. Compare costs, read reviews, and book consultations.
                        </p>
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
                    <p>© {currentYear} {NICHE.siteName} All rights reserved.</p>
                    <div className="mt-4">
                        <MedicalDisclaimer variant="inline" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
