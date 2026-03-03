import { MapPin, Search, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
    {
        id: '01',
        title: 'Pick Your City',
        desc: 'Select your city from 22 major metros across the US.',
        icon: <MapPin className="w-6 h-6" />,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
        id: '02',
        title: 'Compare Scores',
        desc: 'Review Clarity Score™ rankings, credentials, pricing, and patient outcomes side by side.',
        icon: <Search className="w-6 h-6" />,
        color: 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20'
    },
    {
        id: '03',
        title: 'Book with Confidence',
        desc: 'Contact your top-ranked injector directly — no middleman, no referral fees.',
        icon: <Calendar className="w-6 h-6" />,
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
]

export default function ProcessThreeStep() {
    return (
        <section className="py-24 bg-[#0d1420] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                    {STEPS.map((step, i) => (
                        <div key={step.id} className="group relative">
                            {/* Connector line for desktop */}
                            {i < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-full w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent -translate-x-12 z-0" />
                            )}

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`w-24 h-24 rounded-[2rem] ${step.color} border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                                    {step.icon}
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0d1420] border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500">
                                        {step.id}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-[#d4af37] transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-light">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle bg glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#d4af37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        </section>
    )
}
