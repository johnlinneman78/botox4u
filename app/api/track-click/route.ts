import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const providerId = searchParams.get('provider_id')
    const type = searchParams.get('type')

    if (!providerId) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    try {
        const supabase = createRouteHandlerClient({ cookies })

        const { data: provider, error: fetchError } = await supabase
            .from('providers')
            .select('id, name, booking_url, website, clicks_30d')
            .eq('id', providerId)
            .single()

        if (fetchError || !provider) {
            console.error('Track click: Provider not found or error', providerId, fetchError)
            return NextResponse.redirect(new URL('/', req.url))
        }

        // Silent metric increment
        try {
            await supabase
                .from('providers')
                .update({ clicks_30d: (provider.clicks_30d || 0) + 1 })
                .eq('id', providerId)
        } catch (updateErr) {
            console.error('Failed to increment clicks_30d', updateErr)
        }

        let targetUrl = provider.booking_url || provider.website || '/'

        // Protocol normalization for external URLs
        if (targetUrl !== '/' && !targetUrl.startsWith('/') && !targetUrl.startsWith('http')) {
            targetUrl = `https://${targetUrl}`
        }

        // Use req.url as base if targetUrl is relative
        return NextResponse.redirect(new URL(targetUrl, req.url))
    } catch (err) {
        console.error('Fatal track click error:', err)
        return NextResponse.redirect(new URL('/', req.url))
    }
}
