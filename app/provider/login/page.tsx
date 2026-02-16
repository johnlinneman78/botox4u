'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function ProviderLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/provider/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-primary">Provider Login</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Manage your clinic listing and view your leads
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-xl">
                    <CardContent className="pt-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-error/10 border border-error/20 text-error text-xs rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                    placeholder="name@clinic.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-lg font-bold shadow-lg shadow-secondary/20"
                            >
                                {loading ? 'Entering Hub...' : 'Sign In to Dashboard'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-gray-500 text-xs">Don&apos;t have an account yet?</span>{' '}
                                <Link href="/provider/register" className="text-secondary font-bold hover:underline">
                                    Register Your Clinic
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Securely managed by National Botox Directory.
                    <br />
                    Need help? <a href="mailto:support@botoxdirectory.com" className="underline">Contact Support</a>
                </p>
            </div>
        </div>
    )
}
