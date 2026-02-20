
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

            // Update provider status
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
                // Send confirmation email
                if (resend) {
                    await resend.emails.send({
                        from: `John from ${NICHE.siteName} <${NICHE.outreach.senderEmail}>`,
                        to: targetEmail,
                        subject: `Welcome to ${NICHE.siteName} Premium`,
                        html: `
                            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2>Listing Upgraded!</h2>
                                <p>Hi ${provider.name},</p>
                                <p>Your subscription to the <strong>${planId.toUpperCase()}</strong> plan is now active.</p>
                                <p>Your listing has been upgraded automatically and will now appear with priority in search results.</p>
                                <p>View your listing: <a href="https://${NICHE.domain}/provider/${provider.slug}">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                                <p>I'll be in touch soon with your first performance report.</p>
                                <p>Best,<br>John Linneman</p>
                            </div>
                        `
                    });
                }
            }
        }
    }

    if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`❌ Payment failed for customer ${invoice.customer}`);
        // Notify admin
        if (resend) {
            await resend.emails.send({
                from: `system@${NICHE.domain}`,
                to: process.env.ADMIN_EMAIL || `john@${NICHE.domain}`,
                subject: '🚨 URGENT: Stripe Payment Failed',
                html: `<p>Payment failed for customer ${invoice.customer}. Invoice ID: ${invoice.id}</p>`
            });
        }
    }

    return NextResponse.json({ received: true });
}
