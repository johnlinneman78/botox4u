import { Card } from '@/components/ui/Card'

interface TableRow {
    label: string
    units: string
    costRange: string
    notes?: string
}

interface CostComparisonTableProps {
    id?: string
    title: string
    rows: TableRow[]
    footer?: string
    /** Optional override — defaults to current month/year */
    updatedDate?: string
}

export function CostComparisonTable({ id, title, rows, footer, updatedDate }: CostComparisonTableProps) {
    const lastUpdated = updatedDate ?? 'March 2026'

    return (
        <section className="my-12" id={id}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
                <h3 className="text-xl font-display font-bold text-[#3D2B1F]">{title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C9A96E]/10 text-[#C9A96E] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#C9A96E]/20">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last Updated: {lastUpdated}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#3D2B1F]/5 text-[#3D2B1F]/50 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#3D2B1F]/10">
                        VerifiedAesthetics.com Data
                    </span>
                </div>
            </div>
            <Card className="overflow-hidden border-[#3D2B1F]/10 bg-[#3D2B1F]/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#3D2B1F]/5 border-b border-[#3D2B1F]/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Treatment Area</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Typical Units</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Estimated Cost</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Clinical Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-[#3D2B1F]/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-[#3D2B1F]">{row.label}</td>
                                    <td className="px-6 py-4 text-sm text-[#3D2B1F]/60">{row.units}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#C9A96E]">{row.costRange}</td>
                                    <td className="px-6 py-4 text-sm text-[#3D2B1F]/50 font-light italic">{row.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {footer && (
                <p className="mt-4 text-xs text-[#3D2B1F]/50 italic">
                    {footer}
                </p>
            )}
        </section>
    )
}
