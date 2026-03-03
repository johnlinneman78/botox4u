'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const StickyBar = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling down 200px
            if (window.scrollY > 200) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500 lg:hidden">
            <div className="bg-[#F2EDE4]/90 backdrop-blur-xl border border-[#3D2B1F]/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest leading-none mb-1">Clinic Intelligence</div>
                        <div className="text-xs font-bold text-[#3D2B1F] leading-tight">Take the Injector Match Quiz →</div>
                    </div>
                </div>
                <Link href="/#match-quiz" className="shrink-0 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black rounded-xl px-4 h-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#C9A96E]/10 active:scale-[0.98]" onClick={(e) => {
                    if (window.location.pathname === '/') {
                        e.preventDefault();
                        document.getElementById('match-quiz')?.scrollIntoView({ behavior: 'smooth' });
                    }
                }}>
                    TAKE QUIZ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    )
}
