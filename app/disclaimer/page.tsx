import Link from 'next/link'

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-display font-bold text-primary mb-6">Medical Disclaimer</h1>
                <p className="text-gray-600 mb-6">Last Updated: February 19, 2026</p>

                <section className="space-y-6 text-gray-700 leading-relaxed bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-900 italic">
                    <p className="font-bold">
                        The content provided on Botox-4u.com is for informational purposes only. It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                </section>

                <section className="space-y-6 text-gray-700 leading-relaxed mt-6">
                    <p>
                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">No Doctor-Patient Relationship</h2>
                    <p>
                        Use of this website or communication via this website (including lead forms or contact requests) does not create a doctor-patient relationship between you and Botox-4u.com or any of its staff.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">Clinic Responsibility</h2>
                    <p>
                        Individual providers and clinics listed on this site are solely responsible for the medical advice and treatments they provide. Botox-4u.com does not endorse or recommend any specific providers.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8">Emergency Situations</h2>
                    <p>
                        If you think you may have a medical emergency, call your doctor or 911 immediately.
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <Link href="/" className="text-primary font-bold hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
