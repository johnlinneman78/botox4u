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

// ---------------------------------------------------------------------------
// Claim flow C: a working dashboard for a token-verified claimant.
//
// The old /provider/verify page marked the claim verified and then sent the
// claimant to /provider/dashboard, which requires a Supabase Auth session
// AND a providers row whose user_id matches that session. Token verification
// created neither, so every claimant bounced to /provider/login with no
// password to log in with. That is the exact break Georgetown Allure hit.
//
// The fixed flow, all server-side with the service-role client:
//   1. verifyClaimToken(token): find the provider_accounts row, create an
//      Auth user for the claimant email if none exists (email pre-confirmed),
//      link providers.user_id to that user, mark the claim verified. The
//      verification token is KEPT at this step on purpose: it becomes the
//      one-time password-setup token for step 2.
//   2. setClaimPassword(token, password): the claimant picks their own
//      password on /provider/set-password. The Auth user's password is set
//      to it, the token is then cleared (single use), and the client signs
//      in and lands on /provider/dashboard, which now finds its provider.
// No password is ever generated for the claimant, emailed, or stored
// anywhere by us: the throwaway password used at Auth-user creation is
// random, never disclosed, and replaced by the claimant's own password
// before the token is cleared. Claiming stays free; nothing here changes
// ranking, Clarity Score, or any paid tier (there is none).
// ---------------------------------------------------------------------------

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error || !data?.users) return null;
    const match = data.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
    return match ? match.id : null;
}

export async function verifyClaimToken(token: string) {
    if (!token) return { success: false, message: 'Invalid verification link.' };

    const { data: account, error: fetchError } = await supabase
        .from('provider_accounts')
        .select('id, provider_id, email, verified')
        .eq('verification_token', token)
        .single();

    if (fetchError || !account) {
        return { success: false, message: 'Invalid or expired verification link.' };
    }

    // Find or create the Auth user for this claimant email.
    let userId = await findAuthUserIdByEmail(account.email);
    if (!userId) {
        // Random throwaway password, never disclosed or stored; the
        // claimant replaces it with their own password in step 2.
        const throwaway = crypto.randomBytes(32).toString('hex');
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
            email: account.email,
            password: throwaway,
            email_confirm: true,
            user_metadata: { provider_id: account.provider_id },
        });
        if (createError || !created?.user) {
            console.error('Claim Auth user creation error:', createError);
            return { success: false, message: 'Could not set up your dashboard account. Please contact support.' };
        }
        userId = created.user.id;
    }

    // Link the provider to this Auth user and mark the claim verified.
    // The verification token is intentionally NOT cleared here: it is the
    // one-time token for the password-setup step that follows.
    const { error: accountError } = await supabase
        .from('provider_accounts')
        .update({ verified: true, last_login: new Date().toISOString() })
        .eq('id', account.id);
    const { error: providerError } = await supabase
        .from('providers')
        .update({ claimed: true, crm_status: 'verified', user_id: userId })
        .eq('id', account.provider_id);

    if (accountError || providerError) {
        console.error('Claim verification link error:', accountError, providerError);
        return { success: false, message: 'Failed to finalise verification. Please contact support.' };
    }

    return { success: true, providerId: account.provider_id, email: account.email, setupToken: token };
}

export async function setClaimPassword(token: string, password: string) {
    if (!token) return { success: false, message: 'Invalid setup link.' };
    if (!password || password.length < 8) {
        return { success: false, message: 'Please choose a password of at least 8 characters.' };
    }

    const { data: account, error: fetchError } = await supabase
        .from('provider_accounts')
        .select('id, provider_id, email, verified')
        .eq('verification_token', token)
        .single();

    if (fetchError || !account || !account.verified) {
        return { success: false, message: 'Invalid or expired setup link.' };
    }

    const { data: provider } = await supabase
        .from('providers')
        .select('user_id')
        .eq('id', account.provider_id)
        .single();
    let userId: string | null = provider?.user_id || null;
    if (!userId) userId = await findAuthUserIdByEmail(account.email);
    if (!userId) {
        return { success: false, message: 'No dashboard account was found for this claim. Please contact support.' };
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
    if (updateError) {
        console.error('Claim password setup error:', updateError);
        return { success: false, message: 'Could not set your password. Please try again or contact support.' };
    }

    // Single use: clear the token now that the password is set.
    await supabase
        .from('provider_accounts')
        .update({ verification_token: null, last_login: new Date().toISOString() })
        .eq('id', account.id);
    await supabase
        .from('providers')
        .update({ user_id: userId })
        .eq('id', account.provider_id);

    return { success: true, email: account.email };
}
