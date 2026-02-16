interface CityFAQProps {
    city: string
    avgCost: number
}

export function CityFAQ({ city, avgCost }: CityFAQProps) {
    const faqs = [
        {
            q: `How much does Botox cost in ${city}?`,
            a: `The average cost of Botox in ${city} is approximately ${avgCost} per unit. Most patients require between 20 and 50 units per session, depending on the treatment area. Total treatment prices typically range from $300 to $800.`
        },
        {
            q: `How do I find a reputable Botox injector in ${city}?`,
            a: `Look for board-certified dermatologists, plastic surgeons, or highly trained aesthetic nurse practitioners. Check our directory for "Verified" badges and read local reviews to ensure quality and safety.`
        },
        {
            q: `Is there a difference in Botox brands available in ${city}?`,
            a: `Most clinics in ${city} offer Allergan's Botox Cosmetic, but many also carry alternatives like Dysport, Xeomin, or Jeuveau. Consult with your provider to see which brand is best for your specific goals.`
        }
    ]

    return (
        <section className="py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 mt-16">
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
                Frequently Asked Questions about Botox in {city}
            </h2>
            <div className="max-w-3xl mx-auto space-y-8">
                {faqs.map((faq, i) => (
                    <div key={i}>
                        <h3 className="text-lg font-bold text-primary mb-3">
                            {faq.q}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>

            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
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
                    })
                }}
            />
        </section>
    )
}
