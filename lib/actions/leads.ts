'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'
import { checkRateLimit, sanitizeString } from '@/lib/validation'

const getResend = () => {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

const getLeadEmailHtml = (lead: any, providerName: string) => `
  <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #1a2332;">New Patient Inquiry</h2>
    <p>You have received a new lead from <strong>Botox-4-U.com</strong> for <strong>${providerName}</strong>.</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p><strong>Patient Name:</strong> ${lead.full_name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
    <p><strong>Treatment:</strong> ${lead.treatment_type}</p>
    <p><strong>Budget:</strong> ${lead.budget_range || 'N/A'}</p>
    <p><strong>Timeframe:</strong> ${lead.timeframe || 'N/A'}</p>
    <p><strong>Message:</strong> ${lead.message || 'No message provided'}</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">View all leads in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard">Provider Dashboard</a>.</p>
  </div>
`;

// Enhanced schema with security validation
const leadSchema = z.object({
    provider_id: z.string().uuid().optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    full_name: z.string()
        .min(2, 'Name is required')
        .max(100, 'Name too long')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
    email: z.string()
        .email('Invalid email')
        .max(254, 'Email too long'),
    phone: z.string()
        .regex(/^\d{10,11}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    treatment_type: z.string().max(100).optional(),
    budget_range: z.string().max(100).optional(),
    timeframe: z.string().max(100).optional(),
    message: z.string()
        .max(1000, 'Message too long (max 1000 characters)')
        .refine(
            (val) => !/<script|javascript:|onerror=/i.test(val || ''),
            'Message contains invalid content'
        )
        .optional(),
})

export async function submitLead(formData: FormData) {
    const supabase = await getSupabaseServer(await cookies())

    // Rate limiting: 5 submissions per minute per email
    const email = formData.get('email') as string
    if (!checkRateLimit(email, 5, 60000)) {
        return {
            error: 'Too many requests. Please try again in a minute.',
            details: null
        }
    }

    const rawData = {
        provider_id: formData.get('provider_id'),
        city: formData.get('city'),
        state: formData.get('state'),
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        treatment_type: formData.get('treatment_type'),
        budget_range: formData.get('budget_range'),
        timeframe: formData.get('timeframe'),
        message: formData.get('message'),
    }

    const validated = leadSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: 'Validation failed', details: validated.error.flatten() }
    }

    // Sanitize all text inputs to prevent XSS
    const sanitizedData = {
        ...validated.data,
        full_name: sanitizeString(validated.data.full_name),
        email: sanitizeString(validated.data.email),
        city: validated.data.city ? sanitizeString(validated.data.city) : undefined,
        state: validated.data.state ? sanitizeString(validated.data.state) : undefined,
        phone: validated.data.phone ? sanitizeString(validated.data.phone) : undefined,
        treatment_type: validated.data.treatment_type ? sanitizeString(validated.data.treatment_type) : undefined,
        budget_range: validated.data.budget_range ? sanitizeString(validated.data.budget_range) : undefined,
        timeframe: validated.data.timeframe ? sanitizeString(validated.data.timeframe) : undefined,
        message: validated.data.message ? sanitizeString(validated.data.message) : undefined,
    }

    // 1. Save to DB
    const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert([sanitizedData])
        .select('*, providers(name, email)')
        .single()

    if (dbError) {
        console.error('Error submitting lead:', dbError)
        return { error: 'Failed to submit lead. Please try again.' }
    }

    // 2. Fetch Provider Email
    if (lead.provider_id) {
        const { data: provider } = await supabase
            .from('providers')
            .select('name, email')
            .eq('id', lead.provider_id)
            .single()

        // Send Email Notification to specific provider
        if (provider?.email) {
            const resend = getResend();
            if (resend) {
                try {
                    await resend.emails.send({
                        from: 'Botox-4-U.com <leads@botox-4-u.com>',
                        to: provider.email,
                        subject: `New Patient Lead: ${lead.full_name}`,
                        html: getLeadEmailHtml(lead, provider.name)
                    })
                } catch (emailError) {
                    console.error('Error sending email:', emailError)
                }
            }
        }
    } else if (lead.city) {
        // City-wide lead notification logic
        console.log(`City lead received for ${lead.city}:`, lead.id)
    }

    // 3. Admin Notification (Manual Routing)
    const resend = getResend();
    if (resend && process.env.ADMIN_EMAIL) {
        try {
            await resend.emails.send({
                from: 'System <notifications@botox-4-u.com>',
                to: process.env.ADMIN_EMAIL,
                subject: `🚨 LEAD ALERT: ${lead.city || 'Direct'} - ${lead.full_name}`,
                html: getLeadEmailHtml(lead, lead.providers?.name || 'City-Wide Request')
            })
        } catch (adminEmailError) {
            console.error('Error sending admin notification:', adminEmailError)
        }
    }

    return { success: true, leadId: lead.id }
}

export async function getLeadStats() {
    const supabase = await getSupabaseServer(await cookies())
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Today's Leads
    const { count: todayLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    // 2. Total Leads
    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

    // 3. Leads by City (Aggregated)
    const { data: cityData } = await supabase
        .from('leads')
        .select(`
            id,
            providers (
                city
            )
        `)

    const leadsPerCity = (cityData || []).reduce((acc: any, curr: any) => {
        const city = curr.providers?.city || 'Unknown'
        acc[city] = (acc[city] || 0) + 1
        return acc
    }, {})

    const sortedCities = Object.entries(leadsPerCity)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 10)

    return {
        todayLeads: todayLeads || 0,
        totalLeads: totalLeads || 0,
        leadsPerCity: sortedCities,
        // Simple heuristic for now
        quietProviders: 0
    }
}
