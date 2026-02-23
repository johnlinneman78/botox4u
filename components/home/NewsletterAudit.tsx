'use client'

import { useState } from 'react'
import { Mail, Dna, ChevronRight, CheckCircle, Search, User, UserCheck, ShieldAlert, Sparkles, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitLead } from '@/lib/actions/leads'

const PROCEDURES = [
    'Polynucleotides (PNs)',
    'Daxxify / Long-Acting Tox',
    'Baby Botox / Preventative',
    'Biostimulators (Sculptra)',
    'Exosome Therapy',
    'Traditional Fillers',
    'Jawline Contouring',
    'Not sure yet',
]

const CONCERNS = [
    'Natural Results Integrity',
    'Safety & Credentials',
    'Pricing Transparency',
    'Long-Term Skin Health',
    'Treatment Longevity',
    'Provider Experience'
]

type Step = 'identify' | 'considerations' | 'concerns' | 'success'

export default function NewsletterAudit() {
    const [step, setStep] = useState<Step>('identify')
    const [loading, setLoading] = useState(false)
    const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [clinic, setClinic] = useState('')
    const [isFirstTimer, setIsFirstTimer] = useState(true)
    const [auditResult, setAuditResult] = useState<any>(null)

    const toggleProcedure = (p: string) =>
        setSelectedProcedures(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

    const toggleConcern = (c: string) =>
        setSelectedConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('full_name', fullName)
            formData.append('treatment_type', selectedProcedures.join(', '))
            formData.append('current_considerations', clinic)
            formData.append('is_first_timer', isFirstTimer.toString())
            formData.append('client_concerns', JSON.stringify(selectedConcerns))
            formData.append('newsletter_opt_in', 'true')

            // Submit the lead
            const result = await submitLead(formData)

            if (result.error) {
                console.error('Audit submission error:', result.error)
                alert('We encountered an error processing your audit. Please try again or contact support.')
                setLoading(false)
                return
            }

            // Real-Time Audit Lookup
            // We'll try to find the provider in our database to show a real score
            const searchResponse = await fetch(`/api/providers?query=${encodeURIComponent(clinic)}&limit=1`)
            const searchData = await searchResponse.json()
            const foundProvider = searchData.providers?.[0]

            if (foundProvider && foundProvider.name.toLowerCase().includes(clinic.toLowerCase().split(' ')[0])) {
                setAuditResult({
                    clinicName: foundProvider.name,
                    status: foundProvider.score_total >= 60 ? 'PASS' : 'PENDING',
                    score: foundProvider.score_total || 50,
                    isReal: true
                })
            } else {
                setAuditResult({
                    clinicName: clinic || 'Selected Clinics',
                    status: 'PENDING',
                    score: 45, // Manual audit required indicator
                    isReal: false
                })
            }

            setStep('success')
        } catch (err) {
            console.error('Audit submission failed:', err)
            alert('A network error occurred. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-[#0d1420] border-t border-white/[0.05]" id="newsletter">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-[#131f30] to-[#0d1720] border border-white/[0.07] rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Copy */}
                            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-white/[0.01]">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-6">
                                    <Dna className="w-3 h-3" /> Patient Intelligence Portal
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                                    Is Your Injector <span className="text-[#d4af37]">2026-Ready?</span>
                                </h2>
                                <p className="text-gray-400 leading-relaxed mb-10 font-light text-lg">
                                    Don't rely on unverified reviews. Provide your history and the clinics you're researching, and we'll cross-reference them with our 2026 Independent Audit pillars.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: ShieldAlert, title: 'Safety Integrity', text: 'NPI & Credential check for your considered clinics.' },
                                        { icon: UserCheck, title: 'Patient History Alignment', text: 'Custom advice based on whether you are a first-timer or returning.' },
                                        { icon: Sparkles, title: 'Price/Result Matching', text: 'Compare your target clinic\'s rates against Neighborhood Averages.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37]/10 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                                <p className="text-xs text-gray-500 font-light">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/[0.06]">
                                    <p className="text-[11px] text-gray-600 font-medium">
                                        ESTIMATED ADVICE DELIVERY: <span className="text-emerald-500 underline underline-offset-4 tracking-widest">&lt; 2 MINUTES</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right: Multi-step Form */}
                            <div className="p-10 md:p-14 flex flex-col justify-center min-h-[500px]">
                                {step === 'success' ? (
                                    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Audit Profile Generated</h3>
                                            <p className="text-xs text-gray-400">We are processing your request for <strong>{auditResult?.clinicName}</strong>.</p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-[#d4af37]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Clinic Status</p>
                                                        <p className="text-sm font-bold text-white uppercase">{auditResult?.clinicName}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border ${auditResult?.status === 'PASS' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'}`}>
                                                    {auditResult?.status}
                                                </div>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Natural Integrity Status</p>
                                                    <p className={`text-xs font-black ${auditResult?.score > 70 ? 'text-emerald-400' : 'text-[#d4af37]'}`}>
                                                        {auditResult?.score > 70 ? 'ELITE' : 'OBSERVED'}
                                                    </p>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-500 transition-all duration-1000"
                                                        style={{ width: `${auditResult?.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 text-center leading-relaxed">
                                            Check your inbox. A detailed breakdown including <strong>Treatment Longevity Forecast</strong> and <strong>NPI Verification Data</strong> has been sent to <span className="text-white font-bold">{email}</span>.
                                        </p>

                                        <Button
                                            onClick={() => setStep('identify')}
                                            className="mt-8 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-3 rounded-xl border border-white/10"
                                        >
                                            Run Another Audit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Step Progress */}
                                        <div className="flex gap-2 mb-4">
                                            {(['identify', 'considerations', 'concerns'] as Step[]).map((s, i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${(['identify', 'considerations', 'concerns'] as Step[]).indexOf(step) >= i ? 'bg-[#d4af37]' : 'bg-white/5'
                                                    }`} />
                                            ))}
                                        </div>

                                        {step === 'identify' && (
                                            <form className="space-y-6 animate-in slide-in-from-right-4 duration-300" onSubmit={(e) => { e.preventDefault(); setStep('considerations'); }}>
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-white">Let's start with the basics.</h3>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2 block">Your Identification</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                            <input
                                                                type="email"
                                                                required
                                                                value={email}
                                                                onChange={e => setEmail(e.target.value)}
                                                                placeholder="Email for Audit Delivery"
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#d4af37]/40"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                        <input
                                                            type="text"
                                                            value={fullName}
                                                            onChange={e => setFullName(e.target.value)}
                                                            placeholder="Full Name (optional)"
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#d4af37]/40"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2 block">Interested Treatments</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {PROCEDURES.map(p => (
                                                            <button
                                                                type="button"
                                                                key={p}
                                                                onClick={() => toggleProcedure(p)}
                                                                className={`text-[10px] font-black px-4 py-3.5 rounded-xl border transition-all uppercase tracking-widest ${selectedProcedures.includes(p)
                                                                    ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]'
                                                                    : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                                                    }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={!email || selectedProcedures.length === 0}
                                                    className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black h-14 rounded-2xl shadow-xl shadow-[#d4af37]/10 disabled:opacity-30"
                                                >
                                                    Continue to Clinic Research
                                                </Button>
                                            </form>
                                        )}

                                        {step === 'considerations' && (
                                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-white">Who are you looking at?</h3>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2 block">Considered Clinics/Injectors</label>
                                                        <div className="relative">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                            <input
                                                                type="text"
                                                                value={clinic}
                                                                onChange={e => setClinic(e.target.value)}
                                                                placeholder="Search or enter clinic names..."
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#d4af37]/40"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-gray-600 mt-2 italic px-1">We'll perform a real-time Audit on these identifiers.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2 block">Patient Experience</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => setIsFirstTimer(true)}
                                                            className={`p-4 rounded-2xl border transition-all text-left ${isFirstTimer ? 'bg-[#d4af37]/10 border-[#d4af37]/50 ring-1 ring-[#d4af37]/50' : 'bg-white/5 border-white/10 opacity-50'}`}
                                                        >
                                                            <p className="text-xs font-black text-white uppercase mb-1">First Timer</p>
                                                            <p className="text-[9px] text-gray-500 leading-tight tracking-tight">Focus on conservative starts and safety.</p>
                                                        </button>
                                                        <button
                                                            onClick={() => setIsFirstTimer(false)}
                                                            className={`p-4 rounded-2xl border transition-all text-left ${!isFirstTimer ? 'bg-[#d4af37]/10 border-[#d4af37]/50 ring-1 ring-[#d4af37]/50' : 'bg-white/5 border-white/10 opacity-50'}`}
                                                        >
                                                            <p className="text-xs font-black text-white uppercase mb-1">Returning</p>
                                                            <p className="text-[9px] text-gray-500 leading-tight tracking-tight">Focus on longevity and result optimization.</p>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Button variant="outline" onClick={() => setStep('identify')} className="flex-1 border-white/10 text-gray-600 h-14 rounded-2xl">Back</Button>
                                                    <Button onClick={() => setStep('concerns')} className="flex-[2] bg-[#d4af37] text-[#0d1420] font-black h-14 rounded-2xl">Final Step</Button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 'concerns' && (
                                            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-white">What are your main concerns?</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {CONCERNS.map((c, i) => (
                                                            <button
                                                                type="button"
                                                                key={i}
                                                                onClick={() => toggleConcern(c)}
                                                                className={`text-[10px] font-black px-4 py-3.5 rounded-xl border transition-all text-left uppercase tracking-tighter ${selectedConcerns.includes(c)
                                                                    ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]'
                                                                    : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                                                    }`}
                                                            >
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Button variant="outline" onClick={() => setStep('considerations')} className="flex-1 border-white/10 text-gray-600 h-14 rounded-2xl">Back</Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="flex-[2] bg-[#d4af37] text-[#0d1420] font-black h-14 rounded-2xl shadow-xl shadow-[#d4af37]/20 uppercase tracking-widest relative overflow-hidden"
                                                    >
                                                        {loading ? 'Analyzing Data...' : (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <ChevronRight className="w-4 h-4" /> Generate My Elite Audit
                                                            </span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
