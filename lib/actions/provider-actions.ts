'use server'

import { cookies } from 'next/headers'
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

export async function claimProviderProfile(formData: FormData) {
    try {
        const supabase = await getSupabaseServer(await cookies())
        if (!supabase) throw new Error('Supabase not initialized')

        const providerId = formData.get('provider_id') as string
        if (!providerId) throw new Error('Provider ID is missing')

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
            services_offered: formData.getAll('services') as string[]
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

        const { error } = await supabase
            .from('providers')
            .update(updates)
            .eq('id', providerId)

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Error claiming provider profile:', error)
        return { success: false, error: error.message || 'Failed to claim profile' }
    }
}
