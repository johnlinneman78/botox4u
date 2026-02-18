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
