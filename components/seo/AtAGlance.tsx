import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface AtAGlanceProps {
    title: string
    summary: string
    items: {
        label: string
        value: string | number
        prefix?: string
        suffix?: string
    }[]
}

export function AtAGlance({ title, summary, items }: AtAGlanceProps) {
    return (
        <Card className="bg-primary text-white overflow-hidden border-none shadow-2xl mb-12">
            <div className="bg-secondary/20 px-8 py-3 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-foreground">
                    Directory Insights
                </span>
            </div>
            <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-300 leading-relaxed font-light">
                            {summary}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-hover:text-secondary transition-colors">
                                    {item.label}
                                </p>
                                <div className="text-2xl md:text-3xl font-display font-bold">
                                    {item.prefix && <span className="text-secondary mr-1">{item.prefix}</span>}
                                    {item.value}
                                    {item.suffix && <span className="text-sm font-normal text-gray-400 ml-1">{item.suffix}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
