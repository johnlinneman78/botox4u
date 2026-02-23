'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const StickyBar = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling down 400px
            if (window.scrollY > 400) {
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
            <div className="bg-[#101827]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest leading-none mb-1">Clinic Audit</div>
                        <div className="text-xs font-bold text-white leading-tight">Verify Your Local Clinic Pricing</div>
                    </div>
                </div>
                <Link href="/audit" className="shrink-0">
                    <Button size="sm" className="bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black rounded-xl px-4 h-10 flex items-center gap-2 text-[10px] uppercase tracking-wider">
                        Start <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
