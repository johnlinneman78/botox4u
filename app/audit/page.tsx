import NewsletterAudit from '@/components/home/NewsletterAudit'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Clinic Audit | Independent Aesthetic Intelligence',
    description: 'Verify your local clinic pricing, safety records, and natural result integrity before you book.',
}

export default function AuditPage() {
    return (
        <main className="min-h-screen bg-[#0d1420] pt-20">
            <NewsletterAudit />
        </main>
    )
}
