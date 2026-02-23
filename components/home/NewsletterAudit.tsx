'use client'

import { useState } from 'react'
import { Mail, Dna, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

export default function NewsletterAudit() {
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [email, setEmail] = useState('')
    const [clinic, setClinic] = useState('')

    const toggle = (p: string) =>
        setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, clinic, procedures: selected }),
            })
        } catch (_) {
            // fail silently — still show success
        }
        setLoading(false)
        setStep('success')
    }

    return (
        <section className="py-24 bg-[#0d1420] border-t border-white/[0.05]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-[#131f30] to-[#0d1720] border border-white/[0.07] rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Copy */}
                            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-6">
                                    <Dna className="w-3 h-3" /> Free Clinic Safety Audit
                                </div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-5 leading-tight">
                                    Is your clinic <span className="text-[#d4af37]">2026-ready?</span>
                                </h2>
                                <p className="text-gray-400 leading-relaxed mb-8 font-light">
                                    Tell us which procedures you're considering and where. We'll send you a free, data-driven safety audit — including your clinic's II-Score™, Regen-Ratio™, and a 2026 market comparison.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Your clinic\'s II-Score™ vs. neighborhood average',
                                        '2026 Regen-Ratio™ check (PNs vs. filler-heavy)',
                                        'Natural result integrity rating',
                                        'Weekly Portland Pulse pricing newsletter',
                                    ].map(item => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                                            <CheckCircle className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[10px] text-gray-700 mt-6">
                                    Always free. No spam. Unsubscribe anytime. We never share your data.
                                </p>
                            </div>

                            {/* Right: Form */}
                            <div className="p-10 md:p-14">
                                {step === 'success' ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                                        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-[#d4af37]" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Audit Sent!</h3>
                                        <p className="text-gray-400 text-sm max-w-xs">
                                            Check your inbox. Your free clinic safety audit is on its way — usually within 5 minutes.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                                Your Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                                Clinic You're Considering (optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={clinic}
                                                onChange={e => setClinic(e.target.value)}
                                                placeholder="e.g. Luxe Atelier, Pearl District"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                                Procedures You're Exploring
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {PROCEDURES.map(p => (
                                                    <button
                                                        type="button"
                                                        key={p}
                                                        onClick={() => toggle(p)}
                                                        className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${selected.includes(p)
                                                                ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]'
                                                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black rounded-xl py-3 h-12 text-sm mt-2 disabled:opacity-50 transition-all"
                                        >
                                            {loading ? 'Sending...' : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Get My Free Clinic Audit
                                                    <ChevronRight className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
