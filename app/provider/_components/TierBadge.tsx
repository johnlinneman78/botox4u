export default function TierBadge({ tier }: { tier: string }) {
    const styles: Record<string, string> = {
        featured: 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/20',
        premium: 'bg-[#3D2B1F]/5 text-[#3D2B1F] border-[#3D2B1F]/10',
        verified: 'bg-[#8A9E8D]/10 text-[#8A9E8D] border-[#8A9E8D]/20',
        free: 'bg-gray-100 text-[#3D2B1F]/40 border-gray-200',
    }

    const label = tier?.toUpperCase() || 'FREE'
    const styleKey = tier?.toLowerCase() || 'free'

    return (
        <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${styles[styleKey] ?? styles.free}`}>
            {label}
        </span>
    )
}
