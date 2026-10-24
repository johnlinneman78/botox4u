'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/utils'
import { recordSignupClaim, createSignupProvider } from '@/lib/actions/provider-actions'

function ProviderSignupContent() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [clinicName, setClinicName] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const searchParams = useSearchParams()
    const plan = searchParams.get('plan') || 'free'
    const existingProviderId = searchParams.get('id')

    const supabase = createClientComponentClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            })

            if (authError) throw authError

            // if no user is returned, it likely means email confirmation is required and we need to wait
            // but for a seamless experience in dev/beta, or if auto confirm is on:
            if (authData?.user) {

                // The account has no session yet (email unconfirmed), so
                // the claim/listing write cannot run through this
                // browser client: row-level security matches zero rows
                // and the write fails silently. Both writes go through
                // server actions with checked results instead, and a
                // failed write surfaces as an error here, never as a
                // silent trip to the dashboard (which bounces a
                // sessionless user to the login page anyway).
                if (existingProviderId) {
                    // Claim existing. The plan in the URL is never granted
                    // here: paid tiers are set only by the Stripe webhook
                    // after payment. A claim starts on the free tier and
                    // lands in manual review, not claimed outright.
                    const result = await recordSignupClaim(existingProviderId, email, authData.user.id)
                    if (!result.success) {
                        throw new Error('Your account was created, but we could not record your claim. Sign in after confirming your email and try claiming again, or contact support.')
                    }
                } else {
                    // Create new provider (free tier; paid tiers come from
                    // the Stripe webhook after payment, never from signup)
                    const result = await createSignupProvider({
                        userId: authData.user.id,
                        clinicName,
                        city,
                        state,
                        slug: slugify(clinicName)
                    })
                    if (!result.success) {
                        throw new Error('Your account was created, but we could not save your clinic listing. Sign in after confirming your email and try again, or contact support.')
                    }
                }

                setSubmitted(true)
            } else {
                setError('Registration successful. Please check your email to verify your account before logging in.')
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="flex justify-center mb-6">
                    <Logo className="h-12 w-auto" />
                </div>
                <h2 className="text-center text-3xl font-display font-bold text-[#3D2B1F]">
                    {existingProviderId ? 'Create Account to Claim Profile' : 'Create Your Provider Account'}
                </h2>
                <p className="mt-2 text-center text-sm text-[#3D2B1F]/60">
                    Get started with VerifiedAesthetics and {existingProviderId ? 'claim your listing' : 'add your clinic'}.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl shadow-[#3D2B1F]/5 sm:rounded-[2rem] sm:px-10 border border-[#3D2B1F]/10">
                    {submitted ? (
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-display font-bold text-[#3D2B1F]">
                                {existingProviderId ? 'Account Created — Claim In Review' : 'Account Created — Listing Saved'}
                            </h3>
                            <p className="text-sm text-[#3D2B1F]/70">
                                {existingProviderId
                                    ? 'Your claim has been recorded and is in review. Nothing is marked claimed or verified until the review is complete, and the decision is sent by email.'
                                    : 'Your clinic listing has been saved on the free tier. It is not marked verified; verification is a separate review.'}
                            </p>
                            <p className="text-sm text-[#3D2B1F]/70">
                                Check your email to confirm your account, then sign in to reach your dashboard.
                            </p>
                            <Link href="/provider/login" className="inline-block text-sm font-semibold text-[#C9A96E] hover:text-[#B5955B]">
                                Go to sign in →
                            </Link>
                        </div>
                    ) : (
                    <>
                    <form onSubmit={handleSignup} className="space-y-6">

                        {error && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-600 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                    placeholder="Dr. Jane Doe"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                    placeholder="doctor@clinic.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {!existingProviderId && (
                                <>
                                    <div className="md:col-span-2 border-t border-[#3D2B1F]/10 pt-6 mt-2">
                                        <h3 className="text-sm font-bold text-[#3D2B1F] mb-4">Clinic Information</h3>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">Clinic Name</label>
                                        <input
                                            type="text"
                                            required={!existingProviderId}
                                            value={clinicName}
                                            onChange={(e) => setClinicName(e.target.value)}
                                            className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                            placeholder="Beverly Hills Aesthetics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">City</label>
                                        <input
                                            type="text"
                                            required={!existingProviderId}
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                            placeholder="Los Angeles"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/70 mb-1">State (2 Letter Code)</label>
                                        <input
                                            type="text"
                                            required={!existingProviderId}
                                            maxLength={2}
                                            value={state}
                                            onChange={(e) => setState(e.target.value.toUpperCase())}
                                            className="block w-full px-4 py-3 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-all"
                                            placeholder="CA"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-6 border border-transparent rounded-xl shadow-lg shadow-[#C9A96E]/20 text-sm font-black tracking-widest uppercase text-white bg-[#C9A96E] hover:bg-[#B5955B] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : existingProviderId ? 'Create Account & Claim' : 'Create Account & Add Clinic'}
                        </Button>
                    </form>
                    </>
                    )}

                    <div className="mt-8 text-center border-t border-[#3D2B1F]/10 pt-6">
                        <Link href="/provider/login" className="text-sm font-semibold text-[#C9A96E] hover:text-[#B5955B]">
                            Already have an account? Sign in →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProviderSignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading...</div>}>
            <ProviderSignupContent />
        </Suspense>
    )
}
