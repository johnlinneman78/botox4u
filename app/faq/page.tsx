import { NICHE } from '@/config/niche'
import { ShieldCheck, Target, DollarSign, Clock, HelpCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "FAQ | InjectorIndex",
    description: "Common questions about finding botox injectors",
    openGraph: {
        title: "FAQ | InjectorIndex",
        description: "Common questions about finding botox injectors",
        url: "https://www.injectorindex.com/faq",
    }
}

export default function FAQPage() {
    const faqs = [
        {
            question: "What is the TrueScore™?",
            answer: "The TrueScore™ is a proprietary algorithm that ranks providers based on clinical data, verified credentials, and patient-reported pricing. Unlike other directories, you cannot pay to increase your TrueScore™."
        },
        {
            question: "Is clinical data independently verified?",
            answer: "Yes. We cross-reference provider credentials with state licensing boards and NPI records. We also aggregate patient-reported outcomes to verify 'Natural Results' claims."
        },
        {
            question: "How do I add my practice to the Index?",
            answer: "Most high-volume practices are already in our database. You can search for your practice and click 'Claim Profile' to take control of your listing."
        },
        {
            question: "Why is pricing transparency important?",
            answer: "Our data shows that profiles with listed prices receive 65% more patient inquiries. Patients value transparency, and we reward it in our rankings."
        }
    ]

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <div className="bg-[#0d1420] min-h-screen pt-24 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-6">
                        <HelpCircle className="w-3 h-3" />
                        <span>Support Center</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                        Common Questions
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Everything you need to know about the {NICHE.siteName} standard and how we rank providers.
                    </p>
                </div>

                <div className="space-y-6 mb-20">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors group">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-4">
                                <span className="text-[#d4af37] opacity-50 font-mono">0{i + 1}</span>
                                {faq.question}
                            </h3>
                            <p className="text-gray-400 font-light leading-relaxed pl-10">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[3rem] bg-gradient-to-br from-[#d4af37] to-[#b8962e] text-[#0d1420] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />

                    <h2 className="text-3xl font-display font-bold mb-4 relative z-10">Still have questions?</h2>
                    <p className="text-lg opacity-80 mb-8 relative z-10 font-medium">
                        Our team of medical aesthetic analysts are here to help.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link
                            href={`mailto:${NICHE.outreach.senderEmail}`}
                            className="bg-[#0d1420] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                        >
                            Contact Support
                        </Link>
                        <Link
                            href="/methodology"
                            className="bg-[#0d1420]/10 border border-[#0d1420]/20 text-[#0d1420] px-8 py-4 rounded-2xl font-bold hover:bg-[#0d1420]/20 transition-colors"
                        >
                            View Methodology
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
