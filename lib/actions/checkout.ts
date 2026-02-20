
'use server';

import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { getSupabaseServer } from '@/lib/supabase/factory';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(providerId: string, planId: 'starter' | 'featured' | 'premium') {
    const supabase = await getSupabaseServer(await cookies());
    if (!supabase) throw new Error('Not authenticated');

    const { data: provider, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', providerId)
        .single();

    if (error || !provider) throw new Error('Provider not found');

    const plan = STRIPE_PLANS[planId];
    if (!plan) throw new Error('Invalid plan');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${plan.name} Listing - Botox-4U.com`,
                        description: `Subscription for ${provider.name}`,
                    },
                    unit_amount: plan.amount * 100,
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/${provider.slug}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        customer_email: provider.email || undefined,
        metadata: {
            providerId: provider.id,
            planId: planId,
        },
    });

    if (!session.url) throw new Error('Failed to create session');

    redirect(session.url);
}
