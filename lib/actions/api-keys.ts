'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function requestApiKey(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name || !email) {
        return { success: false, error: 'Name and email are required' }
    }

    // Generate a random-ish readable key
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
    const apiKey = `II_PRO_${randomStr}`

    const { error } = await supabase
        .from('api_keys')
        .insert({
            key: apiKey,
            owner_name: name,
            owner_email: email,
            tier: 'FREE',
            call_limit: 100,
            active: false // Approval required as per task
        })

    if (error) {
        console.error('API Key Request Error:', error)
        return { success: false, error: 'Failed to request key.' }
    }

    // Note: Email notification to hello@verifiedaesthetics.com should be added here
    // using something like Resend (which seems to be in the project)

    return { success: true }
}
