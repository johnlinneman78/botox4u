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

// Enhanced schema with security validation
const leadSchema = z.object({
    provider_id: z.string().uuid(),
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
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        treatment_type: formData.get('treatment_type'),
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
        phone: validated.data.phone ? sanitizeString(validated.data.phone) : undefined,
        treatment_type: validated.data.treatment_type ? sanitizeString(validated.data.treatment_type) : undefined,
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
    const { data: provider } = await supabase
        .from('providers')
        .select('name, email')
        .eq('id', lead.provider_id)
        .single()

    // 3. Send Email Notification
    if (provider?.email) {
        const resend = getResend();
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Botox Directory <leads@botox-directory.com>',
                    to: provider.email,
                    subject: `New Patient Lead: ${lead.full_name}`,
                    html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1a2332;">New Patient Inquiry</h2>
            <p>You have received a new lead from the National Botox Directory.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Patient Name:</strong> ${lead.full_name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
            <p><strong>Treatment:</strong> ${lead.treatment_type}</p>
            <p><strong>Message:</strong> ${lead.message || 'No message provided'}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">View all leads in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard">Provider Dashboard</a>.</p>
          </div>
        `
                })
            } catch (emailError) {
                console.error('Error sending email:', emailError)
            }
        }
    }

    return { success: true, leadId: lead.id }
}
