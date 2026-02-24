'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Gift } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ExitIntentModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [city, setCity] = useState('your area')

    const canShowRef = useRef(false)

    useEffect(() => {
        // Delay activation for 60 seconds
        const activationTimer = setTimeout(() => {
            canShowRef.current = true
        }, 60000)

        return () => clearTimeout(activationTimer)
    }, [])

    useEffect(() => {
        // Only show once per session
        const hasSeen = sessionStorage.getItem('exit-intent-seen')
        if (hasSeen) return

        let idleTimer: NodeJS.Timeout

        const showModal = () => {
            if (!canShowRef.current) return
            setIsVisible(true)
            sessionStorage.setItem('exit-intent-seen', 'true')
        }

        const handleMouseOut = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                showModal()
            }
        }

        const resetIdleTimer = () => {
            clearTimeout(idleTimer)
            idleTimer = setTimeout(showModal, 60000) // 60 seconds of inactivity
        }

        document.addEventListener('mouseleave', handleMouseOut)
        document.addEventListener('mousemove', resetIdleTimer)
        document.addEventListener('keydown', resetIdleTimer)
        document.addEventListener('click', resetIdleTimer)

        resetIdleTimer()

        // Try to get city name from a common place (optional)
        setCity('your area')

        return () => {
            document.removeEventListener('mouseleave', handleMouseOut)
            document.removeEventListener('mousemove', resetIdleTimer)
            document.removeEventListener('keydown', resetIdleTimer)
            document.removeEventListener('click', resetIdleTimer)
            clearTimeout(idleTimer)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#0d1420]/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1a2332] to-[#0d1420] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-[#d4af37]/10 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px]" />

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!isSubmitted ? (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] mb-8">
                            <Gift className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">
                            Before you go — get <span className="text-[#d4af37]">{city}'s</span> top 5 Regen providers
                        </h2>
                        <p className="text-gray-400 mb-8 font-light">
                            We've audited 100+ clinicians. Get our private list of the highest-scoring regenerative injectors in your area.
                        </p>

                        <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest transition-transform hover:scale-[1.02]"
                            >
                                Send Me The List <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-gray-700 mt-6 font-bold uppercase tracking-tighter">
                            🔒 No spam. Just data. 2026 Shift Protocol.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8">
                            <Send className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-4">
                            Check Your Inbox
                        </h2>
                        <p className="text-gray-400 mb-8 font-light">
                            The {city} Regen Top 5 list is on its way. Use these scores to ensure your next treatment follows biological best practices.
                        </p>
                        <Button
                            onClick={() => setIsVisible(false)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-bold transition-all"
                        >
                            Got it
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
