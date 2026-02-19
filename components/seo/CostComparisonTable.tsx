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
}

export function CostComparisonTable({ id, title, rows, footer }: CostComparisonTableProps) {
    return (
        <section className="my-12" id={id}>
            <h3 className="text-xl font-display font-bold text-primary mb-6">{title}</h3>
            <Card className="overflow-hidden border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Treatment Area</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Typical Units</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Cost</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Clinical Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">{row.label}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{row.units}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-secondary">{row.costRange}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400 font-light italic">{row.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {footer && (
                <p className="mt-4 text-xs text-gray-400 italic">
                    {footer}
                </p>
            )}
        </section>
    )
}
