import React from 'react'
import { Shield, CheckCircle, AlertTriangle, UserCheck, Stethoscope, Building2, PackageCheck } from 'lucide-react'

export default function SafetyGuidePage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#1a2332] text-[#3D2B1F] py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary/80 opacity-50" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Shield className="w-20 h-20 text-secondary mx-auto mb-8 animate-pulse" />
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Patient Safety <span className="text-secondary">&</span> Verification</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Choosing an injector is a medical decision, not a retail one. Our 3-pillar verification process ensures every clinic on InjectorIndex meets clinical standards.
                    </p>
                </div>
            </div>

            {/* The 3 Pillars */}
            <div className="max-w-7xl mx-auto py-24 px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-primary mb-2">Our 3 Core Safety Pillars</h2>
                    <p className="text-[#3D2B1F]/60">How we audit and verify every listing on our platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <Stethoscope className="w-12 h-12 text-secondary mb-6" />
                        <h3 className="text-2xl font-bold text-primary mb-4">Pillar 1: Credentials</h3>
                        <p className="text-[#3D2B1F]/50 leading-relaxed">
                            We manually verify active state licenses for MDs, DOs, NPs, PAs, and RNs. Every clinic must have a designated Medical Director for clinical oversight.
                        </p>
                    </div>
                    <div className="p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <Building2 className="w-12 h-12 text-secondary mb-6" />
                        <h3 className="text-2xl font-bold text-primary mb-4">Pillar 2: Environment</h3>
                        <p className="text-[#3D2B1F]/50 leading-relaxed">
                            No "Botox parties" or residential injections. We only list clinics operating in professional, sanitized, and medically-equipped physical locations.
                        </p>
                    </div>
                    <div className="p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <PackageCheck className="w-12 h-12 text-secondary mb-6" />
                        <h3 className="text-2xl font-bold text-primary mb-4">Pillar 3: Authenticity</h3>
                        <p className="text-[#3D2B1F]/50 leading-relaxed">
                            We audit supply chains where possible and verify that clinics use FDA-approved neurotoxins (Botox Cosmetic, Dysport, Xeomin, Jeuveau).
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-[3rem] p-12 lg:p-20">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-primary mb-8">Patient Red Flags</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Suspiciously Low Pricing", text: "If the price is below $9/unit, it may indicate diluted product or non-FDA-approved counterfeits." },
                                { title: "Lack of Health History", text: "Every medical procedure requires a full intake. If they don't ask for your medical history, walk away." },
                                { title: "Mobile Injections", text: "Medical procedures should occur in controlled environments. Be wary of providers travelling to homes." }
                            ].map((flag, i) => (
                                <div key={i} className="flex gap-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-primary">{flag.title}</h4>
                                        <p className="text-[#3D2B1F]/50 text-sm">{flag.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary p-12 rounded-[2.5rem] text-[#3D2B1F]">
                        <h3 className="text-2xl font-display font-bold mb-6">Ask Your Injector:</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                <p className="text-lg leading-relaxed font-medium">"Who is the supervising physician for this clinic?"</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                <p className="text-lg leading-relaxed font-medium">"Can I see the vial and the lot number before my treatment?"</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                <p className="text-lg leading-relaxed font-medium">"What is your protocol if I have an adverse reaction?"</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
