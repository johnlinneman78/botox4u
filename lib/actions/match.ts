'use server'

import { Resend } from 'resend'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { NICHE } from '@/config/niche'
import { checkRateLimit, sanitizeString } from '@/lib/validation'

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY
    if (!apiKey) return null
    return new Resend(apiKey)
}

const getSenderEmail = () => {
    return process.env.CONTACT_EMAIL || NICHE.outreach.senderEmail
}

// This is a public server action, so nothing from the browser is trusted:
// the recipient is validated, text is escaped, and provider details are
// looked up server-side by slug instead of taken from the request.
const matchEmailSchema = z.object({
    email: z.string().email().max(254),
    city: z.string().max(100),
    treatments: z.array(z.string().max(60)).max(10),
    matches: z.array(z.object({ slug: z.string().max(200) }).passthrough()).max(5),
})

export async function submitMatchEmailRequest(data: {
    email: string
    city: string
    treatments: string[]
    matches: any[]
}) {
    const parsed = matchEmailSchema.safeParse(data)
    if (!parsed.success) {
        return { success: false, error: 'Invalid request' }
    }
    const { email, city, treatments, matches } = parsed.data

    if (!checkRateLimit(`match-email:${email.toLowerCase()}`, 3, 60 * 60 * 1000)) {
        return { success: false, error: 'Too many requests' }
    }

    const resend = getResend()
    if (!resend) {
        console.error('No Resend/email API key configured')
        return { success: false, error: 'Email service inactive' }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    if (!url || !key) {
        console.error('Match email: Supabase config missing')
        return { success: false, error: 'Service unavailable' }
    }

    const slugs = matches.map(m => m.slug)
    const { data: providers, error } = slugs.length
        ? await createClient(url, key)
            .from('providers')
            .select('name, slug, score_total, price_per_unit')
            .in('slug', slugs)
        : { data: [], error: null }

    if (error) {
        console.error('Match email: provider lookup failed:', error.message)
        return { success: false, error: 'Service unavailable' }
    }

    // Keep the order the quiz showed
    const ordered = slugs
        .map(s => (providers || []).find(p => p.slug === s))
        .filter(Boolean) as { name: string; slug: string; score_total: number | null; price_per_unit: number | null }[]

    const safeCity = sanitizeString(city)
    const safeTreatments = treatments.map(sanitizeString).join(', ')

    try {
        await resend.emails.send({
            from: `${NICHE.siteName} <${getSenderEmail()}>`,
            to: email,
            subject: `Your provider matches in ${city.replace(/[\r\n]/g, ' ')}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Your provider matches for ${safeCity}</h2>
                    <p>Based on your selected treatments <strong>(${safeTreatments})</strong>, here are the providers that matched your answers.</p>

                    ${ordered.map((m, i) => `
                        <div style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #111;">#${i + 1}: ${sanitizeString(m.name)}</h3>
                            ${m.score_total ? `<p><strong>Clarity Score™:</strong> ${Number(m.score_total)}</p>` : ''}
                            ${m.price_per_unit ? `<p><strong>Botox price:</strong> $${Number(m.price_per_unit)}/unit</p>` : ''}
                            <a href="${NICHE.baseUrl}/provider/${encodeURIComponent(m.slug)}" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">View Profile</a>
                        </div>
                    `).join('')}

                    <p style="font-size: 12px; color: #777; margin-top: 30px;">
                        ${NICHE.siteName} - Independent provider data
                    </p>
                </div>
            `
        })

        return { success: true, message: 'Email sent' }
    } catch (e: any) {
        console.error('Failed to send match email:', e)
        return { success: false, error: 'Failed to send' }
    }
}
