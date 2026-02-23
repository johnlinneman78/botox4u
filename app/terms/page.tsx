import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0d1420] py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#101827] p-8 rounded-2xl border border-white/[0.06]">
                <h1 className="text-3xl font-display font-bold text-white mb-6">Terms of Service</h1>
                <p className="text-gray-600 mb-6">Last Updated: February 19, 2026</p>

                <section className="space-y-6 text-gray-400 leading-relaxed">
                    <p>
                        By using InjectorIndex.com, you agree to comply with and be bound by the following terms and conditions of use.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Acceptance of Agreement</h2>
                    <p>
                        You agree to the terms and conditions outlined in this Terms of Service Agreement with respect to our site. This Agreement constitutes the entire and only agreement between us and you.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Medical Information Disclaimer</h2>
                    <p>
                        InjectorIndex.com is an informational directory and lead generation platform. We do not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Provider Listings</h2>
                    <p>
                        While we strive to provide accurate information, we do not guarantee the credentials, pricing, or quality of service provided by any clinic listed on our site. Users are responsible for conducting their own due diligence before booking a treatment.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Limitation of Liability</h2>
                    <p>
                        InjectorIndex.com shall not be liable for any damages resulting from the use or inability to use the site or services provided by any third-party providers found through the site.
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-white/[0.06]">
                    <Link href="/" className="text-[#d4af37] font-bold hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
