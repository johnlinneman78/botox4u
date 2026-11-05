import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

interface PromoteClinicCardProps {
    city: string
}

export function PromoteClinicCard({ city }: PromoteClinicCardProps) {
    return (
        <Card className="bg-[#F2EDE4] text-[#3D2B1F] overflow-hidden border border-[#3D2B1F]/10 shadow-2xl">
            <CardContent className="p-8 relative z-10">
                <div className="bg-[#C9A96E]/10 text-[#C9A96E] text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 border border-[#C9A96E]/20 uppercase tracking-widest">
                    For Clinic Owners
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 leading-tight">
                    Want more patients in <span className="text-[#C9A96E]">{city}</span>?
                </h3>
                <p className="text-sm text-[#3D2B1F]/60 mb-8 leading-relaxed">
                    Your free profile helps visitors review your practice information, services, and contact details.
                    Featured placement, booking display, and quote leads are separate paid options.
                </p>
                <div className="space-y-3">
                    <Button className="w-full bg-[#C9A96E] hover:bg-[#B5955B] text-white border-0 py-6 text-md font-bold shadow-lg shadow-[#C9A96E]/10">
                        <Link href="/claim">Claim your listing — free</Link>
                    </Button>
                    <p className="text-[10px] text-center text-gray-700">
                        Listing is free. Featured placement is $49.99 a month after a free 30-day trial (first 10 providers).
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
