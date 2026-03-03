import { AlertTriangle } from 'lucide-react'
import { NICHE } from '@/config/niche'

export function MedicalDisclaimer({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
    if (variant === 'inline') {
        return (
            <p className="text-[10px] text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {NICHE.copy.footerDisclaimer}
            </p>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-[#3D2B1F]/70">
                <p className="font-semibold text-amber-400 mb-1">⚠️ Independent Research Portal</p>
                <p>{NICHE.copy.footerDisclaimer}</p>
            </div>
        )
    }

    return (
        <div className="bg-[#F2EDE4] text-[#3D2B1F] p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] my-12 relative overflow-hidden border border-[#3D2B1F]/10">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-[#C9A96E]">
                    <AlertTriangle className="w-5 h-5" />
                    Medical Research Disclaimer
                </h3>
                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed max-w-3xl">
                    {NICHE.copy.footerDisclaimer}
                </p>
                <div className="mt-6 pt-6 border-t border-[#3D2B1F]/10 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-700">
                    <span>Not Medical Advice</span>
                    <span>Independent Audit</span>
                    <span>Consumer Research Only</span>
                </div>
            </div>
        </div>
    )
}
