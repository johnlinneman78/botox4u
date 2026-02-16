'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

const getResend = () => {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

const leadSchema = z.object({
    provider_id: z.string().uuid(),
    full_name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    treatment_type: z.string().optional(),
    message: z.string().optional(),
})

export async function submitLead(formData: FormData) {
    const supabase = await getSupabaseServer(await cookies())

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

    // 1. Save to DB
    const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert([validated.data])
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
