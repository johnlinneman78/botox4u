import React from 'react'
import { Shield, Target, Users, Heart } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#1a2332] text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
                        Finally, Transparency in <span className="text-secondary italic">Aesthetics</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Botox4U was founded on a simple principle: You shouldn't have to wait for a consultation to know what your treatment will cost.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-primary mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            For years, the aesthetic medicine industry has been shrouded in "pricing on request" and hidden fees. We're changing that by scraping and verifying real per-unit pricing for over 600 top injectors across the country.
                        </p>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-secondary/10 p-3 rounded-xl h-fit">
                                    <Target className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-xl mb-1">Unbiased Data</h3>
                                    <p className="text-gray-500">We don't accept "pay-to-play" rankings. Our provider tiers are based on verification and data accuracy.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-secondary/10 p-3 rounded-xl h-fit">
                                    <Shield className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-xl mb-1">Safety First</h3>
                                    <p className="text-gray-500">Every provider listed is manually checked for active medical licenses and professional clinic environments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1000"
                                alt="Aesthetic treatment"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                            <div className="text-4xl font-black text-secondary mb-1">100%</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Independent Verification</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-display font-bold text-primary mb-16">The Botox4U Promise</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                            <Users className="w-12 h-12 text-secondary mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-primary mb-4">Patient Empowerment</h3>
                            <p className="text-gray-600 leading-relaxed">We provide the tools and data you need to choose the right injector for your budget and goals.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                            <Heart className="w-12 h-12 text-secondary mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-primary mb-4">Integrity</h3>
                            <p className="text-gray-600 leading-relaxed">Our data is collected independently. We never manipulate prices or credentials for profit.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                            <Shield className="w-12 h-12 text-secondary mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-primary mb-4">Verification</h3>
                            <p className="text-gray-600 leading-relaxed">We strictly verify MD, DO, NP, and RN certifications to ensure you're in safe hands.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
