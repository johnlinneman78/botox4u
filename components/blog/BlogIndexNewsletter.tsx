'use client'

import { useState } from 'react'

// Blog index newsletter form, rebuilt: the old block was a bare input
// and button with no form, no state, and no submit handler, so a
// submit did nothing and showed nothing. This posts to the same
// /api/newsletter route the working blog-post form uses, validates
// on empty submit, and only shows confirmation after the save succeeds.
export default function BlogIndexNewsletter() {
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
                body: JSON.stringify({ email, source: 'blog-index' }),
            })
            if (!res.ok) throw new Error('Signup failed')
            setStatus('success')
        } catch {
            setStatus('error')
            setError('Something went wrong. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="max-w-lg mx-auto text-center">
                <p className="text-lg font-bold text-[#3D2B1F]">You&apos;re on the list!</p>
                <p className="text-[#3D2B1F]/60 font-light">Watch your inbox for pricing updates.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-16 px-6 bg-white border border-[#3D2B1F]/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/10 text-lg text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 transition-all"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="h-16 px-10 bg-[#C9A96E] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.05] transition-transform shadow-xl shadow-[#C9A96E]/20"
                >
                    {status === 'loading' ? 'Sending…' : 'Join the Pulse'}
                </button>
            </div>
            {status === 'error' && error && (
                <p className="mt-4 text-center text-sm text-red-700">{error}</p>
            )}
        </form>
    )
}
