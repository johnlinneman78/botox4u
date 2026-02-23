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
    const lastUpdated = updatedDate ?? new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <section className="my-12" id={id}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
                <h3 className="text-xl font-display font-bold text-white">{title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#d4af37]/20">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last Updated: {lastUpdated}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/[0.06]">
                        InjectorIndex.com Data
                    </span>
                </div>
            </div>
            <Card className="overflow-hidden border-white/[0.06] bg-white/[0.02]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Treatment Area</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Typical Units</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Cost</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Clinical Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-white">{row.label}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{row.units}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#d4af37]">{row.costRange}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-light italic">{row.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {footer && (
                <p className="mt-4 text-xs text-gray-600 italic">
                    {footer}
                </p>
            )}
        </section>
    )
}
