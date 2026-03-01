import { Shield } from 'lucide-react'

export default function TrueScoreCard({ score }: { score: number }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] p-6 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-12 h-12 text-[#d4af37]" />
            </div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Your TrueScore™</p>
                    <div className="flex items-baseline gap-1">
                        <p className="text-4xl font-display font-bold text-white mt-1">{score || 0}</p>
                        <p className="text-lg text-gray-500 font-bold">/100</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-light max-w-sm">Based on credentials, patient outcomes, and verified reviews. Not influenced by your plan tier.</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-display font-bold text-2xl shadow-xl shadow-[#d4af37]/5">
                    {score || 0}
                </div>
            </div>
        </div>
    )
}
