import Link from 'next/link'
import { Check, Star, Shield, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const tiers = [
    {
        name: 'Essential',
        price: '99',
        priceId: 'price_essential',
        description: 'Perfect for local clinics looking to establish their presence.',
        features: [
            'Verified Badge',
            'Remove External Competitor Ads',
            'Basic Analytics (Views)',
            'Standard Lead Routing',
            'Manual Review Verification'
        ],
        icon: <Shield className="w-6 h-6 text-blue-500" />,
        highlight: false
    },
    {
        name: 'Growth',
        price: '149',
        priceId: 'price_growth',
        description: 'Most popular for clinics growing their patient base.',
        features: [
            'Everything in Essential',
            'Featured in "Top Clinics" sidebar',
            'Advanced Analytics (CTR & Conversion)',
            'Priority Lead Routing',
            'Custom "Special Offer" Badge',
            'Review Management Tools'
        ],
        icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
        highlight: true,
        badge: 'MOST POPULAR'
    },
    {
        name: 'Elite',
        price: '299',
        priceId: 'price_elite',
        description: 'For clinics that want to dominate their local market.',
        features: [
            'Everything in Growth',
            'Guaranteed Top 3 in City Search',
            'Dedicated SMS Lead Notifications',
            'AI-Powered Profile Optimization',
            'Quarterly Strategy Call',
            'Social Media Mention (Monthly)'
        ],
        icon: <Star className="w-6 h-6 text-amber-500" />,
        highlight: false
    }
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 bg-[#1a2332] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Grow Your Clinic with <span className="text-secondary">Botox 4U</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Join the most transparent Botox directory in the country.
                        Claim your listing to start receiving high-intent patient leads today.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                            <Zap className="w-4 h-4 text-yellow-400" /> 1,200+ Active Monthly Patients
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                            <TrendingUp className="w-4 h-4 text-green-400" /> 22% Avg. CTR
                        </div>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Pricing Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col rounded-3xl bg-white p-6 sm:p-8 shadow-xl border transition-all duration-300 hover:scale-[1.02] ${tier.highlight ? 'border-primary ring-2 ring-primary/20 lg:scale-105 z-20' : 'border-gray-100'
                                }`}
                        >
                            {tier.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                                    {tier.badge}
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-gray-50">
                                    {tier.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Monthly Plan</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-black text-gray-900">${tier.price}</span>
                                <span className="text-gray-400 font-semibold ml-2">/month</span>
                            </div>

                            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                                {tier.description}
                            </p>

                            <div className="flex-grow">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">What's Included</h4>
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                                            <div className="mt-0.5 bg-emerald-50 rounded-full p-0.5">
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={`/auth/login?plan=${tier.priceId}`}
                                className={`w-full py-6 rounded-2xl text-sm font-bold tracking-wide uppercase transition-all shadow-lg flex items-center justify-center ${tier.highlight
                                    ? 'bg-primary hover:bg-slate-800 text-white shadow-primary/20'
                                    : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 shadow-gray-200'
                                    }`}
                            >
                                Get Started Now
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 text-sm mb-4">Questions? Custom volume pricing for 5+ locations?</p>
                    <Link href="mailto:hello@botox-4u.com" className="text-primary font-bold hover:underline">
                        Contact Sales Development →
                    </Link>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2 underline decoration-secondary">How do free leads work?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                During our beta phase, we route inquiries from your city directly to your clinic via email
                                or SMS. We don't charge per lead; we charge a flat monthly fee to maintain and optimize your visibility.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2 underline decoration-secondary">Can I cancel anytime?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Yes. There are no long-term contracts. You can cancel your subscription at any time through your dashboard,
                                and your listing will revert to a standard "unverified" profile at the end of your billing cycle.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2 underline decoration-secondary">What is the "Verified Badge"?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                It's a blue checkmark next to your clinic name that tells patients your pricing,
                                credentials, and photos have been manually audited by our team for accuracy.
                                Verified clinics see 40% higher engagement on average.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
