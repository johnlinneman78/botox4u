'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'
import { checkRateLimit, sanitizeString } from '@/lib/validation'
import { NICHE } from '@/config/niche'

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
  <div style="font-family: sans-serif; padding: 40px; background-color: #0d1420; color: #ffffff; border-radius: 20px; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d4af37; margin-bottom: 5px; font-size: 24px;">Elite Audit™ Report Generated</h1>
        <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">VerifiedAesthetics Intelligence</p>
    </div>
    
    <p>Hello ${lead.full_name.split(' ')[0]},</p>
    <p>Thank you for using the <strong>VerifiedAesthetics independent Audit Portal</strong>. We are currently processing your request for the following clinic(s):</p>
    
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <h3 style="color: #d4af37; margin-top: 0;">Audit Target: ${lead.current_considerations || 'Regional Audit'}</h3>
        <p style="font-size: 14px; color: #ccc;"><strong>Status:</strong> Processing Independent Verification...</p>
        <p style="font-size: 14px; color: #ccc;"><strong>Focus:</strong> ${lead.treatment_type}</p>
    </div>

    <div style="margin: 30px 0;">
        <h4 style="color: #d4af37; font-size: 14px; text-transform: uppercase;">What happens next?</h4>
        <ul style="color: #ccc; font-size: 14px; line-height: 1.6; padding-left: 20px;">
            <li><strong>NPI Verification:</strong> We are cross-referencing these injectors against official registers.</li>
            <li><strong>Risk Sentiment Analysis:</strong> Our AI is scanning patient reviews for "over-filled" or "unnatural" mentions.</li>
            <li><strong>Price Integrity Check:</strong> We are comparing their rates against our neighborhood benchmarks.</li>
        </ul>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #ccc;">
        You will receive a <strong>Detailed Breakdown</strong> shortly if any red flags are identified. In the meantime, feel free to browse our 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/botox-buyers-guide" style="color: #d4af37; text-decoration: none; font-weight: bold;">2026 Regen Aesthetic Buyers Guide</a>.
    </p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <p style="font-size: 10px; color: #666;">
            © 2026 VerifiedAesthetics. Independent clinical data for the regenerative era.
        </p>
    </div>
  </div>
`;

// Enhanced schema with security validation
const leadSchema = z.object({
    provider_id: z.string().uuid().nullable().optional(),
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
        .regex(/^\d{10,11}$/, 'Invalid phone number')
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
        return { error: 'Validation failed', details: validated.error.flatten() }
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
                subject: `Elite Audit™ Generated: ${lead.current_considerations || 'Your Request'}`,
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
