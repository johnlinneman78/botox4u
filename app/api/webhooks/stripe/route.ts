
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');

import { NICHE } from '@/config/niche';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log(`Stripe Webhook received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const providerId = session.metadata?.providerId;
        const planId = session.metadata?.planId;

        if (providerId && planId) {
            console.log(`✅ Payment success for provider ${providerId} (${planId})`);
            // Existing provider logic...
            const { data: provider, error } = await supabase
                .from('providers')
                .update({
                    outreach_status: 'paying',
                    subscription_tier: planId,
                    subscription_status: 'active',
                    subscription_start: new Date().toISOString(),
                    stripe_customer_id: session.customer as string
                })
                .eq('id', providerId)
                .select()
                .single();

            if (error) {
                console.error('Error updating provider subscription:', error);
            } else if (provider && (provider.email || (provider.enriched_attrs as any)?.email)) {
                const targetEmail = provider.email || (provider.enriched_attrs as any)?.email;
                await resend.emails.send({
                    from: `John from ${NICHE.siteName} <${NICHE.outreach.senderEmail}>`,
                    to: targetEmail,
                    subject: `Welcome to ${NICHE.siteName} Premium`,
                    html: `<p>Your listing ${provider.name} is now active on the ${planId} plan.</p>`
                });
            }
        }

        const apiPlanId = session.metadata?.apiPlanId;
        const customerEmail = session.metadata?.customerEmail;

        if (apiPlanId && customerEmail) {
            console.log(`✅ API Payment success for ${customerEmail} (${apiPlanId})`);

            const callLimit = apiPlanId === 'api_starter' ? 5000 : 1000000;
            const newKey = `II_${apiPlanId.toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            const { data: apiKey, error } = await supabase
                .from('api_keys')
                .upsert({
                    owner_email: customerEmail,
                    tier: apiPlanId === 'api_starter' ? 'STARTER' : 'PRO',
                    call_limit: callLimit,
                    active: true,
                    key: newKey, // Note: In production, you'd only create if one doesn't exist or upgrade legacy
                    owner_name: customerEmail.split('@')[0]
                }, { onConflict: 'owner_email' })
                .select()
                .single();

            if (error) {
                console.error('Error creating/updating API key:', error);
            } else {
                // Send API key email
                await resend.emails.send({
                    from: `API Hub <${NICHE.outreach.senderEmail}>`,
                    to: customerEmail,
                    subject: `Your ${NICHE.siteName} API Key is Live`,
                    html: `
                        <div style="font-family: sans-serif; line-height: 1.6;">
                            <h2>API Access Activated</h2>
                            <p>Hi there,</p>
                            <p>Your <strong>${apiPlanId.toUpperCase()}</strong> plan is now active.</p>
                            <p>Your API Key: <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 4px;">${newKey}</code></p>
                            <p>Documentation: <a href="https://injectorindex.com/api-access">https://injectorindex.com/api-access</a></p>
                            <p>Limits: ${callLimit.toLocaleString()} calls per month.</p>
                            <p>Happy building!</p>
                        </div>
                    `
                });
            }
        }
    }

    if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`❌ Payment failed for customer ${invoice.customer}`);
        // Notify admin
        await resend.emails.send({
            from: `system@${NICHE.domain}`,
            to: process.env.ADMIN_EMAIL || `john@${NICHE.domain}`,
            subject: '🚨 URGENT: Stripe Payment Failed',
            html: `<p>Payment failed for customer ${invoice.customer}. Invoice ID: ${invoice.id}</p>`
        });
    }

    return NextResponse.json({ received: true });
}
