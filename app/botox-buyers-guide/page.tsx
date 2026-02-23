import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Star, AlertTriangle, ShieldCheck, CheckCircle, Calculator, ChevronRight, BookOpen, Clock, Heart, DollarSign, Search } from 'lucide-react'
import Link from 'next/link'
import { NICHE } from '@/config/niche'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `The No-Filter Guide to Baby Botox | ${NICHE.siteName}`,
    description: "How to stay subtle, stay safe, and find the right injector. 40% of Botox complaints are about over-injection. Read our independent guide before you book.",
}

export default function BuyersGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[#fdfaf8] -z-10" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent -z-10" />

                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-bold uppercase tracking-wider">
                                Independent Patient Resource
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-8 leading-[1.1]">
                                The No-Filter Guide to <span className="text-secondary italic">Baby Botox</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                                How to Stay Subtle, Stay Safe, and Find the Right Injector.
                            </p>

                            <div className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto mb-16">
                                <div className="text-6xl font-display font-bold text-secondary mb-2">40%</div>
                                <div className="text-lg font-bold text-gray-900 mb-1">of Botox complaints are about over-injection.</div>
                                <div className="text-sm text-gray-500 italic">Data powered by the Injector Index</div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="#start">
                                    <Button className="bg-[#1a2332] hover:bg-slate-800 text-white px-10 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 group">
                                        Read the Guide
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/find-providers">
                                    <Button variant="outline" className="border-gray-200 text-gray-600 px-10 py-7 text-lg font-bold rounded-2xl hover:bg-gray-50">
                                        Browse Providers
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table of Contents / Intro */}
                <section id="start" className="py-24 bg-white scroll-mt-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4">What's Inside</h2>
                                    <ul className="space-y-6">
                                        {[
                                            "The fear data — and why it's valid",
                                            "Baby Botox explained (micro-dosing vs standard)",
                                            "Red flags: 6 reasons to walk away",
                                            "Hot Girl Math — why cheap Botox costs more",
                                            "The II-Score breakdown",
                                            "Your consultation script — 5 questions to ask",
                                            "Before & after checklist"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-4 group">
                                                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                                                    {i + 1}
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 group-hover:text-secondary transition-colors leading-tight pt-1">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aspect-[4/5] bg-[#f8f9fa] rounded-3xl p-12 flex flex-col justify-center border border-gray-100 shadow-inner">
                                    <div className="text-primary opacity-20 mb-8 decoration">
                                        <BookOpen className="w-20 h-20" />
                                    </div>
                                    <h3 className="text-3xl font-display font-bold text-primary mb-6">Free Patient Resource</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8">
                                        This guide was built by independent advocates for aesthetic medicine patients, not clinic owners. Our mission is to provide transparency across the broader aesthetic market, starting with the most common entry point: Botox.
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Injector Index Editorial Team</div>
                                            <div className="text-xs text-gray-400 font-medium italic">Verified Patient Advocates</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 1: The Fear Is Valid */}
                <section className="py-24 bg-[#fafbfc]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 01</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-12 text-center">
                                The Fear Is Valid
                            </h3>

                            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                                The frozen face isn't a punchline — it's the #1 fear patients have walking into their first appointment. And the data backs it up.
                            </p>

                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
                                        <h4 className="text-lg font-bold text-primary mb-8 uppercase tracking-wider">Top Patient Complaints</h4>
                                        <div className="space-y-8">
                                            {[
                                                { label: "Frozen face / over-injection", value: 40, color: "bg-secondary" },
                                                { label: "Hidden pricing / no transparency", value: 30, color: "bg-primary" },
                                                { label: "Unqualified injector", value: 25, color: "bg-gray-400" },
                                                { label: "Results wore off too fast", value: 20, color: "bg-gray-300" }
                                            ].map((item, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-bold">
                                                        <span>{item.label}</span>
                                                        <span className="text-secondary">{item.value}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${item.color} transition-all duration-1000`}
                                                            style={{ width: `${item.value}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 bg-secondary/5 flex flex-col justify-center">
                                        <blockquote className="text-2xl md:text-3xl font-display font-medium text-primary italic leading-tight relative">
                                            <span className="absolute -top-8 -left-4 text-6xl text-secondary opacity-20">"</span>
                                            Patients don't fear the price. They fear looking wrong.
                                            <footer className="mt-8 not-italic">
                                                <div className="text-sm font-black uppercase tracking-widest text-secondary">— The insight that built this directory</div>
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 2: Baby Botox Actually Is */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 02</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 text-center">
                                What Baby Botox Actually Is
                            </h3>
                            <p className="text-xl text-gray-600 text-center mb-20 max-w-3xl mx-auto">
                                Baby Botox isn&apos;t a product — it&apos;s a philosophy. Micro-dosing uses smaller, strategically placed amounts to soften lines while preserving natural expression.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Standard */}
                                <div className="p-10 border border-gray-100 rounded-3xl bg-white shadow-sm">
                                    <Badge variant="outline" className="mb-6 uppercase tracking-widest text-[10px] font-black border-gray-200 opacity-50">Standard Botox</Badge>
                                    <div className="text-4xl font-display font-bold text-primary mb-6">40-50 units</div>
                                    <ul className="space-y-4">
                                        {[
                                            "Concentrated placement",
                                            "Full muscle immobilization",
                                            "Dramatic line reduction",
                                            "Higher frozen face risk"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Baby */}
                                <div className="p-10 border-2 border-secondary/20 rounded-3xl bg-[#fdfaf8] shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Star className="w-8 h-8 text-secondary fill-secondary opacity-10" />
                                    </div>
                                    <Badge variant="secondary" className="mb-6 uppercase tracking-widest text-[10px] font-black bg-secondary text-white border-transparent">Baby Botox</Badge>
                                    <div className="text-4xl font-display font-bold text-secondary mb-6">15-25 units</div>
                                    <ul className="space-y-4">
                                        {[
                                            "Scattered micro-placement",
                                            "Natural movement preserved",
                                            "Subtle softening effect",
                                            "Undetectable — nobody knows"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-secondary-dark flex-shrink-0 text-sm font-bold">
                                                <CheckCircle className="w-4 h-4 text-secondary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-16 text-center">
                                <h4 className="text-lg font-bold text-primary mb-12">The three words that define a great result:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                                    <div>
                                        <div className="text-2xl font-display font-black text-secondary mb-2">Subtle</div>
                                        <p className="text-gray-500 text-sm italic">Nobody should be able to tell. They should just think you look well-rested.</p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-display font-black text-secondary mb-2">Conservative</div>
                                        <p className="text-gray-500 text-sm italic">Start low. You can always add more — you can never take it back.</p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-display font-black text-secondary mb-2">Gentle</div>
                                        <p className="text-gray-500 text-sm italic">Your face should still move. Expressiveness is the whole point.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 3: Red Flags */}
                <section className="py-24 bg-[#1a2332]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 03</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 text-center">
                                Red Flags
                            </h3>
                            <p className="text-xl text-gray-400 text-center mb-20 max-w-2xl mx-auto">
                                Walk away immediately if you see any of these.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "No upfront per-unit pricing", desc: "Legitimate providers give you the price before you sit down. 'It depends on your consultation' is a trap that ends in an oversized bill." },
                                    { title: "Suggesting 40+ units for a first visit", desc: "Conservative injectors start low. Anyone pushing high volume on a first-timer is optimizing for their revenue, not your face." },
                                    { title: "Pressure to book same-day", desc: "Reputable providers give you time to think. High-pressure tactics are a red flag in any medical context." },
                                    { title: "No follow-up policy", desc: "Good injectors offer a 2-week check-in. No follow-up means no accountability if something goes wrong." },
                                    { title: "Reviews mention 'frozen' or 'droopy'", desc: "Patient language never lies. Read the actual words, not just the star rating." },
                                    { title: "Can't confirm who's actually injecting you", desc: "A medical director on paper doesn't mean a qualified professional is in the room with you." }
                                ].map((item, i) => (
                                    <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            </div>
                                            <h4 className="font-bold text-white leading-tight">{item.title}</h4>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 4: Hot Girl Math */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 04</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 text-center">
                                Hot Girl Math
                            </h3>
                            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
                                Why the cheapest Botox is the most expensive option. The market varies by 40%+ across clinics in the same city. The danger isn&apos;t above that range — it&apos;s below it.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                                <div className="p-10 bg-red-50/50 border border-red-100 rounded-3xl">
                                    <Badge className="mb-6 bg-red-600 text-white border-transparent">The Bargain Clinic</Badge>
                                    <div className="text-4xl font-display font-black text-red-700 mb-8">$10/unit</div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between border-b border-red-100 pb-2">
                                            <span className="text-gray-500">Uses</span>
                                            <span className="font-bold">50 units (oversold)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-red-100 pb-2">
                                            <span className="text-gray-500">Total cost</span>
                                            <span className="font-bold text-primary">$500</span>
                                        </div>
                                        <div className="flex justify-between border-b border-red-100 pb-2">
                                            <span className="text-gray-500">Result</span>
                                            <span className="font-black text-red-600">Frozen face</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-gray-500">Correction</span>
                                            <span className="font-black text-red-700">$3,000+</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                                    <Badge className="mb-6 bg-emerald-600 text-white border-transparent">The Verified Expert</Badge>
                                    <div className="text-4xl font-display font-black text-emerald-700 mb-8">$18/unit</div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                                            <span className="text-gray-500">Uses</span>
                                            <span className="font-bold">20 units (strategic)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                                            <span className="text-gray-500">Total cost</span>
                                            <span className="font-bold text-primary">$360</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                                            <span className="text-gray-500">Result</span>
                                            <span className="font-black text-emerald-600">Natural glow</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-gray-500">Correction</span>
                                            <span className="font-black text-emerald-700 font-display">$0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#f8f9fa] rounded-3xl p-10 md:p-16 border border-gray-100">
                                <h4 className="text-2xl font-display font-bold text-primary mb-12 text-center underline decoration-secondary decoration-4 underline-offset-8">Average Per-Unit Pricing by City</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                                    {[
                                        { city: "New York, NY", price: "18-25" },
                                        { city: "Los Angeles, CA", price: "15-22" },
                                        { city: "Miami, FL", price: "12-18" },
                                        { city: "Chicago, IL", price: "14-20" },
                                        { city: "Dallas, TX", price: "12-16" },
                                        { city: "National Average", price: "10-25" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <span className="font-bold text-gray-900">{item.city}</span>
                                            <span className="font-display font-black text-secondary text-xl font-bold">${item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 5: The Score */}
                <section className="py-24 bg-[#fafbfc]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4">Chapter 05</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8">
                                The II-Score
                            </h3>
                            <p className="text-xl text-gray-600 mb-20 max-w-2xl mx-auto leading-relaxed">
                                Most directories rank providers by who paid the most for placement. The II-Score is a 0–100 merit-based algorithm for aesthetic providers. Nobody pays for a higher score.
                            </p>

                            <div className="space-y-4 max-w-3xl mx-auto text-left">
                                {[
                                    { pts: 30, title: "Natural Results", desc: "We analyze real review language. Providers whose patients say 'natural,' 'subtle,' and 'conservative' score highest. 'Frozen' and 'overdone' trigger automatic flags." },
                                    { pts: 25, title: "Fair Pricing", desc: "Every provider's per-unit cost is compared to their city average. Pricing transparency is rewarded — 'call for consultation' is penalized." },
                                    { pts: 20, title: "Patient Trust", desc: "Verified review count over time. Consistent long-term satisfaction — not a recent star burst." },
                                    { pts: 15, title: "Credentials", desc: "Cross-referenced against the federal NPI database. Every injector. No exceptions." },
                                    { pts: 10, title: "Transparency", desc: "Do they show real pricing? Real photos? A clear service list? Openness is scored." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="text-3xl font-display font-black text-primary leading-none">{item.pts}</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400">pts</div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-primary mb-2 line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto text-left">
                                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-secondary" />
                                    What is NPI verification?
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    The National Provider Identifier is a federal registry of every licensed US healthcare provider. We verify every injector before they appear in results.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 6: Script */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 06</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 text-center">
                                Your Consultation Script
                            </h3>
                            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
                                5 questions that separate good injectors from great ones.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { q: "Can we start with a conservative dose?", a: "A great injector agrees without hesitation. You can always add more at your 2-week follow-up — you can never take it back." },
                                    { q: "How many units do you typically recommend here?", a: "They should give you a specific range. Vague answers like 'it depends' without numbers are a red flag." },
                                    { q: "Can I see before/afters of your most natural results?", a: "Ask specifically for subtle results — not their most dramatic transformations. Watch their reaction when you ask." },
                                    { q: "Can I have your NPI number?", a: "Any legitimate licensed provider gives you this without hesitation. It's public information. Reluctance is a red flag." },
                                    { q: "What's your follow-up policy?", a: "You want a specific answer: 'Come back in 2 weeks, we'll assess.' Not a vague 'we'll figure it out if needed.'" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 p-10 bg-[#fdfaf8] rounded-3xl border border-secondary/10 group hover:border-secondary/30 transition-colors items-start">
                                        <div className="text-4xl font-display font-black text-secondary/30 group-hover:text-secondary transition-colors leading-none">0{i + 1}</div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-primary mb-4 leading-tight">{item.q}</h4>
                                            <p className="text-gray-600 leading-relaxed font-medium">{item.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapter 7: Checklist */}
                <section className="py-24 bg-[#1a2332]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 text-center">Chapter 07</h2>
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-16 text-center">
                                Before & After Checklist
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20">
                                <div className="space-y-8">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4af37] border-b border-white/10 pb-4">Before Your Appointment</h4>
                                    <div className="space-y-4">
                                        {[
                                            "Verify NPI at npiregistry.cms.hhs.gov",
                                            "Avoid aspirin & ibuprofen 1 week prior",
                                            "No alcohol 24 hours before",
                                            "Write your questions down",
                                            "Get a consultation before any injection",
                                            "Check II-Score — aim for 70+"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-white font-medium">
                                                <div className="w-5 h-5 border-2 border-white/20 rounded flex-shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-white/10 pb-4">After Your Appointment</h4>
                                    <div className="space-y-4">
                                        {[
                                            "Stay upright for 4 hours (no lying down)",
                                            "No strenuous exercise for 24 hours",
                                            "Avoid heat — sauna, steam, sun for 24hrs",
                                            "Mild swelling is normal — unusual pain: call",
                                            "Book 2-week follow-up before you leave",
                                            "Full results visible in 7-14 days"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-white font-medium">
                                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 md:p-16 bg-white rounded-[3rem] shadow-2xl">
                                <h4 className="text-3xl font-display font-bold text-primary mb-12 text-center">The Final Checklist — Before You Book</h4>
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {[
                                        "Checked their II-Score (aim for 70+)",
                                        "Verified NPI number at the federal database",
                                        "Read reviews specifically for: natural, subtle, conservative",
                                        "Confirmed per-unit pricing is stated upfront",
                                        "Confirmed who is actually performing the injection",
                                        "Saw before/afters of natural, subtle results"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                            <span className="text-lg font-bold text-gray-900 leading-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-secondary/5 -z-10" />
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary mb-8">
                                Ready to find your match?
                            </h2>
                            <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
                                Search free. No sign-up. Filter every injector in your city by their II-Score.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 max-w-2xl mx-auto">
                                <Link href="/find-providers">
                                    <Button className="w-full bg-secondary hover:bg-secondary/95 text-white py-8 text-xl font-bold rounded-2xl shadow-xl shadow-secondary/20 h-20">
                                        Search Local Index
                                    </Button>
                                </Link>
                                <Link href="/calculator">
                                    <Button variant="outline" className="w-full border-gray-200 text-gray-900 bg-white py-8 text-xl font-bold rounded-2xl hover:bg-gray-50 h-20">
                                        Dose Calculator
                                    </Button>
                                </Link>
                            </div>

                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Independent</span>
                                    <span className="mx-2 opacity-30">|</span>
                                    <span>Unbiased</span>
                                    <span className="mx-2 opacity-30">|</span>
                                    <span>Data-driven</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
