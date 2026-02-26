import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { STATE_MAP } from '@/lib/constants'
import { NICHE } from '@/config/niche'

export const metadata = {
    title: `${NICHE.name} Directory by State | Find Local ${NICHE.providerTypePlural.charAt(0).toUpperCase() + NICHE.providerTypePlural.slice(1)}`,
    description: `Browse our comprehensive directory of ${NICHE.name} providers across the United States. Select your state to see top-rated clinics and local pricing.`,
    alternates: {
        canonical: `/${NICHE.baseSlug}`,
    },
}

export default function StatesPage() {
    const states = Object.keys(STATE_MAP).sort()

    return (
        <main className="bg-[#0d1420] min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Provider Directory by <span className="text-secondary">State</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        Find verified cosmetic ${NICHE.providerTypePlural}, medical spas, and clinics in all 50 states. Compare local pricing averages and read authentic patient reviews.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {states.map((slug) => {
                        const name = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
                        const stateCode = STATE_MAP[slug]
                        return (
                            <Link key={slug} href={`/find-providers?state=${stateCode}`} className="group">
                                <Card className="p-4 text-center bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 hover:shadow-md transition-all">
                                    <span className="font-bold text-white group-hover:text-[#d4af37] transition-colors uppercase tracking-wide text-sm">
                                        {name}
                                    </span>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
