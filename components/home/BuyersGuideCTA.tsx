'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BookOpen, ArrowRight } from 'lucide-react'

export function BuyersGuideCTA() {
    return (
        <section className="py-16 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="bg-[#f8f9fa] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                            <BookOpen className="w-8 h-8 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-primary mb-2">
                                Not sure how to choose a provider?
                            </h3>
                            <p className="text-[#3D2B1F]/50 max-w-md">
                                Download the free Botox Buyer&apos;s Guide — 7 questions to ask before you book.
                            </p>
                        </div>
                    </div>
                    <Link href="/botox-buyers-guide">
                        <Button className="bg-[#1a2332] hover:bg-slate-800 text-[#3D2B1F] px-8 py-7 text-base font-bold rounded-xl shadow-lg shadow-primary/10 group">
                            Get the Free Guide
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
