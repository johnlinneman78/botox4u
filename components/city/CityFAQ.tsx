'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CityFAQProps {
    city: string
    avgCost: number
}

export function CityFAQ({ city, avgCost }: CityFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const lowEndTotal = Math.round(avgCost * 20)
    const highEndTotal = Math.round(avgCost * 50)

    const faqs = [
        {
            q: `How much does Botox cost in ${city}?`,
            a: `The average cost of Botox in ${city} is approximately $${avgCost} per unit. Most patients require between 20 and 50 units per session, depending on the treatment area — bringing typical session costs to $${lowEndTotal}–$${highEndTotal}. Forehead lines usually need 10–20 units, crow's feet 6–12 units per side, and frown lines (glabella) 20–25 units. Prices vary by provider credentials and clinic location.`
        },
        {
            q: `How do I find a reputable Botox injector in ${city}?`,
            a: `Look for board-certified plastic surgeons, dermatologists, or specialized aesthetic injectors with a TrueScore™ above 70. On InjectorIndex.com, our primary directory automatically filters for providers who pass our safety audit (55+ Score). Providers with the "Verified" badge have been cross-referenced against the federal NPI database for licensure and credential validity.`
        },
        {
            q: `How is the TrueScore™ ranking determined for ${city} clinics?`,
            a: `Our ranking is the result of a proprietary multi-factor clinical audit. We evaluate clinics based on four foundational pillars: (1) Injection Quality; (2) Provider Credentials; (3) Innovation Adoption; and (4) Treatment Range. This ensures artisan practitioners receive proper visibility for their technical expertise.`
        },
        {
            q: `What is the "Safety Floor" and why do some providers show as "Pending"?`,
            a: `As an independent rating agency, we maintain a strict Safety Floor audit. In ${city}, providers who have not yet met our clinical data requirements or safety benchmarks are relegated to our General Directory. A "Pending" status indicates that a clinic is still undergoing our proprietary specialist audit process, ensuring only vetted talent is recommended in our primary search.`
        },
        {
            q: `What is the significance of "Innovation Adoption" in ${city}?`,
            a: `Innovation Adoption is a key TrueScore™ pillar that measures a provider's commitment to modern aesthetic medicine and the latest clinical protocols. High-innovation clinics in ${city} are recognized for staying ahead of legacy standards, representing the current benchmark for quality results.`
        },
        {
            q: `Is there a difference in Botox brands available in ${city}?`,
            a: `Most clinics in ${city} offer Allergan's Botox Cosmetic, but many also carry alternatives like Dysport, Xeomin, or Jeuveau. Consult with your provider to see which brand aligns best with your goals; for instance, high-scoring specialists often use a mix of brands to tailor results to specific muscle groups.`
        },
        {
            q: `What should I ask during a Botox consultation in ${city}?`,
            a: `Before treatment in ${city}, ask: (1) "What is your approach to natural results?" (2) "Can I see photos of your conservative work?" and (3) "What is your NPI number?" Licensed professionals provide these immediately. Hesitation on any safety or credential question is a red flag.`
        }
    ]

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    }

    return (
        <section className="py-16 bg-white/[0.02] rounded-3xl border border-white/[0.06] p-8 md:p-12 mt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="text-center mb-12">
                <p className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-3">Local Guide</p>
                <h2 className="text-3xl font-display font-bold text-white">
                    Botox in {city}: Common Questions
                </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, i) => (
                    <div
                        key={i}
                        className="border border-white/[0.06] rounded-2xl overflow-hidden transition-all hover:border-white/10"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
                            aria-expanded={openIndex === i}
                        >
                            <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#d4af37] transition-colors">
                                {faq.q}
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-600 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-[#d4af37]' : ''}`}
                            />
                        </button>

                        {openIndex === i && (
                            <div className="px-6 pb-6">
                                <div className="h-px bg-white/[0.06] mb-4" />
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {faq.a}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
