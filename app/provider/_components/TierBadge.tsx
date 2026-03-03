export default function TierBadge({ tier }: { tier: string }) {
    const styles: Record<string, string> = {
        featured: 'bg-amber-100 text-amber-800 border-amber-300',
        premium: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        verified: 'bg-blue-100 text-blue-800 border-blue-300',
        free: 'bg-gray-100 text-[#3D2B1F]/50 border-gray-300',
    }

    const label = tier?.toUpperCase() || 'FREE'
    const styleKey = tier?.toLowerCase() || 'free'

    return (
        <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${styles[styleKey] ?? styles.free}`}>
            {label}
        </span>
    )
}
