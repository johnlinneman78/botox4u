export default function StatsCard({ label, value, period }: { label: string, value: number, period: string }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] opacity-[0.02] blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-display font-bold text-white mt-2 group-hover:text-[#d4af37] transition-colors">{value.toLocaleString()}</p>
            <p className="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-widest">{period}</p>
        </div>
    )
}
