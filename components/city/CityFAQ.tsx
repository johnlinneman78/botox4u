'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
            a: `Look for board-certified plastic surgeons, dermatologists, or specialized aesthetic injectors with a Clarity Score™ above 70. On InjectorIndex.com, our primary directory automatically filters for providers who pass our safety audit (55+ Score). Providers with the "Verified" badge have been cross-referenced against the federal NPI database for licensure and credential validity.`
        },
        {
            q: `How is the Clarity Score™ ranking determined for ${city} clinics?`,
            a: `Our ranking is the result of a proprietary multi-factor clinical audit. We evaluate clinics based on four foundational pillars: (1) Injection Quality; (2) Provider Credentials; (3) Innovation Adoption; and (4) Treatment Range. This ensures artisan practitioners receive proper visibility for their technical expertise.`
        },
        {
            q: `What is the "Safety Floor" and why do some providers show as "Pending"?`,
            a: `As an independent rating agency, we maintain a strict Safety Floor audit. In ${city}, providers who have not yet met our clinical data requirements or safety benchmarks are relegated to our General Directory. A "Pending" status indicates that a clinic is still undergoing our proprietary specialist audit process, ensuring only vetted talent is recommended in our primary search.`
        },
        {
            q: `What is the significance of "Innovation Adoption" in ${city}?`,
            a: `Innovation Adoption is a key Clarity Score™ pillar that measures a provider's commitment to modern aesthetic medicine and the latest clinical protocols. High-innovation clinics in ${city} are recognized for staying ahead of legacy standards, representing the current benchmark for quality results.`
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

                                <AnimatePresence initial={false}>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="px-8 pb-8">
                                                <div className="h-px w-12 mb-6" style={{ background: 'var(--color-border)' }} />
                                                <p className="font-body text-base leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
