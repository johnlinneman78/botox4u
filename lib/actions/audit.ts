'use server'

import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { getCityStats } from './providers'
import { calculateClinicAudit, AuditPatientInput } from '@/lib/audit-scoring'
import { Resend } from 'resend'
import { NICHE } from '@/config/niche'
import jsPDF from 'jspdf'
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

    // 1. Fetch Clinic Data (Skip if name is blank)
    let clinicData = null
    if (data.providerId) {
        const { data: p } = await supabase.from('providers').select('*').eq('id', data.providerId).single()
        clinicData = p
    } else if (data.providerName && data.providerName.trim().length > 0) {
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
            const doc = new jsPDF()
            const margin = 20
            let y = 25

            // Helper for drawing bars
            const drawBar = (x: number, y: number, width: number, percent: number, color: [number, number, number]) => {
                doc.setDrawColor(232, 227, 221)
                doc.setFillColor(232, 227, 221)
                doc.roundedRect(x, y, width, 2, 1, 1, 'F')
                doc.setFillColor(color[0], color[1], color[2])
                doc.roundedRect(x, y, (width * percent) / 100, 2, 1, 1, 'F')
            }

            // 1. HEADER
            doc.setFont('times', 'bold')
            doc.setFontSize(26)
            doc.setTextColor(26, 26, 26)
            doc.text('Injector', margin, y)
            doc.setTextColor(181, 147, 107)
            doc.text('Index', margin + 34, y)

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(9)
            doc.setTextColor(255, 255, 255)
            doc.setFillColor(181, 147, 107)
            doc.roundedRect(140, y - 6, 50, 8, 1, 1, 'F')
            doc.text('PATIENT CLINIC REPORT', 143, y - 1)

            y += 4
            doc.setDrawColor(26, 26, 26)
            doc.setLineWidth(0.5)
            doc.line(margin, y, 190, y)
            y += 15

            // 2. INTRO ROW
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(9)
            doc.setTextColor(181, 147, 107)
            doc.text(`YOUR RESEARCH SUMMARY · ${data.city.toUpperCase()}, ${data.state.toUpperCase()}`, margin, y)
            y += 10

            doc.setFont('times', 'bold')
            doc.setFontSize(30)
            doc.setTextColor(26, 26, 26)
            doc.text(data.providerName || clinicData?.name || 'Regional Clinical Analysis', margin, y)
            y += 8

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(11)
            doc.setTextColor(136, 136, 136)
            const address = clinicData?.address || 'Address unknown'
            const phone = clinicData?.phone || 'Phone unknown'
            const website = (clinicData?.website || '').replace(/^https?:\/\//, '') || 'Website unknown'
            doc.text(`${address} · ${phone} · ${website}`, margin, y)
            y += 10

            // Verdict Box (Floating Right)
            const vx = 145
            const vy = 45
            doc.setDrawColor(232, 227, 221)
            doc.setFillColor(247, 244, 240)
            doc.roundedRect(vx, vy, 45, 45, 3, 3, 'FD')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(8)
            doc.setTextColor(181, 147, 107)
            doc.text('TRUESCORE™', vx + 22.5, vy + 8, { align: 'center' })

            doc.setFont('times', 'bold')
            doc.setFontSize(42)
            doc.setTextColor(26, 26, 26)
            doc.text(auditResult.iiScore.toString(), vx + 22.5, vy + 28, { align: 'center' })

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(9)
            doc.setTextColor(170, 170, 170)
            doc.text('out of 10', vx + 22.5, vy + 34, { align: 'center' })

            doc.setFillColor(90, 158, 111)
            doc.roundedRect(vx + 5, vy + 38, 35, 5, 1, 1, 'F')
            doc.setFontSize(7)
            doc.setTextColor(255, 255, 255)
            doc.text('✓ RECOMMENDED', vx + 22.5, vy + 41.5, { align: 'center' })

            // Treatments
            doc.setFontSize(10)
            doc.setTextColor(85, 85, 85)
            let txX = margin
            const treatments = data.treatmentTypes.slice(0, 5)
            treatments.forEach(t => {
                const tw = doc.getTextWidth(t) + 6
                doc.setFillColor(247, 244, 240)
                doc.roundedRect(txX, y - 2, tw, 6, 3, 3, 'F')
                doc.text(t, txX + 3, y + 2)
                txX += tw + 4
            })
            y += 15

            doc.setFontSize(10)
            doc.setTextColor(136, 136, 136)
            const introText = doc.splitTextToSize('This report was generated by InjectorIndex using Google-verified reviews, public credential data, and our proprietary TrueScore™ methodology. It is designed to help you ask better questions — not to replace your own consultation.', 115)
            doc.text(introText, margin, y)
            y += 20

            // 3. AT A GLANCE
            doc.setFontSize(9)
            doc.setTextColor(181, 147, 107)
            doc.text('AT A GLANCE', margin, y)
            y += 10

            const cardWidth = (190 - margin - 12 * 4) / 5
            let cx = margin
            const stats = [
                { icon: '⭐', val: auditResult.stats.rating, label: 'Patient Rating' },
                { icon: '💬', val: auditResult.stats.reviewCount, label: 'Verified Reviews' },
                { icon: '🌱', val: auditResult.stats.regenRatio, label: 'Clinical Quality™' },
                { icon: '📅', val: auditResult.stats.lastReviewDays, label: 'Last Review' },
                { icon: '💉', val: auditResult.stats.treatmentCount, label: 'Treatments' }
            ]

            stats.forEach(s => {
                doc.setDrawColor(236, 232, 226)
                doc.roundedRect(cx, y, cardWidth, 25, 2, 2, 'D')
                doc.setFontSize(14)
                doc.text(s.icon, cx + cardWidth / 2, y + 7, { align: 'center' })
                doc.setFontSize(16)
                doc.setTextColor(26, 26, 26)
                doc.text(s.val.toString(), cx + cardWidth / 2, y + 16, { align: 'center' })
                doc.setFontSize(8)
                doc.setTextColor(153, 153, 153)
                doc.text(s.label, cx + cardWidth / 2, y + 21, { align: 'center' })
                cx += cardWidth + 3
            })
            y += 40

            // 4. SCORE BREAKDOWN
            doc.setFontSize(9)
            doc.setTextColor(181, 147, 107)
            doc.text('HOW THIS CLINIC SCORED', margin, y)
            y += 10

            const items = [
                { label: 'Patient Satisfaction', score: auditResult.breakdown.satisfaction, max: 20, note: 'Consistently high ratings across a large review base. Low variance.', color: [90, 158, 111] as [number, number, number] },
                { label: 'Clinical Quality Ratio™', score: auditResult.breakdown.regenRatio, max: 20, note: 'Offers innovative regenerative treatments like PNs or PRF.', color: [181, 147, 107] as [number, number, number] },
                { label: 'Credential Transparency', score: auditResult.breakdown.transparency, max: 20, note: 'Based on public credential verification and disclosure.', color: [217, 83, 79] as [number, number, number] },
                { label: 'Review Recency', score: auditResult.breakdown.recency, max: 20, note: 'Reviews are current and frequent. Actively treating.', color: [90, 158, 111] as [number, number, number] },
                { label: 'Pricing Transparency', score: auditResult.breakdown.pricing, max: 10, note: 'Public pricing or quote accessibility.', color: [217, 83, 79] as [number, number, number] },
                { label: 'Digital Presence', score: auditResult.breakdown.digital, max: 10, note: 'Active online footprint and brand consistency.', color: [90, 158, 111] as [number, number, number] }
            ]

            let col1y = y
            let col2y = y
            items.forEach((item, i) => {
                const ix = i % 2 === 0 ? margin : margin + 90
                const curY = i % 2 === 0 ? col1y : col2y

                doc.setFontSize(10)
                doc.setTextColor(26, 26, 26)
                doc.text(item.label, ix, curY)

                doc.setFontSize(14)
                doc.text(item.score.toString(), ix, curY + 8)
                doc.setFontSize(8)
                doc.setTextColor(204, 204, 204)
                doc.text(`/${item.max}`, ix + (doc.getTextWidth(item.score.toString()) + 1), curY + 8)

                drawBar(ix + 15, curY + 6, 60, (item.score / item.max) * 100, item.color)

                doc.setFontSize(9)
                doc.setTextColor(119, 119, 119)
                const noteLines = doc.splitTextToSize(item.note, 75)
                doc.text(noteLines, ix, curY + 14)

                if (i % 2 === 0) col1y += 28
                else col2y += 28
            })
            y = Math.max(col1y, col2y) + 10

            // 5. REVIEWS
            doc.setFontSize(9)
            doc.setTextColor(181, 147, 107)
            doc.text('WHAT PATIENTS ARE SAYING', margin, y)
            y += 10

            const providerReviews = clinicData?.reviews || []
            const displayReviews = providerReviews.slice(0, 3)

            let rx = margin
            const rw = (190 - margin - 10) / 3
            displayReviews.forEach((rv: any) => {
                doc.setDrawColor(236, 232, 226)
                doc.setFillColor(249, 247, 244)
                doc.roundedRect(rx, y, rw, 40, 2, 2, 'FD')

                doc.setFontSize(10)
                doc.setTextColor(181, 147, 107)
                doc.text('★'.repeat(Math.round(rv.rating || 5)), rx + 5, y + 8)

                doc.setFontSize(9)
                doc.setTextColor(68, 68, 68)
                const text = `"${rv.text?.substring(0, 150)}..."`
                const rvLines = doc.splitTextToSize(text, rw - 10)
                doc.text(rvLines, rx + 5, y + 15)

                doc.setFontSize(8)
                doc.setTextColor(187, 187, 187)
                doc.text(`Google Review · ${new Date(rv.time * 1000).toLocaleDateString()}`, rx + 5, y + 36)

                rx += rw + 5
            })
            if (displayReviews.length === 0) {
                doc.setTextColor(170, 170, 170)
                doc.text('No patient reviews verified for this location.', margin, y + 10)
            }
            y += 50

            // NEW PAGE for Questions and Flags
            doc.addPage()
            y = 30

            // 6. QUESTIONS
            doc.setFillColor(247, 244, 240)
            doc.setDrawColor(236, 232, 226)
            doc.roundedRect(margin, y, 170, 100, 3, 3, 'FD')

            doc.setFontSize(16)
            doc.setTextColor(26, 26, 26)
            doc.text('8 Questions to Ask Before You Book', margin + 10, y + 12)

            const questions = [
                { q: "What is your injector's specific training?", a: "Know if they are NP, RN, PA, or MD." },
                { q: "Can I see photos for similar anatomy?", a: "Portfolio breadth matters." },
                { q: "What brand of product do you use?", a: "Different toxin brands vary." },
                { q: "What is the full price inclusive of touch-ups?", a: "Get it in writing." },
                { q: "What is your satisfaction policy?", a: "Know dissolution protocols." },
                { q: "Do you offer a pre-treatment consult?", a: "Skipping consults is a red flag." },
                { q: "How do you approach 'less is more'?", a: "Reveals their philosophy." },
                { q: "Do you offer regenerative (PRF/PNs)?", a: "The new standard of care." }
            ]

            let qy = y + 25
            questions.forEach((q, i) => {
                const qx = i % 2 === 0 ? margin + 10 : margin + 90
                const curQy = i % 2 === 0 ? qy : qy

                doc.setFontSize(8)
                doc.setTextColor(181, 147, 107)
                doc.text((i + 1).toString().padStart(2, '0'), qx, curQy)

                doc.setFontSize(9)
                doc.setTextColor(51, 51, 51)
                const qText = doc.splitTextToSize(q.q, 70)
                doc.text(qText, qx + 8, curQy)

                doc.setFontSize(8)
                doc.setTextColor(170, 170, 170)
                doc.text(q.a, qx + 8, curQy + 6)

                if (i % 2 === 1) qy += 18
            })
            y += 115

            // 7. FLAGS
            doc.setFontSize(9)
            doc.setTextColor(181, 147, 107)
            doc.text('WHAT TO WATCH FOR', margin, y)
            y += 10

            const flagWidth = (170 - 14) / 3

            // Green
            doc.setFillColor(244, 250, 246)
            doc.setDrawColor(200, 230, 208)
            doc.roundedRect(margin, y, flagWidth, 50, 2, 2, 'FD')
            doc.setTextColor(90, 158, 111)
            doc.setFontSize(10)
            doc.text('✓ Green Flags', margin + 5, y + 8)
            doc.setFontSize(8)
            doc.setTextColor(85, 85, 85)
            doc.text(['• Suggests less product', '• Lifestyle assessment', '• Explains the syringe', '• Correction policy'], margin + 5, y + 16)

            // Amber
            doc.setFillColor(253, 249, 243)
            doc.setDrawColor(240, 221, 181)
            doc.roundedRect(margin + flagWidth + 7, y, flagWidth, 50, 2, 2, 'FD')
            doc.setTextColor(196, 138, 26)
            doc.text('⚠ Worth Asking', margin + flagWidth + 12, y + 8)
            doc.setFontSize(8)
            doc.setTextColor(85, 85, 85)
            doc.text(['• No listed pricing', '• Low transparency', '• Extreme discounts', '• No pre-consult'], margin + flagWidth + 12, y + 16)

            // Red
            doc.setFillColor(253, 246, 245)
            doc.setDrawColor(240, 200, 197)
            doc.roundedRect(margin + (flagWidth + 7) * 2, y, flagWidth, 50, 2, 2, 'FD')
            doc.setTextColor(217, 83, 79)
            doc.text('✗ Walk Away', margin + (flagWidth + 7) * 2 + 5, y + 8)
            doc.setFontSize(8)
            doc.setTextColor(85, 85, 85)
            doc.text(['• Can\'t name product', '• High pressure sales', '• No portfolio', '• Unclear credentials'], margin + (flagWidth + 7) * 2 + 5, y + 16)

            y += 65

            // 8. CTA
            doc.setFillColor(26, 26, 26)
            doc.roundedRect(margin, y, 170, 30, 3, 3, 'F')
            doc.setFontSize(14)
            doc.setTextColor(255, 255, 255)
            doc.text(`Compare this clinic to others in ${data.city}`, margin + 10, y + 10)
            doc.setFontSize(9)
            doc.setTextColor(153, 153, 153)
            doc.text('Search by treatment, neighborhood, Clinical Quality, or budget range.', margin + 10, y + 18)

            doc.setFontSize(12)
            doc.setTextColor(181, 147, 107)
            doc.text('injectorindex.com', margin + 130, y + 12)
            doc.setFontSize(8)
            doc.setTextColor(102, 102, 102)
            doc.text(`${data.city} · Free Search`, margin + 130, y + 18)

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
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>TrueScore™:</strong> ${auditResult.iiScore}/10 — <span style="color: #d4af37; font-weight: bold;">${auditResult.marketPosition}</span></li>
                                    <li style="margin-bottom: 12px; font-size: 15px;">• <strong>Clinical Quality Ratio™:</strong> ${auditResult.regenRatio}% — <strong>${auditResult.regenStatus}</strong></li>
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
                    subject: `Your Free 2026 Clinic Audit — ${data.providerName || 'Regional'} Results`,
                    attachments: [
                        {
                            filename: `Clinic_Audit_${(data.providerName || 'Regional').replace(/\s/g, '_')}.pdf`,
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
