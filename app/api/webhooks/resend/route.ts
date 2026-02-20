import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const { type, data } = payload;

    console.log(`Webhook received: ${type}`);

    if (type === 'email.delivered' || type === 'email.opened') {
        console.log(`✅ Email ${type} for ${data.to?.[0] || 'unknown'}`);
        // Optional: Update last_engaged_at or similar in DB later
    }

    // Resend webhook types: email.bounced, email.complained, etc.
    if (type === 'email.bounced' || type === 'email.complained') {
        const email = data.to?.[0];
        if (!email) return NextResponse.json({ received: true });

        // Extract domain from email to be safe
        const domain = email.split('@')[1];

        console.log(`🚫 Unsubscribing domain: ${domain} due to ${type} for ${email}`);

        // Update all providers with this domain or this specific email
        const { error } = await supabase
            .from('providers')
            .update({ outreach_status: 'unsubscribed' })
            .or(`website.ilike.%${domain}%,enriched_attrs->>email.eq.${email}`);

        if (error) {
            console.error('Error updating unsubscribe status:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
