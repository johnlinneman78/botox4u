import { NICHE } from '@/config/niche'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Target, DollarSign, Users, Eye } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="py-20 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* 1. HERO SECTION */}
                    <div className="flex flex-col items-center text-center mb-20">
                        <div className="w-56 h-56 md:w-64 md:h-64 relative mb-12">
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
                            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Founder, {NICHE.siteName}</p>
                        </div>
                    </div>

                    {/* 2. THE INTRO NARRATIVE */}
                    <div className="max-w-3xl mx-auto space-y-12 text-xl text-primary font-medium leading-relaxed mb-24">
                        <p className="text-3xl font-display font-bold text-center mb-10 text-balance">
                            &quot;I&apos;m not a doctor. I don&apos;t work in aesthetics. I&apos;m just someone who saw a problem and couldn&apos;t unsee it.&quot;
                        </p>

                        <div className="space-y-8 text-gray-600 font-light text-lg">
                            <p>
                                I was researching businesses that AI couldn&apos;t replace and {NICHE.name} kept coming up. Then I started reading what patients actually said about their experiences online.
                            </p>

                            <p className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 text-rose-900 font-medium italic relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Target className="w-20 h-20" />
                                </div>
                                &quot;The complaints weren&apos;t what I expected. Yes, people were frustrated by hidden pricing.
                                But the biggest fear — the one that came up again and again — was walking out looking &apos;frozen.&apos;
                                Droopy eyelids. A heavy forehead. People just wanted to look like themselves, but slightly refreshed.&quot;
                            </p>

                            <p>
                                They weren&apos;t looking for the cheapest injector. They were looking for someone they could trust not to overdo it.
                            </p>

                            <p>
                                So I built this. One person, a weekend, and an AI agent. No clinical analysts. No venture funding. No industry connections. Just a real problem and the belief that patients deserve better information before making a healthcare decision.
                            </p>
                        </div>
                    </div>

                    {/* 3. HOW THE SCORE WORKS (V2) */}
                    <div className="mb-24 relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] -rotate-1" />
                        <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-primary/10 shadow-xl relative z-10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />

                            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-12 tracking-tight text-center">Built for Patients. Not Clinics.</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {[
                                    { icon: Target, label: 'Natural Results', points: '30 pts', desc: 'Patients saying "subtle" and "not overdone" rank highest.' },
                                    { icon: DollarSign, label: 'Fair Pricing', points: '25 pts', desc: 'Real per-unit pricing compared to your city average.' },
                                    { icon: Users, label: 'Patient Trust', points: '20 pts', desc: 'Verified public review volume and sentiment signal.' },
                                    { icon: ShieldCheck, label: 'Verified Registry', points: '15 pts', desc: 'Cross-referenced against federal NPI licensing.' },
                                    { icon: Eye, label: 'Transparency', points: '10 pts', desc: 'Rewards clinics that show pricing and real photos upfront.' }
                                ].map((item) => (
                                    <div key={item.label} className="flex gap-4 items-start p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                                        <div className="p-3 rounded-2xl bg-white shadow-sm text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-bold text-primary">{item.label}</div>
                                                <span className="text-[10px] font-black text-secondary uppercase bg-secondary/10 px-1.5 py-0.5 rounded">+{item.points}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 font-light leading-snug">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-bold text-primary mb-4 p-6 bg-secondary/10 rounded-2xl inline-block">
                                    Nobody pays for a higher score. That&apos;s the whole point.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. CREDENTIALS VERIFICATION */}
                    <div className="max-w-3xl mx-auto mb-24 space-y-8">
                        <h2 className="text-3xl font-display font-bold text-primary">How We Verify Credentials</h2>
                        <div className="p-8 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck className="w-24 h-24" />
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed font-light mb-6">
                                Every provider is cross-referenced against the federal NPI (National Provider Identifier) database — the government&apos;s official registry of licensed healthcare providers. We verify that every listed injector holds a valid medical credential.
                            </p>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-sm text-gray-400 font-light">
                                <p>
                                    We are an independent third-party research platform. We are not a medical board or licensing authority. NPI verification confirms the existence of a valid federal provider registration. Always consult directly with your provider about their qualifications and experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pb-20 border-t border-gray-100 pt-16">
                        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            <span>Find a Conservative Injector Near You</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
