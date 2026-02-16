'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(tier: 'featured' | 'premium') {
    const supabase = await createClient()
    const { data: { session: authSession } } = await supabase.auth.getSession()

    if (!authSession) {
        redirect('/provider/login')
    }

    const { data: provider } = await supabase
        .from('providers')
        .select('id, name')
        .eq('user_id', authSession.user.id)
        .single()

    if (!provider) {
        return { error: 'Please create a clinic listing first' }
    }

    const priceId = tier === 'premium'
        ? process.env.STRIPE_PREMIUM_PRICE_ID
        : process.env.STRIPE_FEATURED_PRICE_ID

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard?canceled=true`,
        metadata: {
            providerId: provider.id,
            tier: tier,
        },
        customer_email: authSession.user.email,
    })

    return { url: session.url }
}
