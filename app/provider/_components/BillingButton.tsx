'use client'
import { useState } from 'react'
import { CreditCard } from 'lucide-react'

export default function BillingButton({ customerId }: { customerId: string }) {
    const [loading, setLoading] = useState(false)

    const handleBilling = async () => {
        if (!customerId) {
            alert('Billing setup required. Please contact support or upgrade your plan.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            })
            const { url } = await res.json()
            if (url) {
                window.location.href = url
            }
        } catch (err) {
            console.error('Portal failed', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleBilling}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full bg-white/[0.03] border border-white/10 hover:bg-white/5 text-white rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all group disabled:opacity-50"
        >
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
            {loading ? 'Opening Portal...' : 'Manage Billing & Subscription'}
        </button>
    )
}
