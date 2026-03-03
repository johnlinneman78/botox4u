'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, FileText, BarChart3 } from 'lucide-react'
import { NICHE } from '@/config/niche'

export function QuizBanner({ city }: { city?: string }) {
    return (
        <section className="rounded-3xl border overflow-hidden relative bg-[#1A1A1A] text-white p-8 md:p-16">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[#B5936B] to-transparent opacity-10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[#B5936B] to-transparent opacity-5 blur-2xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B5936B]" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B5936B]">
                            Patient Resource
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                        Stop guessing what {NICHE.name} costs {city ? `in ${city}` : 'you'}.
                    </h2>

                    <p className="text-lg text-[#999] font-light mb-10 max-w-xl leading-relaxed">
                        Get your personalized estimate in 60 seconds and download the 2026 Price Guide —
                        including verified rates for all 22 major cities and our "Smart Patient" course.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href="/quiz"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#B5936B] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#A3825D] transition-all group"
                        >
                            Start Your Estimate
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3">
                    {[
                        { icon: Calculator, label: "Price Estimator" },
                        { icon: FileText, label: "2026 PDF Guide" },
                        { icon: BarChart3, label: "City Benchmarks" },
                        { icon: CheckCircle, label: "Safety Checklist" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <item.icon size={20} className="mx-auto mb-3 text-[#B5936B]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCC]">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CheckCircle({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
