'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles, User, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from './ui/Button'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

export function AIConcierge() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Only show on homepage or city pages (/injectors/...)
    const shouldShow = pathname === '/' || pathname.startsWith('/injectors/')

    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: "Hi! I'm your InjectorIndex assistant. Looking for natural results or a specific clinician in your city? I can help you find the perfect match." }
    ])
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    if (!shouldShow) return null

    const handleSend = async () => {
        if (!inputValue.trim() || loading) return

        const userMsg = { role: 'user', content: inputValue }
        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setLoading(true)

        try {
            const response = await fetch('/api/concierge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            })
            const data = await response.json()

            if (data.message) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message,
                    recommendations: data.recommendations
                }])

                // Track recommendation if present
                if (data.recommendations?.length > 0 && typeof window.gtag === 'function') {
                    window.gtag('event', 'concierge_recommendation', {
                        count: data.recommendations.length
                    })
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-[#d4af37] text-[#0d1420] rounded-full shadow-2xl shadow-[#d4af37]/40 flex items-center justify-center hover:scale-110 transition-all z-[100] group"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <div className="absolute -top-12 right-0 bg-white text-[#0d1420] text-[10px] font-black px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl animate-bounce">
                        Find My Injector 💉
                    </div>
                )}
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-[#0d1420]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="p-6 bg-white/[0.02] border-b border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#d4af37]" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Concierge AI</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Online • Active Research</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-[#d4af37] text-[#0d1420] font-bold rounded-tr-none'
                                    : 'bg-white/[0.03] text-gray-300 border border-white/5 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Recommendations Cards */}
                                {msg.recommendations && msg.recommendations.length > 0 && (
                                    <div className="mt-4 space-y-3 w-full">
                                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">Recommended Injectors:</p>
                                        {msg.recommendations.map((rec: any) => (
                                            <div key={rec.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center gap-4 group/rec">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center text-[#d4af37]">
                                                    <UserCheck className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-white font-bold text-xs truncate">{rec.name}</h5>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-[#d4af37] font-black uppercase">TrueScore {rec.truescore}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase">{rec.city}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/provider/${rec.slug}`}>
                                                    <Button size="sm" className="h-8 w-8 rounded-lg bg-white/5 p-0 hover:bg-[#d4af37] hover:text-[#0d1420]">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 text-gray-500 italic text-xs animate-pulse">
                                <Sparkles className="w-3 h-3" /> Assistant is thinking...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/10">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="e.g. Find me natural botox in Miami"
                                className="w-full h-12 pl-4 pr-12 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 font-light"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#d4af37] text-[#0d1420] flex items-center justify-center hover:bg-[#c0a030] transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[9px] text-gray-600 uppercase tracking-widest font-black flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Powered by InjectorIndex Data
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
