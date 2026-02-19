import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/factory';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const { type, data } = payload;

    // Resend webhook types: email.bounced, email.complained, etc.
    if (type === 'email.bounced' || type === 'email.complained') {
        const email = data.to[0];

        // Extract domain from email to be safe and match as requested
        const domain = email.split('@')[1];

        const supabase = await getSupabaseServer(await cookies());
        if (!supabase) return NextResponse.json({ error: 'DB error' }, { status: 500 });

        console.log(`🚫 Unsubscribing domain: ${domain} due to ${type} for ${email}`);

        // Update all providers with this domain or this specific email
        const { error } = await supabase
            .from('providers')
            .update({ outreach_status: 'unsubscribed' })
            .or(`website.ilike.%${domain}%,email.eq.${email}`);

        if (error) {
            console.error('Error updating unsubscribe status:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
