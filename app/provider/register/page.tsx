'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function ProviderRegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [clinicName, setClinicName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    clinic_name: clinicName,
                }
            }
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                        📧
                    </div>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">Check your email</h2>
                    <p className="text-gray-600 mb-8">
                        We&apos;ve sent a confirmation link to <span className="font-bold">{email}</span>. Please verify your email to access your dashboard.
                    </p>
                    <Link href="/provider/login">
                        <Button variant="outline" className="w-full">
                            Back to Login
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-primary text-balance">Join the #1 Injector Network</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Reach thousands of local patients searching for Botox
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-xl">
                    <CardContent className="pt-8">
                        <form onSubmit={handleRegister} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-error/10 border border-error/20 text-error text-xs rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Clinic or Professional Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                    placeholder="Ex: Beverly Hills Aesthetics"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Work Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                    placeholder="dr.jane@clinic.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Create Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                    placeholder="Min. 8 characters"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-lg font-bold shadow-lg shadow-secondary/20"
                            >
                                {loading ? 'Creating Account...' : 'Register My Clinic'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-gray-500 text-xs">Already have an account?</span>{' '}
                                <Link href="/provider/login" className="text-secondary font-bold hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-gray-400">
                    By registering, you agree to our <a href="#" className="underline">Terms of Service</a>.
                    Your email will only be used for account and lead notifications.
                </p>
            </div>
        </div>
    )
}
