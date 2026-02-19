import Link from 'next/link'
import { NICHE } from '@/config/niche'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-display font-bold text-primary mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-6">Last Updated: February 19, 2026</p>

                <section className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                        At {NICHE.siteName}, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our services.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you request a quote, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and location.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to connect you with local {NICHE.name} providers, send you updates and newsletters (if you opt-in), and improve our website functionality.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">3. Information Sharing</h2>
                    <p>
                        When you request a quote, we share your contact information with the specific providers you have selected or those matching your criteria in your local area. We do not sell your personal information to third-party marketers.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">4. Your Choices</h2>
                    <p>
                        You can opt-out of receiving promotional emails from us by following the unsubscribe instructions in those emails. You can also contact us to request the deletion of your personal information.
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <Link href="/" className="text-primary font-bold hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
