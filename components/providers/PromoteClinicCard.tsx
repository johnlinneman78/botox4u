import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

interface PromoteClinicCardProps {
    city: string
}

export function PromoteClinicCard({ city }: PromoteClinicCardProps) {
    return (
        <Card className="bg-primary text-white overflow-hidden border-0 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl">📈</span>
            </div>
            <CardContent className="p-8 relative z-10">
                <div className="bg-secondary/20 text-secondary text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 border border-secondary/30 uppercase tracking-widest">
                    For Clinic Owners
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 leading-tight">
                    Want more patients in <span className="text-secondary">{city}</span>?
                </h3>
                <p className="text-sm text-primary-foreground/70 mb-8 leading-relaxed">
                    Join the #1 specialized aesthetic medicine provider directory. Premium members get 4x more leads and Top-of-Search placement.
                </p>
                <div className="space-y-3">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white border-0 py-6 text-md font-bold shadow-lg shadow-secondary/20">
                        <Link href="/for-clinics">Promote My Clinic</Link>
                    </Button>
                    <p className="text-[10px] text-center text-primary-foreground/40">
                        Average clinic sees 15+ new patient inquiries per month.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
