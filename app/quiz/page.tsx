import { Metadata } from 'next'
import BotoxPriceQuiz from '@/components/lead-funnel/BotoxPriceQuiz'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
    title: `What Should ${NICHE.name} Cost You? | 2026 Price Estimator`,
    description: `Calculate your personalized ${NICHE.name.toLowerCase()} price estimate based on your city, treatment area, and experience level. Download our free 2026 Price Guide.`,
    openGraph: {
        title: `Personalized ${NICHE.name} Price Estimate | ${NICHE.siteName}`,
        description: `Independent pricing data for ${NICHE.name.toLowerCase()} treatments across 22 major cities. Find out if you're overpaying.`,
    },
    alternates: {
        canonical: 'https://www.verifiedaesthetics.com/quiz',
    }
}

export default function QuizPage() {
    return (
        <div className="min-h-screen bg-[#F7F4F0]">
            {/* Decorative Header Area */}
            <div className="pt-20 pb-4 text-center">
                {/* We can add a small logo or back link here if needed */}
            </div>

            <main className="pb-24">
                <BotoxPriceQuiz />
            </main>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": `${NICHE.name} Price Estimator`,
                        "description": `Calculate your personalized ${NICHE.name.toLowerCase()} price estimate based on industry data.`,
                        "applicationCategory": "HealthApplication",
                        "operatingSystem": "All",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })
                }}
            />
        </div>
    )
}
