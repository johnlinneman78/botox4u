'use server'

import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

export async function createCheckoutSession(tier: 'featured' | 'premium') {
    // PARKED Nov 5, 2026 (John's decision): provider pricing is paused.
    // Card checkout is turned off: this entry point refuses to create
    // a session. No payment can be started from the site while this
    // guard is in place. When pricing returns, remove the guard and
    // restore the session creation below from git history.
    throw new Error('Payments are paused right now. Listing is free, and there are no paid plans at the moment.')
}

// --- Paused implementation (kept for reference, not called) ---
async function createCheckoutSessionPaused(tier: 'featured' | 'premium') {
    if (!stripe) {
        throw new Error('Stripe is not configured')
    }

    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) {
        throw new Error('Supabase not initialized')
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/provider/login')
    }

    const { data: provider } = await supabase
        .from('providers')
        .select('id, name')
        .eq('user_id', user.id)
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
        customer_email: user.email,
    })

    return { url: session.url }
}
