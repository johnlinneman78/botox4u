'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'

export function VerifyForm({ provider }: { provider: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const npi = formData.get('npi') as string

        try {
            // Real NPI Verification via CMS API
            const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}`)
            const data = await response.json()

            if (data.result_count === 0) {
                setError('NPI number not found in federal registry. Please check the number and try again.')
                return
            }

            const npiRecord = data.results[0]
            // Optional: Basic name matching logic
            const providerNameParts = provider.name.toLowerCase().split(' ')
            const npiName = (npiRecord.basic.organization_name || `${npiRecord.basic.first_name} ${npiRecord.basic.last_name}`).toLowerCase()

            // Success! Redirect to edit page with NPI
            router.push(`/claim/${provider.slug}/edit?verify=${npi}`)
        } catch (err) {
            console.error('NPI Verification Error:', err)
            setError('Verification service unavailable. Please try again or contact support.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Practice Email
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        placeholder="dr.smith@example.com"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-lg"
                    />
                    <p className="text-[10px] text-gray-400 font-light">Enter the primary email address listed for your clinic.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        NPI Number (10 Digits)
                    </label>
                    <input
                        required
                        type="text"
                        name="npi"
                        placeholder="1234567890"
                        pattern="[0-9]{10}"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-lg tracking-[0.2em]"
                    />
                    <p className="text-[10px] text-gray-400 font-light">Your federal Individual or Organizational NPI.</p>
                </div>
            </div>

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        <span>Continue to Profile Editor</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    )
}
