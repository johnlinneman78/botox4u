'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { NICHE } from '@/config/niche'

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
            a: `Look for board-certified plastic surgeons, dermatologists, or specialized aesthetic injectors with a Clarity Score™ above 70. On VerifiedAesthetics.com, our primary directory automatically filters for providers who pass our safety audit (55+ Score). Providers with the "Verified" badge have been cross-referenced against the federal NPI database for licensure and credential validity.`
        },
        {
            q: `How is the Clarity Score™ ranking determined for ${city} clinics?`,
            a: `Clinics in ${city} are ranked by Clarity Score™, a 0–100 measure of how much you can confirm before booking: confirmed credentials (40 points), patient reviews adjusted for how many there are (40), published pricing (10) and contact and booking details (10). Paid plans never change the ranking. Our methodology page shows exactly how each part is calculated.`
        },
        {
            q: `Why do some providers show "Not enough data"?`,
            a: `A provider in ${city} gets a Clarity Score™ once it has at least 5 reviews or a confirmed NPI registry record. Below that, a number would say more about our data than about the clinic, so we show "Not enough data" instead. It is not a judgment of the provider.`
        },
        {
            q: `Does offering newer treatments raise a clinic's score?`,
            a: `No. How many or how new a clinic's treatments are doesn't affect the Clarity Score™. Newer isn't automatically better for you, and we don't want to reward clinics for selling more.`
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
        <section className="py-24">
            <div className="container-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="p-10 md:p-16 rounded-[48px] border relative overflow-hidden"
                    style={{
                        background: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                    />

                    <div className="text-center mb-16">
                        <div className="flex justify-center items-center gap-3 mb-6">
                            <HelpCircle className="w-5 h-5 opacity-40" style={{ color: 'var(--color-gold)' }} />
                            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--color-taupe)' }}>
                                Local Treatment Guide
                            </h3>
                        </div>
                        <h2
                            className="text-3xl md:text-5xl font-display font-light mb-6"
                            style={{ color: 'var(--color-espresso)' }}
                        >
                            Botox in <span className="italic" style={{ color: 'var(--color-gold)' }}>{city}</span>: Common Questions
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border transition-all duration-300"
                                style={{
                                    background: 'var(--color-bg)',
                                    borderColor: openIndex === i ? 'var(--color-gold)' : 'var(--color-border)',
                                    boxShadow: openIndex === i ? 'var(--shadow-md)' : 'none'
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full text-left px-8 py-6 flex items-center justify-between gap-6 group"
                                    aria-expanded={openIndex === i}
                                >
                                    <h3
                                        className="text-base md:text-lg font-body font-bold leading-tight transition-colors"
                                        style={{ color: openIndex === i ? 'var(--color-espresso)' : 'var(--color-stone)' }}
                                    >
                                        {faq.q}
                                    </h3>
                                    <div
                                        className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                                        style={{
                                            borderColor: openIndex === i ? 'var(--color-gold)' : 'var(--color-border)',
                                            background: openIndex === i ? 'var(--color-gold)' : 'transparent'
                                        }}
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#3D2B1F]' : 'text-[var(--color-stone)]'}`}
                                        />
                                    </div>
                                </button>

                                {/* Always in the DOM so search engines and screen
                                    readers get the answers; collapsed with height,
                                    not by unmounting. */}
                                <motion.div
                                    initial={false}
                                    animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    aria-hidden={openIndex !== i}
                                >
                                    <div className="px-8 pb-8">
                                        <div className="h-px w-12 mb-6" style={{ background: 'var(--color-border)' }} />
                                        <p className="font-body text-base leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                            {faq.a}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
