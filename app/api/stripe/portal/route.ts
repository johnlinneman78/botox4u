export const dynamic = 'force-dynamic'

import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
    const stripe = new Stripe(stripeKey, {
        apiVersion: '2024-12-18.acacia' as any,
    })

    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { customerId } = await req.json()

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/provider/dashboard`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (error: any) {
        console.error('Stripe Portal Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
