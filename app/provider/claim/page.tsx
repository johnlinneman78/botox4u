'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle2, PieChart, Camera, Zap, Sparkles, Building2, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { initiateClaim } from '@/lib/actions/claim'

function ClaimListingContent() {
    const searchParams = useSearchParams()
    const providerId = searchParams.get('id')

    const [provider, setProvider] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })

    const supabase = createClient()

    useEffect(() => {
        if (providerId) {
            fetchProvider(providerId)
        } else {
            setLoading(false)
        }
    }, [providerId])

    const fetchProvider = async (id: string) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('providers')
            .select('*')
            .eq('id', id)
            .single()

        if (!error && data) {
            setProvider(data)
            // Pre-fill some data if available
            setFormData(prev => ({
                ...prev,
                email: data.email || ''
            }))
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const result = await initiateClaim({
                providerId: providerId!,
                email: formData.email,
                name: formData.name
            })

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.message || 'Verification failed. Please try again.')
            }
        } catch (err) {
            setError('An unexpected error occurred.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        )
    }

    if (!provider && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-primary">Provider Not Found</h2>
                    <p className="text-gray-600 mb-6">Please start your claim from the provider profile page.</p>
                    <Link href="/">
                        <Button variant="primary" className="w-full">Back to Search</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-primary mb-4">Verification Email Sent!</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We&apos;ve sent a secure link to <span className="font-bold text-primary">{formData.email}</span>.
                        Please click the link to verify your identity and access your dashboard.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-left mb-8">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> What&apos;s Next?
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• Upload patient results for <strong>Photo Priority Logic</strong>.</li>
                            <li>• Review and respond to your <strong>Warm Leads</strong>.</li>
                            <li>• Complete your profile for a <strong>Score Grade Boost</strong>.</li>
                        </ul>
                    </div>
                    <p className="text-sm text-gray-400">
                        Didn&apos;t receive it? Check your spam folder or <button className="underline hover:text-secondary">resend now</button>.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">
                {/* Left Side: Value Proposition */}
                <div className="w-full lg:w-1/2 p-8 lg:p-20 bg-primary text-white flex flex-col justify-center">
                    <div className="mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-secondary font-bold tracking-tighter text-2xl mb-12">
                            <Sparkles className="fill-secondary" /> BOTOX-4U <span className="text-white/30 font-light">| CLINIC PORTAL</span>
                        </Link>
                        <Badge className="bg-secondary/20 text-secondary border-none mb-4 px-3 py-1 text-xs uppercase font-bold">Claim Your Listing</Badge>
                        <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6">
                            Convert 3-5x More Leads with Verified Photos.
                        </h1>
                        <p className="text-xl text-white/70 mb-12 max-w-lg">
                            Take control of your {provider.name} profile and unlock advanced ranking tools.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Camera className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Photo Priority Logic</h4>
                                    <p className="text-white/60">Verified patient results boost your ranking by up to 40% over generic listings.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Warm Lead Tracking</h4>
                                    <p className="text-white/60">Real-time alerts when high-intent patients view your specific treatments.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <PieChart className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Detailed Analytics</h4>
                                    <p className="text-white/60">Compare your pricing and sentiment scores against local competitors.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-display font-bold text-primary mb-2">Identify Yourself</h2>
                        <p className="text-gray-500 mb-10">We verify all claims to ensure directory accuracy.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Professional Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Dr. Sarah Johnson"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-colors"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Clinic Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@clinic.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-colors"
                                        value={formData.email}
                                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Personal emails (Gmail, etc.) may require additional verification.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="tel"
                                        placeholder="(555) 000-0000"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-colors"
                                        value={formData.phone}
                                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-secondary/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                {submitting ? 'Initiating Claim...' : 'VERIFY OWNERSHIP'}
                                <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                            </Button>

                            <p className="text-center text-xs text-gray-400 px-8">
                                By continuing, you agree to our Terms of Service and data verification standards.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ClaimListingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <ClaimListingContent />
        </Suspense>
    )
}
