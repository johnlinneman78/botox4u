'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/layout/Logo'
import { createClient } from '@/lib/supabase/client'
import { setClaimPassword } from '@/lib/actions/claim'

// One-time password setup for a token-verified claim (claim flow C).
// The claimant arrives here from /provider/verify with the same
// verification token, which is single-use: setClaimPassword clears it
// once the password is set. After that, the claimant signs in with
// their own password and lands on /provider/dashboard.
function SetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token') || ''
    const router = useRouter()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!token) {
            setError('Invalid setup link.')
            return
        }
        if (password.length < 8) {
            setError('Please choose a password of at least 8 characters.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        setLoading(true)
        try {
            const result = await setClaimPassword(token, password)
            if (!result.success) {
                setError(result.message || 'Could not set your password.')
                return
            }
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: result.email!,
                password,
            })
            if (signInError) {
                setError('Password saved. Please sign in with it on the login page.')
                setTimeout(() => router.push('/provider/login'), 2000)
                return
            }
            router.push('/provider/dashboard')
            router.refresh()
        } catch {
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <Logo className="h-12 w-auto" />
                </div>
                <h2 className="text-center text-3xl font-display font-bold text-gray-900">
                    Choose Your Dashboard Password
                </h2>
                <p className="mt-2 text-center text-sm text-[#3D2B1F]/50">
                    Your listing claim is verified. Set a password to open your dashboard.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="At least 8 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Repeat your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#3D2B1F] bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {loading ? 'Setting Password...' : 'Set Password and Open Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function SetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <SetPasswordContent />
        </Suspense>
    )
}
