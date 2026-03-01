import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const providerId = searchParams.get('provider_id')
    const type = searchParams.get('type')

    if (!providerId) {
        return NextResponse.json({ error: 'Provider ID required' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Log the click event (assuming we want to increment clicks_30d or just log it)
    // For now, let's increment clicks_30d as per previous Phase 2 logic if applicable,
    // or just handle the redirect. The user said "After logging the click, redirect".

    // Let's increment clicks_30d which we just added in the previous step.
    await supabase.rpc('increment_provider_clicks', { p_id: providerId })
    // If RPC doesn't exist, we can do a simple update, but RPC is safer for concurrent clicks.
    // However, I'll stick to a simple update for now to avoid creating more migrations unless needed.
    // Actually, let's just do a direct update.

    const { data: provider } = await supabase
        .from('providers')
        .select('booking_url, website, clicks_30d')
        .eq('id', providerId)
        .single()

    const targetUrl = provider?.booking_url || provider?.website || '/'

    // Increment clicks_30d
    await supabase
        .from('providers')
        .update({ clicks_30d: (provider as any)?.clicks_30d + 1 || 1 })
        .eq('id', providerId)

    return NextResponse.redirect(new URL(targetUrl))
}
