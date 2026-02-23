'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { submitLead } from '@/lib/actions/leads'
import { NICHE } from '@/config/niche'

const leadFormSchema = z.object({
    provider_id: z.string().uuid().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    full_name: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    treatment_type: z.string().min(1, 'Please select a treatment'),
    budget_range: z.string().min(1, 'Please select your budget'),
    timeframe: z.string().min(1, 'Please select a timeframe'),
    call_time: z.string().optional(),
    message: z.string().optional(),
    newsletter_opt_in: z.boolean().optional(),
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface LeadFormProps {
    providerId?: string
    providerName?: string
    city?: string
    state?: string
    isPremium?: boolean
}

export function LeadForm({ providerId, providerName, city, state, isPremium }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            provider_id: providerId,
            city: city,
            state: state,
            treatment_type: NICHE.treatments[0].toLowerCase().replace(/\s+/g, '-'),
            budget_range: `${NICHE.priceRange.min * 20}-${NICHE.priceRange.max * 20}`,
            timeframe: 'asap',
            call_time: 'morning',
        },
    })

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString())
            }
        })

        const result = await submitLead(formData)

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
        } else {
            setError(result.error || 'Something went wrong')
        }
    }

    if (isSuccess) {
        return (
            <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-inner">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg animate-bounce">
                        ✓
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">Request Sent!</h3>
                    <p className="text-gray-500 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
                        Thanks! We&apos;ll connect you with {providerName ? <strong className="text-white">{providerName}</strong> : `top providers in ${city}`} who match your needs within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => setIsSuccess(false)} className="px-8 border-white/10 text-gray-400 hover:bg-white/5">
                        Done
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-2xl border-white/[0.06] bg-[#101827] overflow-hidden">
            {isPremium && (
                <div className="bg-[#d4af37]/10 px-4 py-2.5 flex items-center justify-center gap-2 border-b border-[#d4af37]/20">
                    <span className="text-[#d4af37] animate-pulse">💎</span>
                    <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">VIP Priority Callback</span>
                </div>
            )}
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-display text-white">
                    {providerName ? `Connect with ${providerName}` : `Find ${city} Specialists`}
                </CardTitle>
                <p className="text-xs text-gray-600">
                    {providerName ? 'Independent data: response time typically < 2 hours' : 'Recieve 3 direct responses today'}
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register('provider_id')} />
                    <input type="hidden" {...register('city')} />
                    <input type="hidden" {...register('state')} />

                    <div className="grid grid-cols-1 gap-3">
                        {/* Name */}
                        <div>
                            <input
                                {...register('full_name')}
                                placeholder="Full Name"
                                className={`w-full px-4 py-3 rounded-lg border text-sm text-white transition-all focus:ring-2 focus:ring-[#d4af37]/20 outline-none ${errors.full_name ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.06] bg-white/[0.03]'}`}
                            />
                            {errors.full_name && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.full_name.message}</p>}
                        </div>

                        {/* Contact Group */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Email Address"
                                    className={`w-full px-4 py-3 rounded-lg border text-sm text-white transition-all focus:ring-2 focus:ring-[#d4af37]/20 outline-none ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.06] bg-white/[0.03]'}`}
                                />
                                {errors.email && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="Phone Number"
                                    className={`w-full px-4 py-3 rounded-lg border text-sm text-white transition-all focus:ring-2 focus:ring-[#d4af37]/20 outline-none ${errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.06] bg-white/[0.03]'}`}
                                />
                                {errors.phone && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-[11px] font-semibold text-gray-600 ml-1 uppercase tracking-tight">Interest</label>
                            <select
                                {...register('treatment_type')}
                                className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white focus:ring-2 focus:ring-[#d4af37]/20 outline-none appearance-none"
                            >
                                {NICHE.treatments.map((treatment) => (
                                    <option key={treatment} value={treatment.toLowerCase().replace(/\s+/g, '-')}>
                                        {treatment}
                                    </option>
                                ))}
                                <option value="other">Other / General Question</option>
                            </select>
                        </div>

                        {/* Budget & Timeframe */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-[11px] font-semibold text-gray-600 ml-1 uppercase tracking-tight">Budget</label>
                                <select
                                    {...register('budget_range')}
                                    className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white focus:ring-2 focus:ring-[#d4af37]/20 outline-none appearance-none"
                                >
                                    {NICHE.leadForm.budgetRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-[11px] font-semibold text-gray-600 ml-1 uppercase tracking-tight">Timeframe</label>
                                <select
                                    {...register('timeframe')}
                                    className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white focus:ring-2 focus:ring-[#d4af37]/20 outline-none appearance-none"
                                >
                                    <option value="asap">ASAP</option>
                                    <option value="this-week">This Week</option>
                                    <option value="this-month">This Month</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                        </div>

                        {/* Call Time */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-[11px] font-semibold text-gray-600 ml-1 uppercase tracking-tight">Best Time to Call</label>
                            <select
                                {...register('call_time')}
                                className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white focus:ring-2 focus:ring-[#d4af37]/20 outline-none appearance-none"
                            >
                                <option value="morning">Morning (8am - 12pm)</option>
                                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                                <option value="evening">Evening (4pm - 8pm)</option>
                                <option value="anytime">Anytime</option>
                            </select>
                        </div>

                        {/* Newsletter Opt-in */}
                        <div className="flex items-start gap-3 px-1 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    {...register('newsletter_opt_in')}
                                    type="checkbox"
                                    className="w-4 h-4 text-[#d4af37] border-white/10 rounded focus:ring-[#d4af37]/20 bg-white/5 accent-[#d4af37]"
                                />
                            </div>
                            <label className="text-[11px] text-gray-500 leading-tight">
                                Send me exclusive {NICHE.name} deals, pricing updates, and clinic specials in my area.
                                <span className="text-gray-700"> No spam, unsubscribe anytime.</span>
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-xs text-red-400 text-center font-medium">{error}</p>}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-7 bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] shadow-xl shadow-[#d4af37]/10 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {isSubmitting ? 'Sending Request...' : 'Request Info from Clinic'}
                    </Button>

                    <p className="text-[10px] text-gray-700 text-center leading-tight mt-4 italic">
                        Your contact info is sent directly to {providerName || 'local specialists'}. No spam, ever.
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
