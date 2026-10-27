'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, BarChart3, CheckCircle2 } from 'lucide-react'
import { track } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'

export default function BlogCtaBar() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes('@')) {
            setError('Please enter a valid email address.')
            setStatus('error')
            return
        }
        setStatus('loading')
        setError(null)
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) throw new Error('Signup failed')
            setStatus('success')
            track('newsletter_signup', { source: 'blog-post' })
        } catch {
            setStatus('error')
            setError('Something went wrong. Please try again.')
        }
    }

    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto bg-[#F2EDE4] rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden border border-[#3D2B1F]/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 text-[#C9A96E] font-black uppercase tracking-widest text-xs mb-4">
                            <BarChart3 className="w-4 h-4" />
                            Botox Pulse Data
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#3D2B1F] mb-6">
                            Get Free Botox Pricing for Your Area
                        </h2>
                        <p className="text-[#3D2B1F]/60 text-lg font-light leading-relaxed">
                            Join 2,400+ patients getting monthly pricing updates, provider scores, and patient insights.
                        </p>
                    </div>
                    <div className="w-full md:w-auto min-w-[320px]">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <CheckCircle2 className="w-10 h-10 text-[#C9A96E]" />
                                <p className="text-lg font-bold text-[#3D2B1F]">You&apos;re on the list!</p>
                                <p className="text-[#3D2B1F]/60 font-light">Watch your inbox for pricing updates.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-16 pl-12 pr-6 bg-white border border-[#3D2B1F]/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/10 text-lg text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 transition-all"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-16 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-[#C9A96E]/20 transition-all hover:scale-[1.02]"
                                >
                                    {status === 'loading' ? 'Sending…' : 'Get My Free Updates →'}
                                </Button>
                                {status === 'error' && error && (
                                    <p className="text-center text-sm text-red-700">{error}</p>
                                )}
                                <div className="text-center pt-2">
                                    <Link href="/pulse" className="text-[10px] font-black uppercase tracking-widest text-[#C9A96E] hover:underline">
                                        Take the 2-minute market survey →
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
