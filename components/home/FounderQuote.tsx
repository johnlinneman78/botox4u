import { NICHE } from '@/config/niche'
import Image from 'next/image'
import Link from 'next/link'

export default function FounderQuote() {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        {/* Founder Image */}
                        <div className="w-48 h-48 md:w-56 md:h-56 relative shrink-0">
                            <div className="absolute inset-0 bg-secondary/10 rounded-[2.5rem] rotate-6 scale-105 blur-xl" />
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg relative">
                                <Image
                                    src="/images/founder.jpg"
                                    alt="John Linneman"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Quote Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-display font-medium text-primary mb-8 leading-tight italic">
                                &quot;I built {NICHE.siteName} because I was tired of the guesswork. Patients deserve to know two things before they book: <span className="text-secondary font-bold">is the pricing real?</span> and <span className="text-secondary font-bold">will I look like myself?</span>&quot;
                            </h3>

                            <div className="mb-8">
                                <div className="font-bold text-xl text-primary">John Linneman</div>
                                <div className="text-[#3D2B1F]/70 font-bold uppercase tracking-widest text-xs">Founder, {NICHE.siteName}</div>
                            </div>

                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-secondary font-bold hover:underline"
                            >
                                Read our story <span className="text-xl">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
