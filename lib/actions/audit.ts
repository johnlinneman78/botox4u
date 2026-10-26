'use server'

import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { getCityStats } from './providers'
import { calculateClinicAudit, AuditPatientInput, AuditResult } from '@/lib/audit-scoring'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'
import { z } from 'zod'
import { checkRateLimit, sanitizeString } from '@/lib/validation'

const getResend = () => {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

const getSenderEmail = () => {
    return process.env.CONTACT_EMAIL || NICHE.outreach.senderEmail;
}

const auditInputSchema = z.object({
    email: z.string().email().max(254),
    providerId: z.string().uuid().optional().or(z.literal('')),
    providerName: z.string().max(150),
    city: z.string().max(100),
    state: z.string().max(50),
    treatmentTypes: z.array(z.string().max(60)).max(15),
    primaryGoal: z.string().max(200),
    priceQuoted: z.string().max(50).optional(),
    foundThrough: z.string().max(100).optional(),
})

export async function submitAuditRequest(rawData: AuditPatientInput) {
    // Public server action: validate and escape everything before it reaches
    // the database or an email sent from our domain.
    const parsed = auditInputSchema.safeParse(rawData)
    if (!parsed.success) return { error: 'Invalid request' }
    if (!checkRateLimit(`audit:${parsed.data.email.toLowerCase()}`, 3, 60 * 60 * 1000)) {
        return { error: 'Too many requests' }
    }
    const data: AuditPatientInput = {
        ...parsed.data,
        providerId: parsed.data.providerId || undefined,
        providerName: sanitizeString(parsed.data.providerName),
        city: sanitizeString(parsed.data.city),
        state: sanitizeString(parsed.data.state),
        treatmentTypes: parsed.data.treatmentTypes.map(sanitizeString),
        primaryGoal: sanitizeString(parsed.data.primaryGoal),
        priceQuoted: parsed.data.priceQuoted ? sanitizeString(parsed.data.priceQuoted) : undefined,
        foundThrough: parsed.data.foundThrough ? sanitizeString(parsed.data.foundThrough) : undefined,
    }
    console.log('Audit requested for:', data.providerName, 'in', data.city)
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return { error: 'Database connection failed' }

    // 1. Fetch Clinic Data (Skip if name is blank)
    let clinicData = null
    if (data.providerId) {
        const { data: p } = await supabase.from('providers').select('*').eq('id', data.providerId).single()
        clinicData = p
    } else if (data.providerName && data.providerName.trim().length > 0) {
        const { data: results } = await supabase
            .from('providers')
            .select('*')
            .ilike('name', `%${data.providerName.replace(/[%_]/g, '')}%`)
            .ilike('city', data.city)
            .order('listing_tier', { ascending: false })
            .limit(1)
        clinicData = results?.[0]
    }

    const cityStats = await getCityStats(data.city)

    let alternatives: any[] = []
    try {
        const { data: altData } = await supabase
            .from('providers')
            .select('*')
            .eq('city', data.city)
            .neq('id', clinicData?.id || '00000000-0000-0000-0000-000000000000')
            .order('score', { ascending: false })
            .limit(3)

        alternatives = altData || []
    } catch (e) {
        console.warn('Failed to fetch alternatives:', e)
    }

    const auditResult = calculateClinicAudit(data, clinicData, cityStats)
    auditResult.alternatives = alternatives.map(a => ({
        name: a.name,
        slug: a.slug,
        score: (a.score / 10).toFixed(1),
        regen_ratio: a.regen_ratio || 0,
        price_per_unit: a.price_per_unit || a.botox_price_per_unit || 15
    }))

    const { data: audit, error: dbError } = await supabase
        .from('clinic_audits')
        .insert([{
            patient_email: data.email,
            provider_id: clinicData?.id,
            provider_name: data.providerName || (clinicData?.name) || 'Regional Audit',
            city: data.city,
            state: data.state,
            treatment_types: data.treatmentTypes,
            primary_goal: data.primaryGoal,
            price_quoted: data.priceQuoted,
            found_through: data.foundThrough,
            ii_score: auditResult.iiScore,
            regen_ratio: auditResult.regenRatio,
            price_benchmark_status: auditResult.priceBenchmark.label,
            natural_alignment: auditResult.naturalAlignment,
            audit_data: auditResult
        }])
        .select()
        .single()

    if (dbError) {
        console.error('Audit DB error:', dbError)
        return { error: 'Failed to record audit' }
    }

    const sendProcess = async () => {
        try {
            const resend = getResend()
            if (resend) {
                const htmlBody = generateAuditEmailHTML(auditResult, data, clinicData)

                await resend.emails.send({
                    from: `VerifiedAesthetics Audit Team <${getSenderEmail()}>`,
                    to: data.email,
                    subject: `Clinic Audit Report: ${data.providerName || 'Regional Results'}`,
                    html: htmlBody
                })
            }

            await supabase.from('clinic_audits').update({ status: 'sent' }).eq('id', audit.id)

            try {
                const patientData = {
                    email: data.email,
                    full_name: 'Patient (Audit)',
                    phone: '',
                    city: data.city,
                    state: data.state,
                    last_lead_at: new Date().toISOString()
                }

                await supabase
                    .from('patients')
                    .upsert(patientData, { onConflict: 'email' })
            } catch (err) {
                console.error('Failed to sync patient data:', err)
            }

            await supabase.from('leads').insert([{
                email: data.email,
                full_name: 'Patient (Audit)',
                city: data.city,
                state: data.state,
                provider_id: clinicData?.id,
                treatment_type: data.treatmentTypes[0],
                message: `AUTOGENERATED AUDIT: ${JSON.stringify(auditResult)}`,
                current_considerations: data.providerName,
                additional_metadata: { audit_id: audit.id }
            }])

        } catch (err) {
            console.error('Audit processing task failed:', err)
            await supabase.from('clinic_audits').update({ status: 'failed' }).eq('id', audit.id)
        }
    }

    sendProcess().catch(console.error)

    return { success: true, auditId: audit.id }
}

export function generateAuditEmailHTML(auditResult: AuditResult, patientData: AuditPatientInput, clinicData: any) {
    const { iiScore, marketPosition, regenStatus, priceBenchmark, naturalAlignment, stats, breakdown, recommendations, alternatives } = auditResult;
    const { providerName, city, state } = patientData;

    const brandGold = '#d4af37';
    const bgGray = '#f8f4f0';
    const darkBlue = '#0d1420';

    return `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;">
            <!-- Header -->
            <div style="background-color: ${darkBlue}; padding: 40px 20px; text-align: center; border-bottom: 5px solid ${brandGold};">
                <h1 style="color: ${brandGold}; margin: 0; font-size: 28px; letter-spacing: 1px;">Injector<span style="color: #ffffff;">Index</span></h1>
                <p style="color: rgba(255,255,255,0.6); font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">Independent Clinic Audit</p>
            </div>

            <!-- Main Score -->
            <div style="padding: 40px 20px; text-align: center;">
                <p style="text-transform: uppercase; font-size: 11px; font-weight: bold; color: ${brandGold}; margin-bottom: 15px; letter-spacing: 2px;">Research Summary for ${city}, ${state}</p>
                <div style="background-color: ${bgGray}; display: inline-block; padding: 40px 60px; border-radius: 40px; border: 1px solid rgba(212,175,55,0.15);">
                    <p style="margin: 0; font-size: 13px; color: #999; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Clarity Score™</p>
                    <h2 style="margin: 5px 0; font-size: 80px; color: ${darkBlue}; font-family: Georgia, serif; line-height: 1;">${iiScore}</h2>
                    <p style="margin: 0; font-size: 12px; color: #bbb; font-weight: bold;">OUT OF 10</p>
                    <div style="margin-top: 20px; background-color: #5a9e6f; color: white; padding: 10px 24px; border-radius: 30px; font-size: 12px; font-weight: bold; display: inline-block; letter-spacing: 0.5px;">
                        ✓ ${marketPosition.toUpperCase()}
                    </div>
                </div>
            </div>

            <!-- Clinic Info Section -->
            <div style="padding: 0 20px 30px 20px;">
                <div style="background-color: white; border: 1px solid #eee; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="background-color: #fafbfc; padding: 20px; border-bottom: 1px solid #eee;">
                         <h2 style="margin: 0; font-size: 20px; color: ${darkBlue};">${providerName || 'Regional Analysis'}</h2>
                         <p style="margin: 5px 0 0 0; font-size: 13px; color: #888;">${clinicData?.address || 'Verified Clinical Data'}</p>
                    </div>
                    <div style="padding: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #666;">Market Pricing</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; text-align: right; font-weight: bold; color: ${darkBlue};">${priceBenchmark.label}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #666;">Regen Ratio™</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; text-align: right; font-weight: bold; color: ${darkBlue};">${regenStatus}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; font-size: 14px; color: #666;">Results Philosophy</td>
                                <td style="padding: 12px 0; font-size: 14px; text-align: right; font-weight: bold; color: ${darkBlue};">${naturalAlignment}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Breakdown -->
            <div style="padding: 0 20px 40px 20px;">
                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: ${brandGold}; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 25px;">How This Clinic Scored</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    ${Object.entries(breakdown).map(([key, value]) => `
                        <div style="background-color: white; border: 1px solid #eee; padding: 15px; border-radius: 16px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <span style="font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span style="font-size: 14px; font-weight: 800; color: ${darkBlue};">${value}<span style="font-weight: 400; color: #ccc; font-size: 11px;">/${key === 'satisfaction' || key === 'activity' || key === 'credentials' || key === 'innovation' ? 20 : 10}</span></span>
                            </div>
                            <div style="height: 5px; background-color: #f5f5f5; border-radius: 3px; overflow: hidden;">
                                <div style="height: 100%; background-color: ${brandGold}; width: ${(value / (key === 'satisfaction' || key === 'activity' || key === 'credentials' || key === 'innovation' ? 20 : 10)) * 100}%; border-radius: 3px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recommendations -->
            <div style="padding: 0 20px 40px 20px;">
                <div style="background-color: ${darkBlue}; color: #ffffff; padding: 35px; border-radius: 32px; border-left: 8px solid ${brandGold}; box-shadow: 0 10px 30px rgba(13,20,32,0.15);">
                    <h3 style="color: ${brandGold}; margin-top: 0; font-size: 15px; text-transform: uppercase; letter-spacing: 2px;">Clinical Audit Recommendation</h3>
                    <p style="font-size: 16px; font-style: italic; line-height: 1.8; margin: 0; color: rgba(255,255,255,0.95); font-weight: 300;">
                        "${recommendations}"
                    </p>
                </div>
            </div>

            <!-- Alternatives -->
            ${alternatives && alternatives.length > 0 ? `
            <div style="padding: 0 20px 40px 20px;">
                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: ${brandGold}; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 25px;">Highly Ranked Alternatives in ${city}</h3>
                ${alternatives.map(alt => `
                    <div style="background-color: white; border: 1px solid #eee; border-radius: 20px; padding: 15px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <p style="margin: 0; font-weight: bold; color: ${darkBlue}; font-size: 15px;">${alt.name}</p>
                            <p style="margin: 2px 0 0 0; font-size: 12px; color: #888;">Clarity Score™: <span style="color: ${brandGold}; font-weight: bold;">${alt.score}</span> • Average Pricing: $${alt.price_per_unit}/unit</p>
                        </div>
                        <a href="https://www.verifiedaesthetics.com/provider/${alt.slug}" style="background-color: ${bgGray}; color: ${darkBlue}; padding: 8px 15px; border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: bold;">View Profile</a>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Questions to Ask -->
            <div style="padding: 50px 20px; background-color: ${bgGray}; text-align: center; border-radius: 40px 40px 0 0;">
                <h3 style="margin-top: 0; color: ${darkBlue}; font-size: 22px;">Technical Consultation Check</h3>
                <p style="font-size: 14px; color: #888; margin-bottom: 35px; max-width: 400px; margin-left: auto; margin-right: auto;">Ask these 2 questions to test the technical proficiency and safety standards of any clinic.</p>
                
                <div style="text-align: left; background-color: #ffffff; padding: 35px; border-radius: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 25px;">
                        <p style="margin: 0; font-size: 15px; font-weight: bold; color: ${darkBlue};">1. "What is your specific medical approach to natural integrity?"</p>
                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #777; line-height: 1.6;"><strong>Why ask:</strong> Top-tier injectors focus on muscle modulation rather than just 'filling' lines. Their answer reveals their philosophy.</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="margin: 0; font-size: 15px; font-weight: bold; color: ${darkBlue};">2. "How many units of Polynucleotides or PRF do you perform weekly?"</p>
                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #777; line-height: 1.6;"><strong>Why ask:</strong> High volume in regenerative treatments indicates a clinic that is current with 2026 biological standards of care.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f0f0f0; pt: 20px;">
                        <a href="https://www.verifiedaesthetics.com/methodology" style="font-size: 13px; color: ${brandGold}; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">View Full Specialist Methodology →</a>
                    </div>
                </div>
            </div>

            <!-- Final CTA -->
            <div style="padding: 50px 20px; text-align: center; background-color: ${darkBlue}; color: #ffffff;">
                <h3 style="margin-top: 0; font-size: 24px; color: white;">Ranked by Data. Not Ads.</h3>
                <p style="color: rgba(255,255,255,0.6); font-size: 15px; margin-bottom: 35px; max-width: 450px; margin-left: auto; margin-right: auto;">Browser all ${city} clinics filtered by Clinical Quality, Clarity Score™, and Real-World Pricing.</p>
                <a href="https://www.verifiedaesthetics.com/injectors/${state.toLowerCase()}/${city.toLowerCase().replace(/ /g, '-')}" 
                   style="background-color: ${brandGold}; color: ${darkBlue}; padding: 20px 45px; border-radius: 50px; text-decoration: none; font-weight: 900; display: inline-block; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                    Explore Top ${city} Clinics
                </a>
                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="color: rgba(255,255,255,0.2); font-size: 10px; line-height: 1.8;">
                        © 2026 VerifiedAesthetics. All rights reserved.<br>
                        Independent Audit Unit • Scottsdale, AZ<br>
                        You are receiving this report because you requested a free clinical audit.
                    </p>
                </div>
            </div>
        </div>
    `;
}
