'use server'

import { createClient } from '@/lib/supabase/client' // Switch to server-side when actually calling
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { sendVerificationEmail } from '../resend'
import crypto from 'crypto'
import { NICHE } from '@/config/niche'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Global client for server actions
const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export async function initiateClaim(formData: {
    providerId: string,
    email: string,
    name: string
}) {
    // 1. Check if provider exists and is not already claimed
    const { data: provider, error: fetchError } = await supabase
        .from('providers')
        .select('name, claimed')
        .eq('id', formData.providerId)
        .single();

    if (fetchError || !provider) {
        return { success: false, message: 'Provider not found.' };
    }

    if (provider.claimed) {
        return { success: false, message: 'This listing has already been claimed.' };
    }

    // 2. Create or find provider account
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const { data: account, error: accountError } = await supabase
        .from('provider_accounts')
        .upsert({
            provider_id: formData.providerId,
            email: formData.email,
            verification_token: verificationToken,
            verified: false
        })
        .select()
        .single();

    if (accountError) {
        console.error('Account creation error:', accountError);
        return { success: false, message: 'Failed to initiate claim. Please try again.' };
    }

    // 3. Update CRM status to engaged (Step 10)
    await supabase
        .from('providers')
        .update({ crm_status: 'engaged' })
        .eq('id', formData.providerId);

    // 4. Send Verification Email (Step 2)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${NICHE.domain}`;
    const claimUrl = `${baseUrl}/provider/verify?token=${verificationToken}`;

    const emailResult = await sendVerificationEmail(formData.email, provider.name, claimUrl);

    if (!emailResult.success) {
        return { success: false, message: 'Failed to send verification email. Please contact support.' };
    }

    return { success: true };
}
