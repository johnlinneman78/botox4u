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
        <main className="bg-[#0d1420] min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Provider Directory by <span className="text-secondary">State</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        Find verified cosmetic {NICHE.providerTypePlural}, medical spas, and clinics in all 50 states. Compare local pricing averages and read authentic patient reviews.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {states.map((slug) => {
                        const name = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
                        const stateCode = STATE_MAP[slug]
                        return (
                            <Link key={slug} href={`/${NICHE.baseSlug}/${stateCode.toLowerCase()}`} className="group">
                                <Card className="p-4 text-center bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 hover:shadow-md transition-all">
                                    <span className="font-bold text-white group-hover:text-[#d4af37] transition-colors uppercase tracking-wide text-sm">
                                        {name}
                                    </span>
                                </Card>
                            </Link>
                        )
                    })}
                </div>

                {/* SEO Hub Content */}
                <section className="mt-20 border-t border-white/[0.05] pt-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-display font-bold text-white mb-8">Comprehensive Guide to Finding Cosmetic Injectors</h2>

                        <div className="space-y-8 text-gray-500 text-sm leading-relaxed">
                            <div className="space-y-4">
                                <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Understanding the {NICHE.name} Landscape</h3>
                                <p>
                                    The aesthetic industry has seen an unprecedented surge in popularity over the last decade, with {NICHE.name} becoming one of the most sought-after non-surgical cosmetic procedures globally. This growth has led to a vast expansion in the number of providers, ranging from specialized dermatology practices to general wellness medical spas.
                                </p>
                                <p>
                                    Navigating this landscape requires more than just searching for the lowest price. Safety, clinical competency, and an artistic approach to facial rejuvenation are paramount. Our directory is built to simplify this search by organizing providers geographically and auditing them based on their true clinical output and patient satisfaction.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-display font-bold text-white">Why Clinical Data Matters</h3>
                                    <p>
                                        Most directories prioritize providers who pay for top placement. At {NICHE.siteName}, we take a different approach. Our TrueScore™ ranking algorithm evaluates providers based on objective data points: years of experience, specialized certifications, and volume of successful treatments.
                                    </p>
                                    <p>
                                        By focusing on clinical excellence, we ensure that patients find injectors who are not only licensed but are also experts in their craft. Whether you are in California, Texas, or New York, our state-by-state directory connects you with the highest caliber of aesthetic professionals.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-display font-bold text-white">Comparing Costs Transparently</h3>
                                    <p>
                                        Pricing for {NICHE.name} can vary significantly depending on the region, the provider&apos;s expertise, and the clinic&apos;s overhead. We provide average local pricing to help you understand what to expect. Transparency in pricing is a hallmark of a reputable provider.
                                    </p>
                                    <p>
                                        While it may be tempting to &quot;deal hunt,&quot; we always recommend prioritizing quality. A poor injection can lead to unnatural results or complications that are far more expensive to correct than the initial cost of a premium session.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-display font-bold text-white">The Importance of Specialized Consultations</h3>
                                <p>
                                    A successful aesthetic journey begins with a thorough consultation. During this process, a qualified injector will assess your facial anatomy, discuss your goals, and create a customized treatment plan tailored to your needs. This personalized approach is what separates elite clinicians from those who follow a &quot;one-size-fits-all&quot; method.
                                </p>
                                <p>
                                    We encourage patients to use our directory to shortlist several providers and book consultations. Ask about their experience with specific areas like the forehead, crow&apos;s feet, or brow lifts. A great provider will be happy to show you their own portfolio of before-and-after results and explain their clinical philosophy.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-display font-bold text-white">Our Commitment to Patient Safety</h3>
                                <p>
                                    Safety is our number one priority. Every provider listed in our directory has been vetted to ensure they meet our baseline requirements for clinical safety and professional licensing. We believe that by providing patients with accurate, data-driven information, we can contribute to a safer and more transparent aesthetic industry.
                                </p>
                                <p>
                                    From the bustling medspas of Miami to the boutique dermatology clinics in Seattle, our mission is to be the most trusted resource for patients seeking {NICHE.name} and other aesthetic treatments. Explore our directory above to find the best provider in your state today.
                                </p>
                            </div>

                            <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/[0.06] mt-12">
                                <h4 className="text-lg font-display font-bold text-white mb-4">Educational Resources and Future Guides</h4>
                                <p className="mb-4">
                                    In addition to our directory, we offer a variety of educational resources to help you stay informed about the latest trends and safety standards in the aesthetic world. Check out our blog for deep dives into treatment comparisons, cost guides, and interviews with top industry experts.
                                </p>
                                <p>
                                    We are constantly updating our database with new providers and clinical data. If you are a provider and would like to be included in our directory, please visit our claim profile page to start the audit process.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
