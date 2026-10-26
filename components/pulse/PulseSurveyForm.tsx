'use client'

import { useState } from 'react'
import { MapPin, DollarSign, Stethoscope, Heart, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Pulse survey, rebuilt: the old form had no submit handler, no state,
// and no backend, so a submit just reloaded the page and cleared the
// fields. This form validates, saves to pulse_submissions via
// /api/pulse-submissions, and only shows a confirmation after the
// server confirms the save. A failed save shows an error, never a
// fake confirmation.
export default function PulseSurveyForm() {
    const [cityState, setCityState] = useState('')
    const [perUnit, setPerUnit] = useState('')
    const [clinic, setClinic] = useState('')
    const [satisfaction, setSatisfaction] = useState<number | null>(null)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!cityState.trim()) {
            setError('Please enter your city and state.')
            setStatus('error')
            return
        }
        const price = Number(perUnit)
        if (!perUnit || Number.isNaN(price) || price <= 0 || price > 1000) {
            setError('Please enter what you paid per unit, between $1 and $1,000.')
            setStatus('error')
            return
        }
        setStatus('loading')
        try {
            const res = await fetch('/api/pulse-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cityState: cityState.trim(),
                    perUnitPrice: price,
                    clinicName: clinic.trim() || null,
                    satisfaction,
                }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || 'Save failed')
            }
            setStatus('success')
        } catch {
            setStatus('error')
            setError('Something went wrong saving your data. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="text-center py-10">
                <p className="text-2xl font-bold text-[#3D2B1F] mb-4">Thanks, your data is saved.</p>
                <p className="text-[#3D2B1F]/60 font-light leading-relaxed">
                    Your report is saved for the pricing index. It is collected, not published
                    on its own, and your personal information is never shared with clinics.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A96E]" />
                    Where was your treatment?
                </label>
                <input
                    type="text"
                    placeholder="City, State"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full h-16 px-6 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/10 text-lg text-[#3D2B1F] transition-all placeholder:text-[#3D2B1F]/50"
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#C9A96E]" />
                    What did you pay per unit?
                </label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D2B1F]/70 text-lg">$</span>
                    <input
                        type="number"
                        placeholder="e.g. 14"
                        value={perUnit}
                        onChange={(e) => setPerUnit(e.target.value)}
                        className="w-full h-16 pl-10 pr-6 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/10 text-lg text-[#3D2B1F] transition-all placeholder:text-[#3D2B1F]/50"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-widest flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#C9A96E]" />
                    Who was your injector?
                </label>
                <input
                    type="text"
                    placeholder="Clinic or Provider Name"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    className="w-full h-16 px-6 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/10 text-lg text-[#3D2B1F] transition-all placeholder:text-[#3D2B1F]/50"
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-widest flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#C9A96E]" />
                    How satisfied were you?
                </label>
                <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            type="button"
                            aria-label={`${s} star${s > 1 ? 's' : ''}`}
                            onClick={() => setSatisfaction(s)}
                            className={`flex-1 h-14 border rounded-xl flex items-center justify-center transition-all group ${satisfaction === s ? 'bg-[#C9A96E]/20 border-[#C9A96E] text-[#C9A96E]' : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 hover:border-[#C9A96E] hover:text-[#C9A96E] text-[#3D2B1F]/60'}`}
                        >
                            <Star className={`w-5 h-5 ${satisfaction === s ? 'fill-[#C9A96E]' : 'group-hover:fill-[#C9A96E]'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {status === 'error' && error && (
                <p className="text-center text-sm text-red-700">{error}</p>
            )}

            <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-18 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-bold text-xl py-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
                {status === 'loading' ? 'Saving…' : 'Submit Local Data'}
                <ArrowRight className="w-6 h-6" />
            </Button>

            <p className="text-[10px] text-[#3D2B1F]/70 text-center font-light leading-relaxed px-8">
                Your specific pricing data will be anonymized and aggregated into our city indexes. We will never share your personal information with clinics.
            </p>
        </form>
    )
}
