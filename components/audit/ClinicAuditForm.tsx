'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, Loader2, Search, ArrowRight, ShieldCheck } from 'lucide-react'
import { submitAuditRequest } from '@/lib/actions/audit'

const auditSchema = z.object({
    email: z.string().email('Invalid email address'),
    providerName: z.string().min(2, 'Clinic name is required'),
    providerId: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    treatmentTypes: z.array(z.string()).min(1, 'Select at least one treatment'),
    primaryGoal: z.string().min(1, 'Please select a goal'),
    priceQuoted: z.string().optional(),
    foundThrough: z.string().optional()
})

type AuditFormData = z.infer<typeof auditSchema>

const TREATMENTS = [
    'Botox/Dysport/Xeomin',
    'Daxxify',
    'Polynucleotides (Rejuran/Plinest)',
    'Sculptra/Radiesse',
    'HA Fillers (Restylane/Juvederm)',
    'Exosomes',
    'PRF/PRP',
    'Other'
]

const GOALS = [
    'Natural, subtle enhancement',
    'Visible transformation',
    'Anti-aging/prevention',
    'Skin quality improvement'
]

const CITIES = [
    'Scottsdale', 'New York', 'Los Angeles', 'Miami', 'Chicago', 'Austin', 'Dallas', 'Houston',
    'San Diego', 'San Francisco', 'Beverly Hills', 'Newport Beach', 'Palm Beach', 'Nashville',
    'Atlanta', 'Seattle', 'Denver', 'Phoenix', 'Boston', 'Charlotte', 'Las Vegas', 'Charleston'
]

export default function ClinicAuditForm() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<AuditFormData>({
        resolver: zodResolver(auditSchema),
        defaultValues: {
            treatmentTypes: [],
            priceQuoted: '',
            foundThrough: 'Google Search'
        }
    })

    const selectedTreatments = watch('treatmentTypes')
    const email = watch('email')
    const providerName = watch('providerName')

    const onSubmit = async (data: AuditFormData) => {
        setIsSubmitting(true)
        setError(null)
        try {
            const result = await submitAuditRequest(data)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setError(result.error || 'Something went wrong')
            }
        } catch (err) {
            setError('Failed to submit. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-[#0d1420] border border-[#d4af37]/30 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-[#d4af37] w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Audit Report Generated</h2>
                <p className="text-gray-400 mb-6">
                    Your personalized clinic audit for <strong>{providerName}</strong> has been sent to <strong>{email}</strong>.
                    Check your inbox (and spam folder) for the PDF report.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-[#d4af37] text-[#0d1420] px-8 py-3 rounded-full font-bold hover:bg-[#c4a130] transition-colors"
                >
                    New Audit Request
                </button>
            </div>
        )
    }

    return (
        <div className="bg-[#0d1420] border border-white/5 rounded-2xl p-6 md:p-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[100px] -z-10" />

            <div className="flex items-center gap-2 mb-8 text-[#d4af37]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Clinic Safety Audit v2.0</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Audit Your Clinic</h1>
                            <p className="text-gray-400">Enter details to see how they rank against 2026 InjectorIndex benchmarks.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Patient Email (Required)</label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Clinic/Provider Name</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        {...register('providerName')}
                                        placeholder="Search clinic or enter name..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                    />
                                </div>
                                {errors.providerName && <p className="text-red-500 text-xs mt-1">{errors.providerName.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                                    <select
                                        {...register('city')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                    >
                                        <option value="">Select city</option>
                                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                                    <input
                                        {...register('state')}
                                        placeholder="e.g. AZ"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full bg-[#d4af37] text-[#0d1420] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c4a130] transition-colors"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Treatment Details</h2>
                            <p className="text-gray-400">What are you considering at this clinic?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {TREATMENTS.map(t => (
                                <label
                                    key={t}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedTreatments.includes(t)
                                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={t}
                                        className="hidden"
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (e.target.checked) setValue('treatmentTypes', [...selectedTreatments, val])
                                            else setValue('treatmentTypes', selectedTreatments.filter(x => x !== val))
                                        }}
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedTreatments.includes(t) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600'
                                        }`}>
                                        {selectedTreatments.includes(t) && <Check className="w-3 h-3 text-[#0d1420]" />}
                                    </div>
                                    <span className="text-sm">{t}</span>
                                </label>
                            ))}
                        </div>

                        <div className="pt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-4">Primary Aesthetic Goal</label>
                            <div className="space-y-3">
                                {GOALS.map(g => (
                                    <label
                                        key={g}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            {...register('primaryGoal')}
                                            type="radio"
                                            value={g}
                                            className="w-4 h-4 border-white/10 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]"
                                        />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/5 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="flex-[2] bg-[#d4af37] text-[#0d1420] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c4a130] transition-colors"
                            >
                                Calibration <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Final Calibration</h2>
                            <p className="text-gray-400">Optional benchmarks to refine your price integrity report.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Price Quoted (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        {...register('priceQuoted')}
                                        placeholder="e.g. 600 for 40 units"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">How did you find this clinic?</label>
                                <select
                                    {...register('foundThrough')}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                                >
                                    <option value="Google Search">Google Search</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Friend/Family">Friend/Family</option>
                                    <option value="Doctor Referral">Doctor Referral</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/5 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] bg-[#d4af37] text-[#0d1420] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c4a130] transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : 'Generate Audit Report'}
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-500">
                            Independent data powered by InjectorIndex clinical benchmarks.
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}
