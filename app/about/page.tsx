import { NICHE } from '@/config/niche'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="py-20 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* 1. HERO SECTION: Founder Image at the TOP */}
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="w-56 h-56 md:w-72 md:h-72 relative mb-12">
                            {/* Decorative background blur */}
                            <div className="absolute inset-0 bg-secondary/10 rounded-[3.5rem] rotate-6 scale-105 blur-2xl opacity-50" />
                            <div className="w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10 bg-gray-100 border-4 border-white">
                                <Image
                                    src="/images/founder.jpg"
                                    alt="John Linneman"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-8 tracking-tight leading-[1.1]">
                            The Story Behind <span className="text-secondary">{NICHE.siteName}</span>
                        </h1>

                        <div className="text-center">
                            <h3 className="text-2xl font-display font-bold text-primary mb-1">John Linneman</h3>
                            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Founder & Patient Advocate</p>
                        </div>
                    </div>

                    {/* 2. THE INTRO NARRATIVE */}
                    <div className="max-w-3xl mx-auto space-y-10 text-2xl text-primary font-medium leading-relaxed mb-24 text-center">
                        <p className="italic underline decoration-secondary/30 underline-offset-8">
                            &quot;I&apos;m not a doctor. I don&apos;t work in aesthetics. I&apos;m just someone who saw a problem and couldn&apos;t unsee it.&quot;
                        </p>
                        <p className="text-lg text-gray-500 font-light not-italic leading-relaxed">
                            Every other industry has price transparency. Hotels. Flights. Car insurance.
                            But in {NICHE.name}? You&apos;re flying blind. I built this to change that — one person, a weekend, and an AI agent.
                        </p>
                    </div>

                    {/* 3. THE GENIUS PART: Ranking - FRONT AND CENTER */}
                    <div className="mb-24 relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] -rotate-1" />
                        <div className="bg-white p-10 md:p-20 rounded-[4rem] border border-primary/10 shadow-xl relative z-10 text-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />

                            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 tracking-tight">How our Score protects you</h2>

                            <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                                Most directories are just &quot;Pay-to-Play.&quot; The clinic that pays the most gets the top spot.
                                <span className="font-bold text-primary"> We don&apos;t do that.</span>
                                Our Score is a shortcut to help you avoid overpaying and find the most transparent {NICHE.providerTypePlural} in your city.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto">
                                {[
                                    { label: 'Real Value', desc: 'Price vs Local Avg' },
                                    { label: 'Patient Voice', desc: 'Verified Google Data' },
                                    { label: 'No Secrets', desc: 'Full Price Transparency' },
                                    { label: 'Reliability', desc: 'Proven Response Time' }
                                ].map((item) => (
                                    <div key={item.label} className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
                                        <div className="text-primary font-black text-sm uppercase tracking-tighter mb-1">{item.label}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.desc}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="inline-block px-12 py-6 bg-secondary text-white rounded-[2.5rem] font-black text-xl md:text-2xl shadow-2xl shadow-secondary/30 transform hover:scale-[1.02] transition-transform cursor-default">
                                Rankings are pure data. <br className="md:hidden" /> A higher score means better value for you.
                            </div>
                        </div>
                    </div>

                    {/* 4. THE FULL STORY */}
                    <div className="max-w-2xl mx-auto space-y-12 text-lg text-gray-600 leading-relaxed font-light">
                        <p>
                            I was researching businesses that AI couldn&apos;t replace and {NICHE.name} kept coming up. Then I started looking at the market and realized something — people are spending hundreds of dollars with almost no way to compare prices or verify credentials.
                        </p>
                        <p>
                            No clinical analysts. No venture funding. No industry connections. Just a real problem and the belief that patients deserve to know what they&apos;re paying before they sit down in that chair.
                        </p>
                        <p className="text-2xl font-bold text-primary text-center pt-8">
                            Prices vary wildly from clinic to clinic in the same city. Nobody was showing that clearly and honestly. <br />
                            <span className="text-secondary mt-4 block underline decoration-secondary/20 underline-offset-4">Now someone is.</span>
                        </p>
                    </div>

                    <div className="mt-32 text-center pb-20">
                        <Link href="/" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary font-medium transition-colors group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
