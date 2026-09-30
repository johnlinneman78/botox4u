'use client'

import { useState } from 'react'
import { formatScore } from '@/lib/scoring'
import { Mail, Dna, ChevronRight, CheckCircle, Search, User, UserCheck, ShieldAlert, Sparkles, Building2, ShieldCheck } from 'lucide-react'
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
    const [error, setError] = useState<string | null>(null)
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
                setError(result.error || 'Unknown error')
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
                    status: (foundProvider.score_total ?? 0) >= 55 ? 'PASS' : 'PENDING',
                    score: foundProvider.score_total ?? null,
                    isReal: true
                })
            } else {
                setAuditResult({
                    clinicName: clinic || 'Regional Analysis',
                    status: 'PENDING',
                    score: null, // not in our data yet
                    isReal: false
                })
            }

            setStep('success')
            // Scroll to top of section for visibility
            document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch (err) {
            console.error('Audit submission failed:', err)
            setError('A network error occurred. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#3D2B1F]/10" id="newsletter">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-[#131f30] to-[#0d1720] border border-white/[0.07] rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Copy */}
                            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-[#3D2B1F]/10 bg-white/[0.01]">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                                    <ShieldCheck className="w-3 h-3" /> Clarity Score™ Match & Clinic Audit
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6 leading-tight">
                                    Is Your Injector <span className="text-[#C9A96E]">Clarity Score™ Certified?</span>
                                </h2>
                                <p className="text-[#3D2B1F]/70 leading-relaxed mb-10 font-light text-lg">
                                    Don't rely on unverified reviews. Tell us which clinics you're researching, and we'll cross-reference them with our independent Clarity Score™ dataset for injection quality and pricing.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: ShieldAlert, title: 'Credential Verification', text: 'Independent NPI & Licensing check for your considered clinicians.' },
                                        { icon: UserCheck, title: 'Precision Matching', text: 'Custom advice based on your aesthetic goals and treatment history.' },
                                        { icon: Sparkles, title: 'Price Transparency', text: 'Compare your target clinic\'s rates against local market averages.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className="w-10 h-10 rounded-xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 flex items-center justify-center text-[#C9A96E] group-hover:bg-[#C9A96E]/10 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-[#3D2B1F] font-bold text-sm mb-1">{item.title}</h4>
                                                <p className="text-xs text-[#3D2B1F]/60 font-light">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-10 border-t border-[#3D2B1F]/10">
                                    <p className="text-[11px] text-[#3D2B1F]/50 font-medium uppercase tracking-widest">
                                        ESTIMATED ADVICE DELIVERY: <span className="text-[#8A9E8D] underline underline-offset-4">&lt; 2 MINUTES</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right: Multi-step Form */}
                            <div className="p-10 md:p-14 flex flex-col justify-center min-h-[500px]">
                                {step === 'success' ? (
                                    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
                                        <div className="bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 rounded-2xl p-6 mb-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#8A9E8D]/20 flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-6 h-6 text-[#8A9E8D]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">Audit Profile Generated</h3>
                                            <p className="text-xs text-[#3D2B1F]/70">We are processing your request for <strong>{auditResult?.clinicName}</strong>.</p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="p-5 rounded-2xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-[#C9A96E]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-[#3D2B1F]/50 font-black uppercase tracking-widest">Clinic Status</p>
                                                        <p className="text-sm font-bold text-[#3D2B1F] uppercase">{auditResult?.clinicName}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border ${auditResult?.status === 'PASS' ? 'bg-[#8A9E8D]/20 border-[#8A9E8D]/30 text-[#8A9E8D]' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'}`}>
                                                    {auditResult?.status}
                                                </div>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10">
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-[10px] text-[#3D2B1F]/50 font-black uppercase tracking-widest">Clarity Score™</p>
                                                    <p className={`text-xs font-black ${(auditResult?.score ?? 0) >= 70 ? 'text-[#8A9E8D]' : 'text-[#C9A96E]'}`}>
                                                        {formatScore(auditResult?.score)}
                                                    </p>
                                                </div>
                                                <div className="h-1.5 w-full bg-[#3D2B1F]/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#C9A96E] to-[#8A9E8D] transition-all duration-1000"
                                                        style={{ width: `${auditResult?.score ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[#3D2B1F]/70 text-center leading-relaxed">
                                            Thanks. We&apos;ll email what we have on this clinic to <span className="text-[#3D2B1F] font-bold">{email}</span>.
                                        </p>

                                        <Button
                                            onClick={() => {
                                                setStep('identify')
                                                setEmail('')
                                                setFullName('')
                                                setClinic('')
                                                setIsFirstTimer(true)
                                                setSelectedProcedures([])
                                                setSelectedConcerns([])
                                                setAuditResult(null)
                                                setError(null)
                                            }}
                                            className="mt-8 bg-[#3D2B1F]/5 hover:bg-[#3D2B1F]/10 text-[#3D2B1F]/70 font-bold py-3 rounded-xl border border-[#3D2B1F]/10"
                                        >
                                            Run Another Audit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Step Progress */}
                                        <div className="flex gap-2 mb-4">
                                            {(['identify', 'considerations', 'concerns'] as Step[]).map((s, i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${(['identify', 'considerations', 'concerns'] as Step[]).indexOf(step) >= i ? 'bg-[#C9A96E]' : 'bg-[#3D2B1F]/5'
                                                    }`} />
                                            ))}
                                        </div>

                                        {step === 'identify' && (
                                            <form className="space-y-6 animate-in slide-in-from-right-4 duration-300" onSubmit={(e) => { e.preventDefault(); setStep('considerations'); }}>
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-[#3D2B1F]">Let's start with the basics.</h3>
                                                    <div>
                                                        <label className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-[0.2em] mb-2 block">Your Identification</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                            <input
                                                                type="email"
                                                                required
                                                                value={email}
                                                                onChange={e => setEmail(e.target.value)}
                                                                placeholder="Email for Audit Delivery"
                                                                className="w-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl pl-12 pr-4 py-4 text-[#3D2B1F] focus:outline-none focus:border-[#C9A96E]/40"
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
                                                            className="w-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl pl-12 pr-4 py-4 text-[#3D2B1F] focus:outline-none focus:border-[#C9A96E]/40"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-[0.2em] mb-2 block">Interested Treatments</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {PROCEDURES.map(p => (
                                                            <button
                                                                type="button"
                                                                key={p}
                                                                onClick={() => toggleProcedure(p)}
                                                                className={`text-[10px] font-black px-4 py-3.5 rounded-xl border transition-all uppercase tracking-widest ${selectedProcedures.includes(p)
                                                                    ? 'bg-[#C9A96E]/20 border-[#C9A96E]/50 text-[#C9A96E]'
                                                                    : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 text-[#3D2B1F]/60 hover:border-white/20'
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
                                                    className="w-full bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black h-14 rounded-2xl shadow-xl shadow-[#C9A96E]/10 disabled:opacity-30"
                                                >
                                                    Continue to Clinic Research
                                                </Button>
                                            </form>
                                        )}

                                        {step === 'considerations' && (
                                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-[#3D2B1F]">Who are you looking at?</h3>
                                                    <div>
                                                        <label className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-[0.2em] mb-2 block">Considered Clinics/Injectors</label>
                                                        <div className="relative">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                            <input
                                                                type="text"
                                                                value={clinic}
                                                                onChange={e => setClinic(e.target.value)}
                                                                placeholder="Search or enter clinic names..."
                                                                className="w-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl pl-12 pr-4 py-4 text-[#3D2B1F] focus:outline-none focus:border-[#C9A96E]/40"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-[#3D2B1F]/50 mt-2 italic px-1">We'll perform a real-time Audit on these identifiers.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-[0.2em] mb-2 block">Patient Experience</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => setIsFirstTimer(true)}
                                                            className={`p-4 rounded-2xl border transition-all text-left ${isFirstTimer ? 'bg-[#C9A96E]/10 border-[#C9A96E]/50 ring-1 ring-[#C9A96E]/50' : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 opacity-50'}`}
                                                        >
                                                            <p className="text-xs font-black text-[#3D2B1F] uppercase mb-1">First Timer</p>
                                                            <p className="text-[9px] text-[#3D2B1F]/60 leading-tight tracking-tight">Focus on conservative starts and safety.</p>
                                                        </button>
                                                        <button
                                                            onClick={() => setIsFirstTimer(false)}
                                                            className={`p-4 rounded-2xl border transition-all text-left ${!isFirstTimer ? 'bg-[#C9A96E]/10 border-[#C9A96E]/50 ring-1 ring-[#C9A96E]/50' : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 opacity-50'}`}
                                                        >
                                                            <p className="text-xs font-black text-[#3D2B1F] uppercase mb-1">Returning</p>
                                                            <p className="text-[9px] text-[#3D2B1F]/60 leading-tight tracking-tight">Focus on longevity and result optimization.</p>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Button variant="outline" onClick={() => setStep('identify')} className="flex-1 border-[#3D2B1F]/10 text-[#3D2B1F]/50 h-14 rounded-2xl">Back</Button>
                                                    <Button onClick={() => setStep('concerns')} className="flex-[2] bg-[#C9A96E] text-white font-black h-14 rounded-2xl">Final Step</Button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 'concerns' && (
                                            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-bold text-[#3D2B1F]">What are your main concerns?</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {CONCERNS.map((c, i) => (
                                                            <button
                                                                type="button"
                                                                key={i}
                                                                onClick={() => toggleConcern(c)}
                                                                className={`text-[10px] font-black px-4 py-3.5 rounded-xl border transition-all text-left uppercase tracking-tighter ${selectedConcerns.includes(c)
                                                                    ? 'bg-[#C9A96E]/20 border-[#C9A96E]/50 text-[#C9A96E]'
                                                                    : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 text-[#3D2B1F]/60 hover:border-white/20'
                                                                    }`}
                                                            >
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs text-center mb-4">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="flex gap-4">
                                                    <Button variant="outline" onClick={() => setStep('considerations')} className="flex-1 border-[#3D2B1F]/10 text-[#3D2B1F]/50 h-14 rounded-2xl">Back</Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="flex-[2] bg-[#C9A96E] text-white font-black h-14 rounded-2xl shadow-xl shadow-[#C9A96E]/20 uppercase tracking-widest relative overflow-hidden"
                                                    >
                                                        {loading ? 'Analyzing Data...' : (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <ChevronRight className="w-4 h-4" /> Run Clarity Score™ Audit
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
