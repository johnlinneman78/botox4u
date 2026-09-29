import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for API key management
)

export async function validateApiKey(key: string | null) {
    if (!key) return { valid: false, status: 401, error: 'API key is missing' }

    const { data: apiKey, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', key)
        .single()

    if (error || !apiKey) {
        return { valid: false, status: 401, error: 'Invalid API key' }
    }

    if (!apiKey.active) {
        return { valid: false, status: 401, error: 'API key is inactive' }
    }

    if (apiKey.calls_this_month >= apiKey.call_limit) {
        return { valid: false, status: 429, error: 'Monthly limit reached. Upgrade at injectorindex.com/api-access' }
    }

    // Increment call count
    await supabase
        .from('api_keys')
        .update({ calls_this_month: (apiKey.calls_this_month || 0) + 1 })
        .eq('id', apiKey.id)

    return { valid: true, apiKey }
}
