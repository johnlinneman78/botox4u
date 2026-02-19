import { NICHE } from '@/config/niche'

export default function HowItWorks() {
    const steps = [
        {
            number: '1',
            title: 'Search Your City',
            description: `Enter your location to see every verified ${NICHE.name} injector in your immediate area.`,
            icon: '📍',
        },
        {
            number: '2',
            title: 'Use the Score Defense',
            description: `Filter by our proprietary Score. We rank by real pricing and verified data, not ad dollars.`,
            icon: '🛡️',
        },
        {
            number: '3',
            title: 'Book with Confidence',
            description: `Now that you know the fair market price and the injector's track record, book with zero doubt.`,
            icon: '✨',
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold text-primary mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Finding the right Botox provider is simple with our platform
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((step) => (
                        <div key={step.number} className="text-center">
                            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                {step.icon}
                            </div>
                            <div className="mb-4">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold text-lg mb-2">
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="text-xl font-display font-semibold text-primary mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
