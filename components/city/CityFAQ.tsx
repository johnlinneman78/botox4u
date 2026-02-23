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
            a: `Look for board-certified dermatologists, plastic surgeons, or highly trained aesthetic nurse practitioners. Verify their NPI (National Provider Identifier) at npiregistry.cms.hhs.gov before booking. On InjectorIndex.com, providers with the "Verified" badge have been cross-referenced against the federal NPI database. Filter by II-Score to find clinics with strong natural-results track records — aim for a score of 70 or higher.`
        },
        {
            q: `Is there a difference in Botox brands available in ${city}?`,
            a: `Most clinics in ${city} offer Allergan's Botox Cosmetic, but many also carry alternatives like Dysport, Xeomin, or Jeuveau. Dysport tends to spread more and may be preferred for larger areas like the forehead. Xeomin has no accessory proteins, which can be advantageous for patients who have developed antibodies. Consult with your provider to see which brand aligns best with your goals and anatomy.`
        },
        {
            q: `What should I ask during a Botox consultation in ${city}?`,
            a: `Before getting Botox in ${city}, ask your provider: (1) "Can we start with a conservative dose?" — a great injector will agree without hesitation. (2) "How many units do you typically recommend for this area?" — expect a specific number range. (3) "Can I see before/after photos of your most natural results?" (4) "What is your NPI number?" — any licensed professional provides this immediately. (5) "What's your follow-up policy if I want adjustments?" Hesitation on any of these is a red flag.`
        },
        {
            q: `How often do I need Botox treatments in ${city}?`,
            a: `Most patients in ${city} schedule Botox every 3–4 months to maintain results. Factors that affect longevity include your metabolism, muscle mass, the treatment area, and the dosage used. New patients often start with a full dose and then find their ideal maintenance schedule over 2–3 sessions. Some patients on a consistent 3-month schedule report results lasting longer over time as muscles are retrained.`
        }
    ]

    // Build structured FAQ schema
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
        <section className="py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 mt-16">
            {/* JSON-LD FAQPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="text-center mb-12">
                <p className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-3">Local Guide</p>
                <h2 className="text-3xl font-display font-bold text-primary">
                    Botox in {city}: Common Questions
                </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, i) => (
                    <div
                        key={i}
                        className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-gray-200"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
                            aria-expanded={openIndex === i}
                        >
                            <h3 className="text-base font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                                {faq.q}
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-secondary' : ''}`}
                            />
                        </button>

                        {openIndex === i && (
                            <div className="px-6 pb-6">
                                <div className="h-px bg-gray-100 mb-4" />
                                <p className="text-gray-600 leading-relaxed text-sm">
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
