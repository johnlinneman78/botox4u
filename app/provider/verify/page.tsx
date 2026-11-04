'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { verifyClaimToken } from '@/lib/actions/claim'

function VerifyContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (token) {
            handleVerification(token)
        } else {
            setStatus('error')
            setMessage('Invalid verification link.')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const handleVerification = async (token: string) => {
        const result = await verifyClaimToken(token)
        if (!result.success) {
            setStatus('error')
            setMessage(result.message || 'Verification failed.')
            return
        }
        setStatus('success')
        // Next step is choosing a password, which signs the claimant into
        // the dashboard. Do NOT send them straight to /provider/dashboard:
        // that page needs a session and a linked provider, and a fresh
        // claimant has no password yet. That was the old break.
        setTimeout(() => {
            router.push(`/provider/set-password?token=${encodeURIComponent(result.setupToken!)}`)
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
                            Welcome, <span className="font-bold">Clinic Partner</span>. Next, choose a password for your dashboard.
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
