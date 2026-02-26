import React from 'react'
import ClinicAuditForm from '@/components/audit/ClinicAuditForm'
import { ShieldCheck, BarChart3, Mail, Download } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free 2026 Clinic Safety Audit | InjectorIndex',
    description: 'Score your clinic against TrueScore™ benchmarks. Get a personalized PDF report on Clinical Quality, Natural Integrity, and Pricing.'
}

export default function AuditPage() {
    return (
        <div className="min-h-screen bg-[#05080d]">
            <Header />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                            Independent Patient Advocacy
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Is Your Clinic <br />
                            <span className="text-[#d4af37]">Clinical-Ready?</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-lg">
                            The 2026 aesthetic landscape has shifted. Traditional HA filler is out; Biologics and Natural Integrity are in. Get an independent audit of your provider.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: ShieldCheck, title: 'TrueScore™ V2.0', desc: 'Score clinics against safety and innovation benchmarks.' },
                                { icon: BarChart3, title: 'Price Integrity', desc: 'Compare your quote against zip-code market averages.' },
                                { icon: Mail, title: 'Email Delivery', desc: 'Detailed report delivered immediately to your inbox.' },
                                { icon: Download, title: 'PDF Analysis', desc: 'Full-breakdown PDF for your next consultation.' }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <feature.icon className="w-6 h-6 text-[#d4af37] shrink-0" />
                                    <div>
                                        <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                                        <p className="text-sm text-gray-500">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30">
                            <p className="text-sm text-[#d4af37] font-medium leading-relaxed italic">
                                "Our mission is to ensure every patient has access to clinics prioritizing long-term biological health over temporary over-filling."
                            </p>
                        </div>
                    </div>

                    <div>
                        <ClinicAuditForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
