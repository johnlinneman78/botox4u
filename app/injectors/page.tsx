import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { STATE_MAP } from '@/lib/constants'
import { NICHE } from '@/config/niche'

export const metadata = {
    title: `${NICHE.name} Directory by State | Find Local ${NICHE.providerTypePlural.charAt(0).toUpperCase() + NICHE.providerTypePlural.slice(1)}`,
    description: `Browse our comprehensive directory of ${NICHE.name} providers across the United States. Select your state to see top-rated clinics and local pricing.`,
    alternates: {
        canonical: `https://www.injectorindex.com/${NICHE.baseSlug}`,
    },
}

export default function StatesPage() {
    const states = Object.keys(STATE_MAP).sort()

    return (
        <main
            className="min-h-screen py-24"
            style={{ background: 'var(--color-bg)' }}
        >
            <div className="container-content">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span
                        className="font-body uppercase font-bold block mb-4"
                        style={{ fontSize: '12px', letterSpacing: '0.4em', color: 'var(--color-sage)' }}
                    >
                        National Directory
                    </span>
                    <h1
                        className="text-4xl md:text-6xl font-display font-light mb-8"
                        style={{ color: 'var(--color-espresso)', lineHeight: 1.1 }}
                    >
                        Provider Directory by <span className="italic" style={{ color: 'var(--color-gold)' }}>State</span>
                    </h1>
                    <p
                        className="text-lg font-body mx-auto"
                        style={{ color: 'var(--color-stone)', maxWidth: '600px', lineHeight: 1.7 }}
                    >
                        Find verified cosmetic {NICHE.providerTypePlural}, medical spas, and clinics across the United States. Every state audited for clinical excellence and pricing transparency.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {states.map((slug) => {
                        const name = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
                        const stateCode = STATE_MAP[slug]
                        return (
                            <Link key={slug} href={`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`} className="group">
                                <Card
                                    className="p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        background: 'var(--color-surface)',
                                        borderColor: 'var(--color-border)',
                                        borderRadius: 'var(--radius-lg)'
                                    }}
                                >
                                    <span
                                        className="font-body font-bold group-hover:text-[var(--color-gold)] transition-colors uppercase tracking-[0.2em] text-xs"
                                        style={{ color: 'var(--color-espresso)' }}
                                    >
                                        {name}
                                    </span>
                                </Card>
                            </Link>
                        )
                    })}
                </div>

                {/* SEO Hub Content */}
                <section className="mt-32 pt-20 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="max-w-4xl mx-auto">
                        <span
                            className="font-body text-xs font-bold uppercase tracking-widest block mb-4"
                            style={{ color: 'var(--color-taupe)' }}
                        >
                            Clinical Excellence
                        </span>
                        <h2
                            className="text-3xl md:text-4xl font-display font-light mb-12"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            The Standard for Finding <em className="italic">Trustworthy</em> Injectors
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-body" style={{ color: 'var(--color-stone)', fontSize: '15px' }}>
                            <div className="space-y-6">
                                <h3 className="text-lg font-display font-medium" style={{ color: 'var(--color-espresso)' }}>Understanding the Landscape</h3>
                                <p className="leading-relaxed">
                                    The aesthetic industry has seen an unprecedented surge, with {NICHE.name} becoming the most sought-after non-surgical procedure globally. This growth has led to a vast expansion in providers, from specialized dermatology practices to general wellness medical spas.
                                </p>
                                <p className="leading-relaxed">
                                    Safety, clinical competency, and an artistic approach are paramount. Our directory organizes providers geographically and audits them based on true clinical output and verified patient satisfaction.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-display font-medium" style={{ color: 'var(--color-espresso)' }}>Why Clinical Data Matters</h3>
                                <p className="leading-relaxed">
                                    Most directories prioritize providers who pay for placement. At {NICHE.siteName}, we take a data-first approach. Our Clarity Score™ ranking algorithm evaluates objective points: years of experience and volume of successful treatments.
                                </p>
                                <p className="leading-relaxed">
                                    By focusing on clinical excellence, we ensure patients find injectors who are experts in their craft. Whether in CA, TX, or NY, we connect you with the highest caliber of aesthetic professionals.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 bg-white p-12 rounded-2xl border" style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                            <h4 className="text-xl font-display font-medium mb-6" style={{ color: 'var(--color-espresso)' }}>Our Commitment to Patient Safety</h4>
                            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--color-stone)' }}>
                                Every provider listed has been vetted to ensure they meet our baseline requirements for clinical safety and professional licensing. We believe that by providing patients with accurate, data-driven information, we can contribute to a safer and more transparent aesthetic industry.
                            </p>
                            <Link
                                href="/methodology"
                                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[var(--color-gold)] hover:gap-3 transition-all"
                            >
                                Read our scoring methodology →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
