'use client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { createCheckoutSession } from '@/lib/actions/stripe'

const plans = [
    {
        name: 'Featured',
        price: '$49',
        description: 'Boost your visibility in search results.',
        features: ['Search Priority', 'Verified Badge', 'Phone Support'],
        tier: 'featured' as const,
    },
    {
        name: 'Premium',
        price: '$99',
        description: 'DOMINATE your local market with max exposure.',
        features: ['Top of Search Guarantee', 'Direct Text Leads', 'Custom Profile Banner', 'Analytics Dashboard'],
        tier: 'premium' as const,
        highlight: true,
    }
]

export default function PricingPage() {
    async function handleUpgrade(tier: 'featured' | 'premium') {
        const result = await createCheckoutSession(tier)
        if (result?.url) {
            window.location.href = result.url
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-display font-bold text-primary">Upgrade Your Listing</h1>
                <p className="text-gray-500 mt-2">Choose the plan that fits your clinic&apos;s growth goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`relative flex flex-col ${plan.highlight ? 'border-secondary shadow-xl scale-105' : ''}`}>
                        {plan.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <div className="text-4xl font-display font-bold text-primary mt-4">
                                {plan.price}<span className="text-sm font-normal text-gray-500">/mo</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="text-success text-lg">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                onClick={() => handleUpgrade(plan.tier)}
                                className={`w-full py-6 font-bold ${plan.highlight ? 'bg-secondary hover:bg-secondary/90' : 'variant-outline'}`}
                            >
                                Select {plan.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-16 bg-gray-100 rounded-2xl p-8 text-center">
                <h3 className="font-bold text-primary mb-2">Need a custom enterprise solution?</h3>
                <p className="text-sm text-gray-600 mb-6">For multi-location practices or national franchises, contact our sales team.</p>
                <Button variant="outline">Contact Sales</Button>
            </div>
        </div>
    )
}
