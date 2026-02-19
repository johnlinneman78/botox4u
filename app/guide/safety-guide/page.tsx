import React from 'react'
import { Shield, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react'

export default function SafetyGuidePage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#1a2332] text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Shield className="w-16 h-16 text-secondary mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Patient Safety & Provider Verification Guide</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        At Botox4U, patient safety is our highest priority. We verify every provider on our platform to ensure they meet the highest standards of care.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-primary mb-4">Our Verification Process</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold mt-1">Verified</span>
                                <span>Active State Medical/Nursing Licenses for all injectors.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold mt-1">Verified</span>
                                <span>Physical clinic address and professional medical environment.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold mt-1">Verified</span>
                                <span>Authentic patient reviews and track record of clinical excellence.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
                        <h2 className="text-2xl font-bold text-primary mb-4">Patient Red Flags</h2>
                        <p className="text-gray-600 mb-6">Always avoid providers who exhibit these warning signs:</p>
                        <ul className="space-y-4 text-gray-600">
                            <li>• Extremely low prices (often indicates counterfeit product).</li>
                            <li>• Providers operating out of residential homes or non-medical settings.</li>
                            <li>• Lack of consultation or health history review before treatment.</li>
                            <li>• Refusal to show the product packaging or lot numbers.</li>
                        </ul>
                    </div>
                </div>

                <section className="border-t border-gray-100 pt-16">
                    <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center underline decoration-secondary decoration-4 underline-offset-8">What to Ask Your Injector</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4 p-6 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="bg-primary/5 p-3 rounded-lg h-fit">
                                <UserCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">"What is your medical qualification?"</h3>
                                <p className="text-gray-600">Ensure they are an MD, DO, NP, PA, or RN with specialized training in aesthetic medicine.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="bg-primary/5 p-3 rounded-lg h-fit">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">"Who is the medical director for this clinic?"</h3>
                                <p className="text-gray-600">Every medical spa or clinic should have a designated Medical Director responsible for oversight.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
