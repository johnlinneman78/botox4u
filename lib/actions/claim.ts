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
        .select('name, claimed, email, website')
        .eq('id', formData.providerId)
        .single();

    if (fetchError || !provider) {
        return { success: false, message: 'Provider not found.' };
    }

    if (provider.claimed) {
        return { success: false, message: 'This listing has already been claimed.' };
    }

    // 1b. Ownership check: the verification link is only sent automatically
    // when the claimant's email matches the practice on file (the listed
    // email, or an email on the practice's own website domain). Anything
    // else is recorded and waits for manual review by the owner.
    const claimantEmail = formData.email.trim().toLowerCase();
    const claimantDomain = claimantEmail.split('@')[1] || '';
    const listedEmail = (provider.email || '').trim().toLowerCase();
    const websiteDomain = (provider.website || '')
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split(':')[0];
    const emailMatchesPractice =
        (listedEmail !== '' && claimantEmail === listedEmail) ||
        (websiteDomain !== '' && claimantDomain === websiteDomain);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (!emailMatchesPractice) {
        await supabase
            .from('provider_accounts')
            .upsert({
                provider_id: formData.providerId,
                email: formData.email,
                verification_token: verificationToken,
                verified: false
            });
        await supabase
            .from('providers')
            .update({ crm_status: 'claim_review' })
            .eq('id', formData.providerId);
        return {
            success: true,
            message: 'Claim received. Because this email does not match the practice details we have on file, we review claims like this by hand and will reply to the email you gave.'
        };
    }

    // 2. Create or find provider account

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
