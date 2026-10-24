import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/validation'

// Anonymous "What did you pay?" submissions (price-guide phase 1).
//
// Two paths, both anonymous for the PRICE itself (no name, no contact):
//   quick    city + product + quantity + total. No clinic required.
//   detailed provider selected from search + the full field set.
//
// Guide opt-in (owner's rule: optional, never required): if the visitor
// checks the guide box and enters an email, the email is saved in
// guide_requests ONLY — never on the price report, never linked to it.
// The price stays anonymous even when the visitor opts in. What gets
// sent, and when, is decided separately; this route only saves the
// request and sends nothing.
//
// Every submission lands pending in price_reports and NOTHING from that
// table is shown publicly in phase 1: no averages, no per-clinic prices
// from reports, no "verified data" wording on report-derived numbers.
// Public display waits for moderation + aggregation rules (phase 4),
// approved separately. This route only collects and queues.
//
// Display rules the design already commits to (phase 4, not built here):
// dates display as month/year only; never show a single report as "this
// person paid $X at clinic Y" — only distributions/medians across many
// reports with sample sizes and dates; a clinic price shows only after
// enough reports that no single report identifies anyone (minimum set
// later with real data, not guessed now); give-to-get unlocking is a
// phase-4 mechanic and nothing is gated in phase 1.
//
// Writes run server side with the service-role key, the same pattern as
// quiz-submit and submitLead: the visitor's session client cannot insert
// (RLS has no anonymous policy on price_reports), and validation below
// runs before the service key touches anything. No name, phone, or
// receipt is collected in v1. Email is collected ONLY when the visitor
// opts into the guide, and it lands in guide_requests, never on the
// price report.

const TOXIN_PRODUCTS = ['botox', 'dysport', 'daxxify', 'xeomin'] as const

const futureDateCheck = (d: string) => {
    const parsed = new Date(`${d}T00:00:00Z`)
    if (Number.isNaN(parsed.getTime())) return false
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    return parsed <= today
}

const reportSchema = z
    .object({
        submission_path: z.enum(['quick', 'detailed']),
        provider_id: z.string().uuid().nullable().optional(),
        city: z.string().max(100).nullable().optional(),
        state: z.string().max(100).nullable().optional(),
        product_category: z.enum(['toxin', 'filler', 'biostimulator']),
        product: z.string().min(1, 'Please pick or enter a product').max(80, 'Product name too long'),
        quantity: z.number().positive('Please enter a number above zero').max(1000, 'Number too large'),
        quantity_unit: z.enum(['units', 'syringes', 'vials']),
        total_paid: z.number().positive('Please enter an amount above zero').max(100000, 'Amount too large'),
        treatment_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please pick a treatment date')
            .refine(futureDateCheck, 'Treatment date cannot be in the future')
            .nullable()
            .optional(),
        injector_title: z.enum(['MD', 'DO', 'NP', 'PA', 'RN', 'other']).nullable().optional(),
        membership_flag: z.boolean().nullable().optional(),
        units_disclosed_flag: z.boolean().nullable().optional(),
        guide_opt_in: z.boolean().optional(),
        guide_email: z.string().max(254).nullable().optional(),
    })
    .superRefine((data, ctx) => {
        // Path rules: detailed needs a real clinic; quick needs a city.
        if (data.submission_path === 'detailed' && !data.provider_id) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['provider_id'], message: 'Please pick a clinic from the list' })
        }
        if (data.submission_path === 'quick' && !data.city?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['city'], message: 'Please enter your city' })
        }
        // Detailed path needs the full field set; quick path needs only
        // city + product + quantity + total (validated by the base schema).
        if (data.submission_path === 'detailed') {
            if (!data.treatment_date) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['treatment_date'], message: 'Please pick a treatment date' })
            }
            if (!data.injector_title) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['injector_title'], message: 'Please pick the injector title' })
            }
            if (data.membership_flag === null || data.membership_flag === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['membership_flag'], message: 'Please say whether this was a membership or prepay' })
            }
        }
        // Category and unit must agree, and the product must fit the
        // category. Sculptra is its own biostimulator tier: it is never
        // filed as a filler.
        if (data.product_category === 'toxin') {
            if (data.quantity_unit !== 'units') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quantity_unit'], message: 'Toxins are counted in units' })
            }
            if (!(TOXIN_PRODUCTS as readonly string[]).includes(data.product.toLowerCase())) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['product'], message: 'Please pick a toxin product' })
            }
        }
        if (data.product_category === 'filler' && data.quantity_unit !== 'syringes') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quantity_unit'], message: 'Fillers are counted in syringes' })
        }
        if (data.product_category === 'biostimulator') {
            if (data.quantity_unit !== 'vials') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quantity_unit'], message: 'Sculptra is counted in vials' })
            }
            if (data.product.toLowerCase() !== 'sculptra') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['product'], message: 'This tier is for Sculptra only' })
            }
        }
        // Guide opt-in: email required and valid only when the box is
        // checked. Unchecked means no email, even if one was typed.
        if (data.guide_opt_in) {
            const email = data.guide_email?.trim()
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['guide_email'], message: 'Please enter a valid email to get the guide' })
            }
        }
    })

// Sane ranges for moderation flagging only. Outside these, the report is
// still accepted and marked flagged_outlier for a human to look at —
// never hard-rejected, because real treatments vary.
function isOutlier(category: string, quantity: number, totalPaid: number): boolean {
    if (category === 'toxin' && (quantity < 1 || quantity > 200)) return true
    if (category === 'filler' && (quantity < 0.5 || quantity > 20)) return true
    if (category === 'biostimulator' && (quantity < 0.5 || quantity > 20)) return true
    if (totalPaid < 1 || totalPaid > 50000) return true
    return false
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = reportSchema.safeParse(body)
        if (!validated.success) {
            const firstError = Object.values(validated.error.flatten().fieldErrors).flat()[0] || 'Please check your answers.'
            return NextResponse.json({ error: firstError }, { status: 400 })
        }
        const data = validated.data

        // Rate limit: 5 submissions per minute per IP. In-memory, so it
        // is per server instance in v1 — the same limit the leads form
        // already uses. Tighten with a shared store only if abuse appears.
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
        if (!checkRateLimit(`price-report:${ip}`, 5, 60000)) {
            return NextResponse.json({ error: 'Too many reports. Please wait a minute and try again.' }, { status: 429 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
        if (!supabaseUrl || !serviceKey) {
            console.error('price-reports: Supabase service credentials missing')
            return NextResponse.json({ error: 'Reporting is unavailable right now' }, { status: 500 })
        }
        const supabase = createClient(supabaseUrl, serviceKey)

        // Detailed path: the clinic must be a real row in providers. A
        // made-up id is a 400, not a stored report. The city and state
        // are filled from the provider row so detailed reports aggregate
        // with quick-path city reports later.
        let city = data.city?.trim() || null
        let state = data.state?.trim() || null
        if (data.provider_id) {
            const { data: provider, error: providerError } = await supabase
                .from('providers')
                .select('id, city, state')
                .eq('id', data.provider_id)
                .single()
            if (providerError || !provider) {
                return NextResponse.json({ error: 'Please pick a clinic from the list' }, { status: 400 })
            }
            city = provider.city ?? city
            state = provider.state ?? state
        }

        const { error } = await supabase.from('price_reports').insert({
            provider_id: data.provider_id ?? null,
            city,
            state,
            submission_path: data.submission_path,
            product_category: data.product_category,
            product: data.product.trim(),
            quantity: data.quantity,
            quantity_unit: data.quantity_unit,
            total_paid: data.total_paid,
            treatment_date: data.treatment_date ?? null,
            injector_title: data.injector_title ?? null,
            membership_flag: data.membership_flag ?? null,
            units_disclosed_flag: data.units_disclosed_flag ?? null,
            flagged_outlier: isOutlier(data.product_category, data.quantity, data.total_paid),
            status: 'pending',
            source: 'widget',
        })
        if (error) throw error

        // Guide opt-in: saved separately, never linked to the report.
        // The report is already saved at this point, so a guide-request
        // failure must never fail the report — it is logged for manual
        // recovery and the report still succeeds.
        if (data.guide_opt_in && data.guide_email?.trim()) {
            const { error: guideError } = await supabase.from('guide_requests').insert({
                email: data.guide_email.trim(),
                source: 'widget',
            })
            if (guideError) console.error('price-reports: failed to save guide request', guideError.message)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('price-reports: failed to save report', error)
        return NextResponse.json({ error: 'Could not save your report. Please try again.' }, { status: 500 })
    }
}
