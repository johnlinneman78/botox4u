import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

interface PromoteClinicCardProps {
    city: string
}

export function PromoteClinicCard({ city }: PromoteClinicCardProps) {
    return (
        <Card className="bg-[#F2EDE4] text-[#3D2B1F] overflow-hidden border border-[#3D2B1F]/10 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl">📈</span>
            </div>
            <CardContent className="p-8 relative z-10">
                <div className="bg-[#C9A96E]/10 text-[#C9A96E] text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 border border-[#C9A96E]/20 uppercase tracking-widest">
                    For Clinic Owners
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 leading-tight">
                    Want more patients in <span className="text-[#C9A96E]">{city}</span>?
                </h3>
                <p className="text-sm text-[#3D2B1F]/60 mb-8 leading-relaxed">
                    Join the #1 specialized aesthetic medicine provider directory. Premium members get 4x more leads and Top-of-Search placement.
                </p>
                <div className="space-y-3">
                    <Button className="w-full bg-[#C9A96E] hover:bg-[#B5955B] text-white border-0 py-6 text-md font-bold shadow-lg shadow-[#C9A96E]/10">
                        <Link href="/claim">Promote My Clinic</Link>
                    </Button>
                    <p className="text-[10px] text-center text-gray-700">
                        Average clinic sees 15+ new patient inquiries per month.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
