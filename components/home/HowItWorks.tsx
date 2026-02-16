export default function HowItWorks() {
    const steps = [
        {
            number: '1',
            title: 'Search Your Area',
            description: 'Enter your city or zip code to find verified Botox providers near you.',
            icon: '🔍',
        },
        {
            number: '2',
            title: 'Compare & Review',
            description: 'Compare prices, read patient reviews, and view provider credentials.',
            icon: '⭐',
        },
        {
            number: '3',
            title: 'Book Consultation',
            description: 'Contact providers directly or request a consultation online.',
            icon: '📅',
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
