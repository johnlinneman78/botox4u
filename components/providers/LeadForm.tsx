'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { submitLead } from '@/lib/actions/leads'

const leadFormSchema = z.object({
    provider_id: z.string().uuid(),
    full_name: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    treatment_type: z.string().min(1, 'Please select a treatment'),
    message: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface LeadFormProps {
    providerId: string
    providerName: string
    isPremium?: boolean
}

export function LeadForm({ providerId, providerName, isPremium }: LeadFormProps) {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            provider_id: providerId,
            treatment_type: 'botox',
        },
    })

    const nextStep = async () => {
        let fieldsToValidate: (keyof LeadFormData)[] = []
        if (step === 1) fieldsToValidate = ['treatment_type']
        if (step === 2) fieldsToValidate = ['full_name', 'email', 'phone']

        const isValid = await trigger(fieldsToValidate)
        if (isValid) setStep((s) => s + 1)
    }

    const prevStep = () => setStep((s) => s - 1)

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true)
        setError(null)

        // Create FormData for the server action
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value)
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
            <Card className="border-success/30 bg-success/5">
                <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ✓
                    </div>
                    <h3 className="text-xl font-display font-bold text-primary mb-2">Request Sent!</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        {providerName} has received your request and will contact you shortly.
                    </p>
                    <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
                        Send Another Request
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-xl border-secondary/20 overflow-hidden">
            <div className="h-1 bg-gray-100 w-full">
                <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>
            {isPremium && (
                <div className="bg-secondary/10 px-4 py-2 flex items-center justify-center gap-2 border-b border-secondary/10">
                    <span className="text-secondary">💎</span>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-tight">VIP Fast-Track Request</span>
                </div>
            )}
            <CardHeader>
                <CardTitle className="text-xl">Request a Consultation</CardTitle>
                <p className="text-xs text-gray-500">Get a direct callback from {providerName}</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register('provider_id')} />

                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <label className="block text-sm font-medium text-gray-700">
                                What treatment are you interested in?
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'botox', label: 'Botox / Dysport' },
                                    { id: 'fillers', label: 'Dermal Fillers' },
                                    { id: 'lipflip', label: 'Lip Flip' },
                                    { id: 'consultation', label: 'General Consultation' },
                                ].map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${getValues('treatment_type') === option.id
                                            ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            value={option.id}
                                            {...register('treatment_type')}
                                        />
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            <Button type="button" onClick={nextStep} className="w-full py-6">
                                Next: Your Details →
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-3">
                                <div>
                                    <input
                                        {...register('full_name')}
                                        placeholder="Full Name"
                                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-secondary/20 outline-none ${errors.full_name ? 'border-error bg-error/5' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.full_name && <p className="text-[10px] text-error mt-1 ml-1">{errors.full_name.message}</p>}
                                </div>
                                <div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Email Address"
                                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-secondary/20 outline-none ${errors.email ? 'border-error bg-error/5' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.email && <p className="text-[10px] text-error mt-1 ml-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="Phone Number"
                                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-secondary/20 outline-none ${errors.phone ? 'border-error bg-error/5' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.phone && <p className="text-[10px] text-error mt-1 ml-1">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                                    Back
                                </Button>
                                <Button type="button" onClick={nextStep} className="flex-[2]">
                                    Next: Add Message
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Any specific concerns or questions? (Optional)
                            </label>
                            <textarea
                                {...register('message')}
                                placeholder="Ex: I'm interested in crow's feet and forehead lines..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm h-32 resize-none focus:ring-2 focus:ring-secondary/20 outline-none"
                            />
                            {error && <p className="text-xs text-error text-center">{error}</p>}
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                                >
                                    {isSubmitting ? 'Sending...' : 'Confirm Request'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="text-[10px] text-gray-400 text-center leading-tight mt-6">
                        By clicking &quot;Confirm Request&quot;, you agree to our Terms of Use and Privacy Policy. Your information will be sent directly to {providerName}.
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
