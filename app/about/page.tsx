import React from 'react'
import { Shield, Target, Users, Heart, ClipboardCheck, Lock } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#1a2332] text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase mb-6">
                        Established 2024
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        Finally, <span className="text-secondary italic">Full Transparency</span> for Aesthetic Patients.
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Botox4U is the industry's first independent data platform designed to dismantle "pricing on request" culture and empower patients with verified market data.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-primary mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed italic">
                                "For too long, aesthetic clinics have guarded their pricing like secrets. We believe that transparency breeds trust, and data prevents overpaying."
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-5">
                                <div className="bg-secondary/10 p-3 rounded-2xl h-fit border border-secondary/5">
                                    <Target className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-xl mb-1">Absolute No-Bias</h3>
                                    <p className="text-gray-500 leading-relaxed">Unlike directory sites that sell "top slots" to the highest bidder, our rankings are purely data-driven. We do not accept advertising from clinics for ranking placement.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="bg-secondary/10 p-3 rounded-2xl h-fit border border-secondary/5">
                                    <ClipboardCheck className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-xl mb-1">Independent Verification</h3>
                                    <p className="text-gray-500 leading-relaxed">Our clinical analysts manually scan over 6,000 clinic websites monthly to verify state licensing, medical directorship, and unit pricing.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="bg-secondary/10 p-3 rounded-2xl h-fit border border-secondary/5">
                                    <Lock className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-xl mb-1">Pricing Transparency</h3>
                                    <p className="text-gray-500 leading-relaxed">We display the real cost-per-unit for Botox, Dysport, and Xeomin. No hidden "consultation fees" or bait-and-switch pricing.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-3xl transform lg:rotate-3">
                            <img
                                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern aesthetic clinic"
                                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 hidden md:block animate-float">
                            <div className="text-5xl font-black text-secondary mb-1">600+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Clinics</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-gray-50 py-32">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-display font-bold text-primary mb-20 text-balance">The Ethical Standards of Botox4U</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Patient Empowerment", text: "We exist to give you the upper hand. Our tools are designed to filter through the noise and find providers who respect your time and budget." },
                            { icon: Heart, title: "Clinical Integrity", text: "We prioritize patient outcomes over profit. If a clinic fails our safety verification, they are removed from our platform permanently." },
                            { icon: Shield, title: "Strict Compliance", text: "We handle data with the same rigor you expect in a medical environment. Every data point is timestamped and source-verified." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
                                <item.icon className="w-14 h-14 text-secondary mx-auto mb-8 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
