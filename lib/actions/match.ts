'use server'

import { Resend } from 'resend'
import { NICHE } from '@/config/niche'

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY
    if (!apiKey) return null
    return new Resend(apiKey)
}

const getSenderEmail = () => {
    return process.env.CONTACT_EMAIL || NICHE.outreach.senderEmail
}

export async function submitMatchEmailRequest(data: {
    email: string
    city: string
    treatments: string[]
    matches: any[]
}) {
    console.log('Match email requested for:', data.email)

    const resend = getResend()
    if (!resend) {
        console.error('No Resend/email API key configured')
        return { success: false, error: 'Email service inactive' }
    }

    try {
        const result = await resend.emails.send({
            from: `${NICHE.siteName} <${getSenderEmail()}>`,
            to: data.email,
            subject: `Your Practitioner Matches in ${data.city}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Your Practitioner Matches for ${data.city}</h2>
                    <p>Based on your selected treatments <strong>(${data.treatments.join(', ')})</strong>, we've identified the top practitioners in your area according to our true clinical quality data.</p>
                    
                    ${data.matches.map((m, i) => `
                        <div style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #111;">#${i + 1}: ${m.name}</h3>
                            <p><strong>TrueScore™:</strong> ${m.score_total || 65}</p>
                            <p><strong>Botox Price:</strong> $${m.price_per_unit || '—'}</p>
                            <a href="https://www.injectorindex.com/provider/${m.slug}" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">View Profile</a>
                        </div>
                    `).join('')}

                    <p style="font-size: 12px; color: #777; margin-top: 30px;">
                        InjectorIndex.com - Independent Data & Matching
                    </p>
                </div>
            `
        })

        return { success: true, message: 'Email sent' }
    } catch (e: any) {
        console.error('Failed to send match email:', e)
        return { success: false, error: e.message }
    }
}

export async function submitRegenTop5Request(data: {
    email: string
    city: string
}) {
    console.log('Regen Top 5 email requested for:', data.email)

    const resend = getResend()
    if (!resend) {
        console.error('No Resend/email API key configured')
        return { success: false, error: 'Email service inactive' }
    }

    try {
        const result = await resend.emails.send({
            from: `${NICHE.siteName} <${getSenderEmail()}>`,
            to: data.email,
            subject: `The Top 5 Regen Providers in ${data.city}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Your Exclusive Top 5 Regen List</h2>
                    <p>Thank you for requesting the top regenerative medicine providers in <strong>${data.city}</strong>.</p>
                    <p>Our team is generating a live data report for your area based on the latest TrueScore™ analytics. This report will highlight the top clinic metrics including innovation adoption, "natural result" consistency, and verified credentials.</p>
                    <p>You will receive your full independent breakdown shortly!</p>
                    
                    <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #d4af37; background: #f9f9f9;">
                        <strong>Tip:</strong> While you wait, check out our latest intelligence reports on how to avoid the "overfilled" look and why data matters more than paid reviews.
                        <br/><br/>
                        <a href="https://www.injectorindex.com/blog" style="color: #d4af37; text-decoration: none; font-weight: bold;">Read the Guides →</a>
                    </div>

                    <p style="font-size: 12px; color: #777; margin-top: 30px;">
                        InjectorIndex.com - Independent Data & Matching
                    </p>
                </div>
            `
        })

        return { success: true, message: 'Top 5 Email sent' }
    } catch (e: any) {
        console.error('Failed to send Top 5 email:', e)
        return { success: false, error: e.message }
    }
}
