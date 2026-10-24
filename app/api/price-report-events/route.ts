import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/validation'

// Anonymous measurement for the price-report widget (phase 1).
//
// Only two counts are logged here: widget views and widget starts.
// Submission counts come from price_reports rows, not from this table,
// so there is no 'submit' event. Nothing personal is logged: no clinic,
// no price, no identifier of any kind — just the event type and the page
// path, so phase 1 can report submissions per 1,000 widget views.
//
// Same service-role write pattern as the other public routes: RLS on
// price_report_events has no anonymous policy.

const eventSchema = z.object({
    event: z.enum(['view', 'start']),
    path: z.string().max(200).optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = eventSchema.safeParse(body)
        if (!validated.success) {
            return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
        }

        // Loose limit: 60 events per minute per IP. Views and starts are
        // cheap beacons; this only stops floods.
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
        if (!checkRateLimit(`price-report-event:${ip}`, 60, 60000)) {
            return NextResponse.json({ error: 'Too many events' }, { status: 429 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) {
            // Measurement must never break the widget: swallow the error
            // and report success. The widget itself does not depend on this.
            return NextResponse.json({ success: true })
        }
        const supabase = createClient(supabaseUrl, serviceKey)
        await supabase.from('price_report_events').insert({
            event_type: validated.data.event,
            page_path: validated.data.path ?? null,
        })

        return NextResponse.json({ success: true })
    } catch {
        // Same rule: a failed beacon must never surface to the visitor.
        return NextResponse.json({ success: true })
    }
}
