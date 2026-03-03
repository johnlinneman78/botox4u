import { Shield } from 'lucide-react'

export default function ClarityScoreCard({ score }: { score: number }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] p-6 bg-[#3D2B1F]/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-12 h-12 text-[#C9A96E]" />
            </div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-[10px] text-[#3D2B1F]/60 font-black uppercase tracking-widest mb-1">Your Clarity Score™</p>
                    <div className="flex items-baseline gap-1">
                        <p className="text-4xl font-display font-bold text-[#3D2B1F] mt-1">{score || 0}</p>
                        <p className="text-lg text-[#3D2B1F]/60 font-bold">/100</p>
                    </div>
                    <p className="text-xs text-[#3D2B1F]/60 mt-2 font-light max-w-sm">Based on credentials, patient outcomes, and verified reviews. Not influenced by your plan tier.</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] font-display font-bold text-2xl shadow-xl shadow-[#C9A96E]/5">
                    {score || 0}
                </div>
            </div>
        </div>
    )
}
