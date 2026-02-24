'use server'

import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { getCityStats } from './providers'
import { calculateClinicAudit, AuditPatientInput } from '@/lib/audit-scoring'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const getResend = () => {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

const getSenderEmail = () => {
    return process.env.CONTACT_EMAIL || NICHE.outreach.senderEmail;
}

export async function submitAuditRequest(data: AuditPatientInput) {
    console.log('Audit requested for:', data.providerName, 'in', data.city)
    const supabase = await getSupabaseServer(await cookies())
    if (!supabase) return { error: 'Database connection failed' }

    // 1. Fetch Clinic Data
    let clinicData = null
    if (data.providerId) {
        const { data: p } = await supabase.from('providers').select('*').eq('id', data.providerId).single()
        clinicData = p
    } else {
        const { data: results } = await supabase
            .from('providers')
            .select('*')
            .ilike('name', `%${data.providerName}%`)
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
            provider_name: data.providerName || (clinicData?.name),
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
            const doc = new jsPDF()
            const margin = 20
            let y = 30

            doc.setFontSize(22)
            doc.setTextColor(26, 35, 50)
            doc.text('2026 CLINIC SAFETY AUDIT', 105, y, { align: 'center' })
            y += 10
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(1)
            doc.line(margin, y, 190, y)
            y += 20

            doc.setFontSize(12)
            doc.setTextColor(100, 100, 100)
            doc.text(`Clinic: ${data.providerName}`, margin, y)
            y += 8
            doc.text(`Location: ${data.city}, ${data.state}`, margin, y)
            y += 8
            doc.text(`Audit Date: ${new Date().toLocaleDateString()}`, margin, y)
            y += 8
            doc.text(`Requested By: ${data.email}`, margin, y)
            y += 20

            doc.setFontSize(16)
            doc.setTextColor(26, 35, 50)
            doc.text('OVERALL ASSESSMENT', margin, y)
            y += 10

            doc.setFontSize(14)
            doc.text(`II-Score™: ${auditResult.iiScore}/10`, margin + 10, y)
            y += 8
            doc.text(`Market Position: ${auditResult.marketPosition}`, margin + 10, y)
            y += 8
            doc.text(`Regen-Ratio™: ${auditResult.regenRatio}% — ${auditResult.regenStatus}`, margin + 10, y)
            y += 8
            doc.text(`Price Positioning: ${auditResult.priceBenchmark.label}`, margin + 10, y)
            y += 8
            doc.text(`Natural Results Alignment: ${auditResult.naturalAlignment}`, margin + 10, y)
            y += 20

            doc.addPage()
            y = 30
            doc.setFontSize(16)
            doc.text('DETAILED BREAKDOWN', margin, y)
            y += 15

            doc.setFontSize(14)
            doc.text('━━━ REGEN-RATIO™ ANALYSIS ━━━', margin, y)
            y += 10
            doc.setFontSize(12)
            doc.text(`${data.providerName} offers ${auditResult.regenRatio}% regenerative treatments`, margin + 5, y)
            y += 8
            doc.text(`vs. ${100 - auditResult.regenRatio}% traditional HA filler`, margin + 5, y)
            y += 15

            doc.setFontSize(14)
            doc.text('━━━ NATURAL INTEGRITY RATING ━━━', margin, y)
            y += 10
            doc.setFontSize(12)
            doc.text(`Patient Review Sentiment: ${clinicData?.score?.breakdown?.naturalIntegrity || 'Unknown'}/10`, margin + 5, y)
            y += 8
            doc.text(`Your Goal: ${data.primaryGoal}`, margin + 5, y)
            y += 8
            doc.text(`Alignment: ${auditResult.naturalAlignment}`, margin + 5, y)
            y += 15

            doc.setFontSize(14)
            doc.text('━━━ PRICING ANALYSIS ━━━', margin, y)
            y += 10
            doc.setFontSize(12)
            if (auditResult.priceBenchmark.quoted) {
                doc.text(`Your Quoted Price: $${auditResult.priceBenchmark.quoted}`, margin + 5, y)
                y += 8
            }
            doc.text(`${data.city} Market Average: $${auditResult.priceBenchmark.average}/unit`, margin + 5, y)
            y += 8
            doc.text(`Assessment: ${auditResult.priceBenchmark.label}`, margin + 5, y)
            y += 20

            doc.setFontSize(16)
            doc.text('YOUR PERSONALIZED RECOMMENDATIONS', margin, y)
            y += 10
            doc.setFontSize(11)
            const splitRec = doc.splitTextToSize(auditResult.recommendations, 170)
            doc.text(splitRec, margin, y)

            const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

            const resend = getResend()
            if (resend) {
                const htmlBody = `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #d4af37; margin-bottom: 5px; font-size: 24px;">Elite Audit™ Report Ready</h1>
                                <p style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">InjectorIndex Intelligence</p>
                            </div>
                            
                            <p>Hi there,</p>
                            <p>Your independent clinic audit for <strong>${data.providerName}</strong> in ${data.city} is ready for review.</p>
                            
                            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; border: 1px solid #e9ecef; margin: 25px 0;">
                                <h3 style="margin-top: 0; color: #1a2332;">Key Findings:</h3>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>II-Score™:</strong> ${auditResult.iiScore}/10 — <span style="color: #d4af37; font-weight: bold;">${auditResult.marketPosition}</span></li>
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>Regen-Ratio™:</strong> ${auditResult.regenRatio}% — <strong>${auditResult.regenStatus}</strong></li>
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>Pricing:</strong> <strong>${auditResult.priceBenchmark.label}</strong></li>
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>Natural Alignment:</strong> <strong>${auditResult.naturalAlignment}</strong></li>
                                </ul>
                            </div>

                            <p style="background: #fff8e1; border-left: 4px solid #d4af37; padding: 15px; font-style: italic; color: #1a2332; font-size: 14px;">
                                "${auditResult.recommendations}"
                            </p>

                            <p style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL}/botox/${data.state.toLowerCase()}/${data.city.toLowerCase()}" style="display: inline-block; background: #d4af37; color: #0d1420; padding: 16px 32px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px;">Browse Top Rated Providers</a>
                            </p>

                            <p style="font-size: 13px; line-height: 1.6; color: #666;">
                                We have attached the full <strong>PDF Breakdown</strong> which includes detailed market benchmarks, review sentiment analysis, and alternative provider recommendations in your area.
                            </p>

                            <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
                            
                            <div style="text-align: center;">
                                <p style="font-size: 11px; color: #999;">
                                    © 2026 InjectorIndex. Independent data for the regenerative medicine era.<br>
                                    Scottsdale • New York • Los Angeles • Miami
                                </p>
                            </div>
                        </div>
                    `;

                await resend.emails.send({
                    from: `InjectorIndex Team <${getSenderEmail()}>`,
                    to: data.email,
                    subject: `Your Free 2026 Clinic Audit — ${data.providerName} Results`,
                    attachments: [
                        {
                            filename: `Clinic_Audit_${data.providerName.replace(/\s/g, '_')}.pdf`,
                            content: pdfBuffer
                        }
                    ],
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
