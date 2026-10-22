'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'
import { checkRateLimit, sanitizeString } from '@/lib/validation'
import { NICHE } from '@/config/niche'
import { normalizeUsPhone } from '@/lib/utils/phone'

const getResend = () => {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

const getSenderEmail = () => {
    return process.env.CONTACT_EMAIL || NICHE.outreach.senderEmail;
}

const getLeadEmailHtml = (lead: any, providerName: string) => `
  <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #1a2332; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Patient Inquiry</h2>
    <p>You have received a new lead from <strong>${NICHE.siteName}</strong>.</p>
    <div style="background: #f9f9f9; padding: 20px; rounded: 10px; border-radius: 10px;">
        <p><strong>Patient Name:</strong> ${lead.full_name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
        <p><strong>Intended Treatment:</strong> ${lead.treatment_type}</p>
        <p><strong>Considerations:</strong> ${lead.current_considerations || 'N/A'}</p>
        <p><strong>Message:</strong> ${lead.message || 'No message provided'}</p>
    </div>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">View all leads in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard">Provider Dashboard</a>.</p>
  </div>
`;

const getPatientAuditEmailHtml = (lead: any) => `
  <div style="font-family: sans-serif; padding: 32px; background-color: #FAF8F5; color: #3D2B1F; border-radius: 16px; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3D2B1F; margin: 0 0 16px; font-size: 22px;">We got your request</h1>

    <p>Hello ${lead.full_name.split(' ')[0]},</p>
    <p>Thanks for asking about <strong>${lead.current_considerations || 'providers in your area'}</strong>${lead.treatment_type ? ` for ${lead.treatment_type}` : ''}.</p>

    <p>Here's what you can check before you book, whoever you choose:</p>
    <ul style="font-size: 14px; line-height: 1.6; padding-left: 20px;">
        <li><strong>License:</strong> look the injector up on your state's medical or nursing board website and confirm the license is active.</li>
        <li><strong>Who injects:</strong> ask for the injector's name and credentials (MD, DO, NP, PA or RN) and who the supervising physician is.</li>
        <li><strong>Price:</strong> ask for the price per unit and how many units they expect to use, so you can compare quotes.</li>
        <li><strong>Product:</strong> ask which brand they use (Botox, Dysport, Xeomin, Daxxify) and whether it comes from a U.S. distributor.</li>
    </ul>

    <p style="font-size: 14px; line-height: 1.6;">
        Our <a href="${NICHE.baseUrl}/botox-buyers-guide" style="color: #8A6D3B; font-weight: bold;">Botox buyer's guide</a> covers these in more detail.
    </p>

    <p style="font-size: 11px; color: #8A7F74; margin-top: 32px;">
        ${NICHE.siteName} is an independent directory. We are not a medical provider and this is not medical advice.
    </p>
  </div>
`;

// Enhanced schema with security validation
const leadSchema = z.object({
    provider_id: z.string().uuid().nullable().optional().or(z.literal('')),
    city: z.string().max(100).nullable().optional(),
    state: z.string().max(100).nullable().optional(),
    full_name: z.string()
        .max(200, 'Name too long')
        .nullable()
        .optional()
        .or(z.literal('')),
    email: z.string()
        .email('Invalid email')
        .max(254, 'Email too long'),
    phone: z.string()
        .refine((val) => !val || normalizeUsPhone(val) !== null, 'Please enter a valid 10-digit U.S. phone number')
        .nullable()
        .optional()
        .or(z.literal('')),
    treatment_type: z.string().max(100).nullable().optional(),
    budget_range: z.string().max(100).nullable().optional(),
    timeframe: z.string().max(100).nullable().optional(),
    message: z.string()
        .max(1000, 'Message too long (max 1000 characters)')
        .refine(
            (val) => !/<script|javascript:|onerror=/i.test(val || ''),
            'Message contains invalid content'
        )
        .nullable()
        .optional(),
    call_time: z.string().max(100).nullable().optional(),
    newsletter_opt_in: z.boolean().optional().default(false),
    current_considerations: z.string().max(500).nullable().optional(),
    is_first_timer: z.boolean().optional().default(true),
    client_concerns: z.array(z.string()).nullable().optional().default([]),
})

export async function submitLead(formData: FormData) {
    const supabase = await getSupabaseServer(await cookies())

    if (!supabase) {
        return { error: 'Database connection failed. Please try again later.' }
    }

    // Rate limiting: 5 submissions per minute per email
    const email = formData.get('email') as string
    if (!checkRateLimit(email, 5, 60000)) {
        return {
            error: 'Too many requests. Please try again in a minute.',
            details: null
        }
    }

    // Shared U.S. Phone Normalization Rule:
    // Exactly 10 digits or 11 digits starting with 1 normalized to 10; reject all other cases.
    const rawPhone = formData.get('phone') ? String(formData.get('phone')).trim() : ''
    const normalizedPhone = rawPhone ? normalizeUsPhone(rawPhone) : null
    if (rawPhone && !normalizedPhone) {
        return {
            error: 'Please enter a valid 10-digit U.S. phone number',
            details: { phone: ['Invalid phone number. Must be 10 digits or 11 digits starting with 1.'] }
        }
    }

    const rawData = {
        provider_id: formData.get('provider_id'),
        city: formData.get('city'),
        state: formData.get('state'),
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: normalizedPhone,
        treatment_type: formData.get('treatment_type'),
        budget_range: formData.get('budget_range'),
        timeframe: formData.get('timeframe'),
        message: formData.get('message'),
        call_time: formData.get('call_time'),
        newsletter_opt_in: formData.get('newsletter_opt_in') === 'true',
        current_considerations: formData.get('current_considerations'),
        is_first_timer: formData.get('is_first_timer') === 'true',
        client_concerns: (formData.get('client_concerns') && formData.get('client_concerns') !== 'undefined')
            ? JSON.parse(formData.get('client_concerns') as string)
            : [],
    }

    const validated = leadSchema.safeParse(rawData)

    if (!validated.success) {
        const fieldErrors = validated.error.flatten().fieldErrors
        const firstErrorMessage = Object.values(fieldErrors).flat()[0] || 'Validation failed. Please check your information.'
        return { error: firstErrorMessage, details: fieldErrors }
    }

    // Sanitize all text inputs to prevent XSS
    const sanitizedData = {
        full_name: sanitizeString(validated.data.full_name || 'Patient'),
        email: sanitizeString(validated.data.email),
        city: validated.data.city ? sanitizeString(validated.data.city) : null,
        state: validated.data.state ? sanitizeString(validated.data.state) : null,
        phone: validated.data.phone ? sanitizeString(validated.data.phone) : null,
        treatment_type: validated.data.treatment_type ? sanitizeString(validated.data.treatment_type) : null,
        budget_range: validated.data.budget_range ? sanitizeString(validated.data.budget_range) : null,
        timeframe: validated.data.timeframe ? sanitizeString(validated.data.timeframe) : null,
        message: validated.data.message ? sanitizeString(validated.data.message) : null,
        current_considerations: validated.data.current_considerations ? sanitizeString(validated.data.current_considerations) : null,
    }

    const leadInsertData: any = {
        full_name: sanitizedData.full_name,
        email: sanitizedData.email,
        city: sanitizedData.city,
        state: sanitizedData.state,
        phone: sanitizedData.phone,
        treatment_type: sanitizedData.treatment_type,
        budget_range: sanitizedData.budget_range,
        timeframe: sanitizedData.timeframe,
        message: sanitizedData.message,
        provider_id: validated.data.provider_id || null,
        current_considerations: sanitizedData.current_considerations,
        is_first_timer: validated.data.is_first_timer ?? true,
        client_concerns: validated.data.client_concerns || [],
        additional_metadata: {
            call_time: validated.data.call_time || null,
            submitted_at: new Date().toISOString()
        }
    }

    // 1. Save to Leads DB
    const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert([leadInsertData])
        .select('*, providers(name, email)')
        .single()

    if (dbError) {
        console.error('CRITICAL: Database Error in submitLead:', {
            code: dbError.code,
            message: dbError.message,
            hint: dbError.hint,
            details: dbError.details,
            inserting: leadInsertData
        })
        return { error: `Failed to submit lead: ${dbError.message}` }
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
                        from: `${NICHE.siteName} <${getSenderEmail()}>`,
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

    // 4. Update/Insert Patient Info
    try {
        const patientData = {
            email: sanitizedData.email,
            first_name: sanitizedData.full_name?.split(' ')[0] || 'Patient',
            last_name: sanitizedData.full_name?.split(' ').slice(1).join(' ') || '',
            phone: sanitizedData.phone,
            city: sanitizedData.city,
            state: sanitizedData.state,
            newsletter_opt_in: validated.data.newsletter_opt_in,
            last_lead_at: new Date().toISOString()
        }

        const { error: patientError } = await supabase
            .from('patients')
            .upsert(patientData, { onConflict: 'email' })

        if (patientError) console.error('Patient upsert error:', patientError)
    } catch (err) {
        console.error('Failed to sync patient data:', err)
    }

    // 3. Admin Notification (Manual Routing) + Patient Confirmation
    const resend = getResend();
    if (resend) {
        // Send to Patient
        try {
            await resend.emails.send({
                from: `${NICHE.siteName} <${getSenderEmail()}>`,
                to: lead.email,
                subject: `We got your request`,
                html: getPatientAuditEmailHtml(lead)
            })
        } catch (patientEmailError) {
            console.error('Error sending patient confirmation:', patientEmailError)
        }

        // Send to Admin
        const adminEmail = process.env.ADMIN_EMAIL || getSenderEmail();
        if (adminEmail) {
            try {
                await resend.emails.send({
                    from: `System <${getSenderEmail()}>`,
                    to: adminEmail,
                    subject: `🚨 LEAD ALERT: ${lead.city || 'Direct'} - ${lead.full_name}`,
                    html: getLeadEmailHtml(lead, lead.providers?.name || 'City-Wide Request')
                })
            } catch (adminEmailError) {
                console.error('Error sending admin notification:', adminEmailError)
            }
        }
    }

    return { success: true, leadId: lead.id }
}

export async function getLeadStats() {
    const supabase = await getSupabaseServer(await cookies())

    if (!supabase) {
        return {
            todayLeads: 0,
            totalLeads: 0,
            leadsPerCity: [],
            quietProviders: 0,
            pendingVerifications: 0
        }
    }
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

    // 3. Pending Verifications (Providers that exist but aren't verified)
    const { count: pendingVerifications } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .eq('verified', false)

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
        quietProviders: 0,
        pendingVerifications: pendingVerifications || 0
    }
}

export async function getRecentActivity() {
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return { leads: [], claims: [] }

    const { data: leads } = await supabase
        .from('leads')
        .select('*, providers(name)')
        .order('created_at', { ascending: false })
        .limit(10)

    const { data: claims } = await supabase
        .from('providers')
        .select('*')
        .eq('outreach_status', 'claimed_pending')
        .order('verified_at', { ascending: false })
        .limit(10)

    return { leads: leads || [], claims: claims || [] }
}
