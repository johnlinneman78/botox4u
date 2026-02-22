
import { NICHE } from '@/config/niche'
import { Search, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ClaimDirectoryPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* HER SECTION */}
            <div className="bg-[#1a2332] text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/10 -skew-x-12 translate-x-1/3" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-6">
                        <ShieldCheck className="w-3 h-3" />
                        Provider Network
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        Grow Your Practice with <span className="text-[#d4af37]">{NICHE.siteName}</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mb-10">
                        Join the most transparent aesthetics directory. Claim your free profile to list your pricing,
                        verify your medical credentials, and start receiving high-intent patient inquiries.
                    </p>

                    <div className="max-w-xl">
                        <div className="relative">
                            <form action="/find-providers" method="GET" className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name="q"
                                        type="text"
                                        placeholder="Search for your clinic name..."
                                        className="w-full h-14 pl-12 pr-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    />
                                </div>
                                <Button type="submit" className="bg-[#d4af37] hover:bg-[#c0a030] text-[#1a2332] font-bold h-14 px-8 rounded-xl">
                                    Find My Profile
                                </Button>
                            </form>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            Already found your page? Click the "Is this your practice?" link on your profile.
                        </p>
                    </div>
                </div>
            </div>

            {/* BENEFITS GRID */}
            <div className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center text-[#d4af37] mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">NPI Verification</h3>
                            <p className="text-gray-600 leading-relaxed font-light">
                                Authenticate your medical credentials with our direct NPI database integration. Earn the verification badge that 80% of patients look for.
                            </p>
                        </div>
                        <div>
                            <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center text-[#d4af37] mb-6">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Lead Generation</h3>
                            <p className="text-gray-600 leading-relaxed font-light">
                                Our users are high-intent patients ready to book. Verified profiles see a 4x increase in profile clicks and consultation requests.
                            </p>
                        </div>
                        <div>
                            <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center text-[#d4af37] mb-6">
                                <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Pricing Control</h3>
                            <p className="text-gray-500 leading-relaxed font-light">
                                Stop being compared on price without context. List your per-unit rates and specialized treatment packages to attract the right patients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
