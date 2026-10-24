'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseServer } from '@/lib/supabase/factory'

export async function updateProviderProfile(formData: FormData) {
    try {
        const supabase = await getSupabaseServer(await cookies())
        if (!supabase) throw new Error('Supabase not initialized')

        const providerId = formData.get('provider_id') as string
        if (!providerId) {
            throw new Error('Provider ID is missing')
        }

        const updates: any = {
            name: formData.get('name') as string,
            business_type: formData.get('business_type') as string,
            description: formData.get('description') as string,
            address: formData.get('address') as string,
            phone: formData.get('phone') as string,
            website: formData.get('website') as string,
        }

        // Handle numeric fields safely
        const pricePerUnit = formData.get('price_per_unit');
        if (pricePerUnit) {
            updates.price_per_unit = parseFloat(pricePerUnit as string);
        }

        const { error } = await supabase
            .from('providers')
            .update(updates)
            .eq('id', providerId)

        if (error) {
            console.error('Error updating provider:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error updating provider profile:', error)
        return { success: false, error: error.message || 'Failed to update profile' }
    }
}

function getServiceRoleClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (!supabaseUrl || !serviceKey) throw new Error('Supabase not initialized')
    return createClient(supabaseUrl, serviceKey)
}

// Signup-first claim: a visitor finds their clinic on /claim, clicks
// "Create Account to Claim", and creates an account on
// /provider/signup?id=<provider_id>. The claim record must be written
// here, server side. The signup page used to run this update through
// the browser client before the new account had a session (email
// unconfirmed), row-level security matched zero rows, the returned
// error was never checked, and the flow reported success while
// writing nothing (verified live 2026-10-23: auth user created,
// providers row unchanged in all 68 columns, user bounced to login).
//
// A signup claim is a claim, not an approval: the listing goes to
// manual review (crm_status 'claim_review'), the claimant's account
// is linked (user_id) and recorded in provider_accounts, and claimed /
// verified stay false until a human approves the claim.
export async function recordSignupClaim(providerId: string, email: string, userId: string) {
    try {
        if (!providerId || !email || !userId) throw new Error('Missing claim details')
        const supabase = getServiceRoleClient()

        const { data: updatedRows, error } = await supabase
            .from('providers')
            .update({
                user_id: userId,
                email,
                outreach_status: 'claimed',
                crm_status: 'claim_review',
                claimed: false,
                verified: false,
                listing_tier: 'free'
            })
            .eq('id', providerId)
            .select('id')

        if (error) throw error
        if (!updatedRows || updatedRows.length === 0) {
            throw new Error('Claim update matched no provider row')
        }

        const { error: accountError } = await supabase
            .from('provider_accounts')
            .insert({ provider_id: providerId, email })

        if (accountError && accountError.code !== '23505') {
            console.error('provider_accounts insert failed:', accountError)
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error recording signup claim:', error)
        return { success: false, error: error.message || 'Failed to record claim' }
    }
}

// Brand-new listing created during signup (no existing provider id).
// Same failure class as the claim above: the insert ran through the
// browser client with no session and its error was never checked.
// A listing its owner just created is theirs, so claimed is true;
// verification stays a separate human decision.
export async function createSignupProvider(input: {
    userId: string
    clinicName: string
    city: string
    state: string
    slug: string
}) {
    try {
        if (!input.userId || !input.clinicName) throw new Error('Missing clinic details')
        const supabase = getServiceRoleClient()

        const { data: insertedRows, error } = await supabase
            .from('providers')
            .insert([{
                user_id: input.userId,
                name: input.clinicName,
                city: input.city,
                state: input.state,
                slug: input.slug,
                listing_tier: 'free',
                claimed: true,
                verified: false,
                business_type: 'Medspa'
            }])
            .select('id')

        if (error) throw error
        if (!insertedRows || insertedRows.length === 0) {
            throw new Error('Provider insert matched no rows')
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error creating signup provider:', error)
        return { success: false, error: error.message || 'Failed to create listing' }
    }
}

export async function claimProviderProfile(formData: FormData) {
    try {
        // The claim write must use a service-role client. The regular
        // server client runs as the anonymous visitor for a claimant, and
        // row-level security silently matched zero rows on this update:
        // PostgREST returned no error, the action reported success, and
        // nothing was ever written (verified live 2026-10-23 — success
        // page shown, providers row byte-identical afterward).
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) throw new Error('Supabase not initialized')
        const supabase = createClient(supabaseUrl, serviceKey)

        const providerId = formData.get('provider_id') as string
        if (!providerId) throw new Error('Provider ID is missing')

        const claimEmail = (formData.get('claim_email') as string) || ''

        // Fetch existing data for merging enriched_attrs
        const { data: existing } = await supabase
            .from('providers')
            .select('enriched_attrs')
            .eq('id', providerId)
            .single()

        const updates: any = {
            name: formData.get('name') as string,
            business_type: formData.get('business_type') as string,
            website: formData.get('website') as string,
            phone: formData.get('phone') as string,
            description: formData.get('description') as string,
            npi_number: formData.get('npi_number') as string,
            // Claiming a profile is not verification. The NPI number the
            // provider typed still has to be matched against the registry
            // (lib/npi/verifyProvider.ts) before any "verified" label shows.
            // The claim itself is recorded by outreach_status below.
            npi_verified: false,
            outreach_status: 'claimed',
            // A submitted claim goes to manual review. Nothing about the
            // listing is verified or live until a human approves it.
            crm_status: 'claim_review',
            services_offered: formData.getAll('services') as string[]
        }

        if (claimEmail) {
            updates.email = claimEmail
        }

        const pricePerUnit = formData.get('price_per_unit');
        if (pricePerUnit) {
            updates.price_per_unit = parseFloat(pricePerUnit as string);
        }

        const philosophy = formData.get('philosophy') as string;
        const smsOptIn = formData.get('sms_opt_in') === 'true';

        // Merge with existing enriched_attrs
        const enriched_attrs = existing?.enriched_attrs || {}
        if (philosophy) {
            enriched_attrs.philosophy = philosophy
        }

        if (smsOptIn) {
            enriched_attrs.sms_opt_in = true
            enriched_attrs.sms_opt_in_at = new Date().toISOString()
            // In a real environment, we'd get the IP from headers
            const forwardedFor = (await cookies()).get('x-forwarded-for')?.value
            enriched_attrs.sms_opt_in_ip = forwardedFor || 'unknown'
        }

        updates.enriched_attrs = enriched_attrs

        const { data: updatedRows, error } = await supabase
            .from('providers')
            .update(updates)
            .eq('id', providerId)
            .select('id')

        if (error) throw error

        // Never report success for a write that touched nothing again.
        if (!updatedRows || updatedRows.length === 0) {
            throw new Error('Claim update matched no provider row')
        }

        // Record the claimant so the account can be linked at approval.
        // provider_accounts.email is UNIQUE — a repeat claim from the
        // same email is not an error, so insert failures are logged,
        // not fatal.
        if (claimEmail) {
            const { error: accountError } = await supabase
                .from('provider_accounts')
                .insert({ provider_id: providerId, email: claimEmail })

            if (accountError && accountError.code !== '23505') {
                console.error('provider_accounts insert failed:', accountError)
            }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error claiming provider profile:', error)
        return { success: false, error: error.message || 'Failed to claim profile' }
    }
}
