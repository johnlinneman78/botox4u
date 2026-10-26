import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { ShieldCheck, Star, DollarSign, Phone, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { SCORE_MAX } from '@/lib/scoring'

// Keep this page in sync with lib/scoring.ts. Every number here is used there.

export const metadata: Metadata = {
    title: `How the Clarity Score Works | ${NICHE.siteName}`,
    description: `The Clarity Score™ measures how much you can confirm about a Botox or filler provider before booking: credentials, patient reviews, published pricing and contact details. Paid plans never change it.`,
    alternates: { canonical: '/methodology' },
    openGraph: {
        title: `How the Clarity Score Works | ${NICHE.siteName}`,
        description: `Credentials, patient reviews, published pricing and contact details. Paid plans never change the score.`,
        url: 'https://www.verifiedaesthetics.com/methodology',
    },
}

const PARTS = [
    {
        icon: ShieldCheck,
        title: 'Confirmed credentials',
        points: SCORE_MAX.credentials,
        items: [
            ['20', 'The provider or one of its injectors matches a record in the federal NPI registry, and we have confirmed the match.'],
            ['Up to 15', 'The confirmed injector’s license type: physician (MD/DO) 15, nurse practitioner or physician assistant 12, registered nurse 8.'],
            ['5', 'A confirmed injector has held their NPI record for 5 years or more.'],
        ],
        note: 'We only award these points once a match is confirmed. A provider we haven’t checked yet scores 0 here, which says nothing bad about them, only that we can’t vouch for it yet.',
    },
    {
        icon: Star,
        title: 'Patient reviews',
        points: SCORE_MAX.reviews,
        items: [
            ['Up to 25', 'Star rating, adjusted for how many reviews it rests on. A 5.0 from 3 reviews counts for less than a 4.8 from 400, because a handful of reviews can’t tell you much.'],
            ['Up to 15', 'Review volume: about 5 points at 10 reviews, 10 at 100, and the full 15 at 1,000.'],
        ],
        note: 'Ratings and review counts come from the provider’s public Google listing. We show the numbers and link to the reviews; we don’t copy review text.',
    },
    {
        icon: DollarSign,
        title: 'Published pricing',
        points: SCORE_MAX.pricing,
        items: [['10', 'The provider publishes a per-unit price for Botox or a comparable neurotoxin.']],
        note: 'Few clinics publish prices, so this rewards the ones that do.',
    },
    {
        icon: Phone,
        title: 'Contact & booking',
        points: SCORE_MAX.access,
        items: [
            ['4', 'A working website.'],
            ['3', 'A listed phone number.'],
            ['3', 'An online booking link.'],
        ],
        note: 'Small, but it separates an active practice from a stale listing.',
    },
]

export default function MethodologyPage() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            <div className="py-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#C9A96E] text-sm font-bold mb-8">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Methodology</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-[#3D2B1F] mb-6 tracking-tight leading-[1.1]">
                        How the Clarity Score™ works
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 font-light leading-relaxed mb-6">
                        The Clarity Score answers one question: how much can you confirm about this provider before you book? It runs from 0 to 100 and has four parts.
                    </p>
                    <p className="text-lg text-[#3D2B1F]/70 font-light leading-relaxed">
                        It is not a measure of how good someone&apos;s injections look. No directory can know that from public data, and we won&apos;t pretend to.
                    </p>
                </div>
            </div>

            <div className="px-4 pb-16">
                <div className="max-w-3xl mx-auto space-y-8">
                    {PARTS.map(part => (
                        <div key={part.title} className="bg-white rounded-3xl border border-[#3D2B1F]/10 p-8 md:p-10">
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <part.icon className="w-6 h-6 text-[#C9A96E]" />
                                    <h2 className="text-2xl font-display font-bold text-[#3D2B1F]">{part.title}</h2>
                                </div>
                                <span className="text-sm font-bold text-[#3D2B1F]/60 whitespace-nowrap">{part.points} points</span>
                            </div>
                            <table className="w-full text-left text-[15px] text-[#3D2B1F]/80">
                                <tbody>
                                    {part.items.map(([pts, text]) => (
                                        <tr key={text} className="border-t border-[#3D2B1F]/10 align-top">
                                            <td className="py-3 pr-6 font-bold text-[#3D2B1F] whitespace-nowrap">{pts}</td>
                                            <td className="py-3">{text}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="mt-4 text-sm text-[#3D2B1F]/60 leading-relaxed">{part.note}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 pb-24">
                <div className="max-w-3xl mx-auto space-y-10 text-[#3D2B1F]/80 text-[16px] leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-3">When there&apos;s no score</h2>
                        <p>
                            If a provider has fewer than 5 reviews and no confirmed NPI record, we show &quot;Not enough data&quot; instead of a number. A low number built on almost nothing would be unfair to them and useless to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-3">Reading the number</h2>
                        <p>A score above 70 almost always means we&apos;ve confirmed the provider&apos;s credentials. Providers we haven&apos;t verified yet usually land between 20 and 55, mainly because the credentials part is still empty. A lower score means we can confirm less, not that the provider is worse.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-3">What never counts</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Whether a provider pays us. Paid plans add photos, pricing and a visual highlight, never points or ranking.</li>
                            <li>How much product a clinic buys from a manufacturer, or loyalty-program status.</li>
                            <li>How many different treatments a clinic sells.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-3">What we don&apos;t check</h2>
                        <p>
                            We don&apos;t currently check state licensing boards, malpractice records or disciplinary actions. Before any injectable treatment, look up your injector on your state&apos;s medical or nursing board website and confirm their license is active.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-bold text-[#3D2B1F] mb-3">Something wrong?</h2>
                        <p>
                            If your listing has an error, <Link href="/claim" className="underline">claim your profile</Link> or email{' '}
                            <a href={`mailto:${NICHE.contactEmail}`} className="underline">{NICHE.contactEmail}</a>. Corrections to credentials or pricing change the score the next time the page refreshes.
                        </p>
                    </section>

                    <Link href="/find-providers" className="inline-flex items-center gap-2 font-bold text-[#3D2B1F] hover:text-[#C9A96E]">
                        Compare providers near you <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
