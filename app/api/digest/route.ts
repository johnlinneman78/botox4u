import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'

// Daily digest: one email to John each morning summarizing what came
// in over the last 24 hours — quiz signups (the guide list) and clinic
// quote requests (the sellable leads). John does not check dashboards,
// so the digest is the dashboard: it lands in his Gmail.
//
// Trigger: Vercel Cron hits GET /api/digest?run=1 once a day (see
// vercel.json). A plain GET with no run=1 returns a preview only —
// counts plus masked emails — and sends nothing, so the route can be
// opened safely to check it is alive. Sending never takes an address
// from the request: the recipient is always ADMIN_EMAIL, falling back
// to John's inbox, and the sender is the verified domain.
//
// Outcome logging follows the quiz-submit lesson: the Resend SDK
// returns API rejections as result.error instead of throwing, so the
// result is always inspected and logged, never just awaited.
export const dynamic = 'force-dynamic'

type LeadRow = {
    id: string
    email: string
    full_name: string | null
    city: string | null
    treatment_type: string | null
    provider_id: string | null
    created_at: string
    providers: { name: string | null } | { name: string | null }[] | null
    additional_metadata: Record<string, unknown> | null
}

function maskEmail(email: string): string {
    const at = email.indexOf('@')
    if (at <= 1) return '***'
    return `${email.slice(0, 2)}***${email.slice(at)}`
}

function ptDate(d: Date): string {
    return d.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function ptTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' })
}

export async function GET(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) {
            console.error('digest: Supabase service credentials missing')
            return NextResponse.json({ error: 'Digest unavailable' }, { status: 500 })
        }
        const supabase = createClient(supabaseUrl, serviceKey)

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { data: rows, error } = await supabase
            .from('leads')
            .select('id, email, full_name, city, treatment_type, provider_id, created_at, providers(name), additional_metadata')
            .gte('created_at', since)
            .order('created_at', { ascending: false })
        if (error) throw error

        const leads = (rows || []) as LeadRow[]
        const quotes = leads.filter((l) => !!l.provider_id)
        const quizzes = leads.filter((l) => !l.provider_id)

        const providerName = (l: LeadRow) =>
            Array.isArray(l.providers) ? l.providers[0]?.name ?? null : l.providers?.name ?? null
        const quoteLines = quotes.map((l) =>
            `  - ${ptTime(l.created_at)} — ${l.full_name || 'No name'} (${l.email}) asked ${providerName(l) || 'a clinic'} about ${l.treatment_type || 'treatment'} in ${l.city || 'unknown city'}`)
        const quizLines = quizzes.map((l) =>
            `  - ${ptTime(l.created_at)} — ${l.email} (${l.treatment_type || 'treatment'}, ${l.city || 'unknown tier'} tier)`)

        const body = [
            `InjectorIndex daily digest — ${ptDate(new Date())} (last 24 hours)`,
            '',
            `Quote requests: ${quotes.length}`,
            ...(quoteLines.length ? quoteLines : ['  (none)']),
            '',
            `Quiz signups: ${quizzes.length}`,
            ...(quizLines.length ? quizLines : ['  (none)']),
            '',
            `Total new leads: ${leads.length}`,
        ].join('\n')

        const url = new URL(req.url)
        const cronHeader = req.headers.get('x-vercel-cron')
        const cronAgent = (req.headers.get('user-agent') || '').includes('vercel-cron')
        const shouldSend = url.searchParams.get('run') === '1' || !!cronHeader || cronAgent
        if (!shouldSend) {
            // Preview only: counts plus masked emails, nothing sent.
            return NextResponse.json({
                preview: true,
                since,
                quoteRequests: quotes.length,
                quizSignups: quizzes.length,
                sample: [
                    ...quotes.slice(0, 3).map((l) => ({ type: 'quote', email: maskEmail(l.email), provider: providerName(l) })),
                    ...quizzes.slice(0, 3).map((l) => ({ type: 'quiz', email: maskEmail(l.email) })),
                ],
            })
        }

        const apiKey = process.env.RESEND_API_KEY?.trim()
        if (!apiKey) {
            console.error('digest: no RESEND_API_KEY, digest not sent')
            return NextResponse.json({ error: 'Email unavailable' }, { status: 500 })
        }
        const resend = new Resend(apiKey)
        const to = process.env.ADMIN_EMAIL?.trim() || 'urielpro78@gmail.com'
        const sender = process.env.FROM_EMAIL?.trim() || NICHE.outreach.senderEmail
        const { data: sent, error: sendError } = await resend.emails.send({
            from: `InjectorIndex <${sender}>`,
            to: [to],
            subject: `InjectorIndex daily digest — ${ptDate(new Date())} (${quotes.length} quotes, ${quizzes.length} quizzes)`,
            text: body,
        })
        if (sendError) {
            console.error('digest: send rejected:', sendError)
            return NextResponse.json({ error: 'Digest send failed' }, { status: 500 })
        }
        console.log('digest: sent:', sent?.id, 'to', to, `(${quotes.length} quotes, ${quizzes.length} quizzes)`)
        return NextResponse.json({ success: true, sentId: sent?.id, quoteRequests: quotes.length, quizSignups: quizzes.length })
    } catch (error) {
        console.error('digest error:', error)
        return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
    }
}
