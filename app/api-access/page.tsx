import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'API Access Paused | VerifiedAesthetics',
    description: 'API access is paused. Listing a clinic is free.',
    alternates: {
        canonical: '/api-access',
    },
}

// CANCELLED Nov 5, 2026 (John's decision): API access is removed until
// the data is valuable enough for someone who wants it. No paid plans,
// no key signup, no checkout. The old plans page is in git history.
// Listing a clinic stays free.
export default function ApiAccessPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6 leading-tight">
                    API access is paused.
                </h1>
                <p className="text-lg text-[#3D2B1F]/70 font-light leading-relaxed mb-4">
                    We are not offering API access right now. We will bring it back when the data is valuable enough for someone who wants it.
                </p>
                <p className="text-lg text-[#3D2B1F]/70 font-light leading-relaxed mb-10">
                    Listing a clinic is still free, and stays free.
                </p>
                <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#C9A96E]/10 transition-all">
                    See the free listing
                </Link>
            </div>
        </div>
    )
}
