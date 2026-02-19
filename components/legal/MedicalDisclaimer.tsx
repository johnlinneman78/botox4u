import { AlertTriangle } from 'lucide-react'
import { NICHE } from '@/config/niche'

export function MedicalDisclaimer({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
    if (variant === 'inline') {
        return (
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-4xl mx-auto">
                {NICHE.copy.footerDisclaimer}
            </p>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="font-semibold text-amber-900 mb-1">⚠️ Independent Research Portal</p>
                <p>{NICHE.copy.footerDisclaimer}</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] my-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-secondary">
                    <AlertTriangle className="w-5 h-5" />
                    Medical Research Disclaimer
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {NICHE.copy.footerDisclaimer}
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Not Medical Advice</span>
                    <span>Independent Audit</span>
                    <span>Consumer Research Only</span>
                </div>
            </div>
        </div>
    )
}
