'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Suspense } from 'react'

function VerifyContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()
    const supabase = createClient()

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (token) {
            handleVerification(token)
        } else {
            setStatus('error')
            setMessage('Invalid verification link.')
        }
    }, [token])

    const handleVerification = async (token: string) => {
        // 1. Find the account with this token
        const { data: account, error: fetchError } = await supabase
            .from('provider_accounts')
            .select('*, providers(name)')
            .eq('verification_token', token)
            .single()

        if (fetchError || !account) {
            setStatus('error')
            setMessage('Invalid or expired verification link.')
            return
        }

        // 2. Mark account as verified and provider as claimed
        const { error: updateAccountError } = await supabase
            .from('provider_accounts')
            .update({
                verified: true,
                verification_token: null,
                last_login: new Date().toISOString()
            })
            .eq('id', account.id)

        const { error: updateProviderError } = await supabase
            .from('providers')
            .update({
                claimed: true,
                crm_status: 'verified' // Step 10: Engaged -> Verified
            })
            .eq('id', account.provider_id)

        if (updateAccountError || updateProviderError) {
            setStatus('error')
            setMessage('Failed to finalise verification. Please contact support.')
            return
        }

        setStatus('success')

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
            router.push(`/provider/dashboard?id=${account.provider_id}`)
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary mx-auto"></div>
                        <h1 className="text-2xl font-display font-bold text-primary">Verifying Your Credentials...</h1>
                        <p className="text-[#3D2B1F]/60 text-sm">Securing your clinic dashboard access.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-primary">Access Verified!</h1>
                        <p className="text-xl text-[#3D2B1F]/50">
                            Welcome, <span className="font-bold">Clinic Partner</span>. We&apos;re preparing your dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest mt-8">
                            <Sparkles className="w-4 h-4 fill-secondary animate-pulse" /> Redirecting in 3 seconds...
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <Badge variant="outline" className="text-red-500 border-red-500">Error</Badge>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-primary">Verification Failed</h1>
                        <p className="text-[#3D2B1F]/50">{message}</p>
                        <button
                            onClick={() => window.location.href = '/provider/claim'}
                            className="bg-primary text-[#3D2B1F] px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    )
}
