import { Resend } from 'resend';
import { NICHE } from '@/config/niche';

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER = process.env.CONTACT_EMAIL || `${NICHE.outreach.senderName} from ${NICHE.siteName} <${NICHE.outreach.senderEmail}>`;

export type OutreachEmailType = 'notification' | 'followup' | 'final';

export const OUTREACH_TEMPLATES = {
    notification: (provider: any) => ({
        subject: `Your ${provider.city} ${NICHE.name} listing is live`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi ${provider.name},</p>
                <p>I just added your clinic to <a href="https://${NICHE.domain}">${NICHE.siteName}</a> — a new directory helping patients in ${provider.city} find and compare ${NICHE.providerTypePlural} by price and credentials.</p>
                <p><strong>Your listing:</strong> <a href="https://${NICHE.domain}/provider/${provider.slug}">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                <p>It's showing your ${NICHE.priceUnit} pricing and linking to your reviews. No action needed — I just wanted you to know you're there.</p>
                <p>If anything looks wrong or you'd like to update it, just reply to this email.</p>
                <p>${NICHE.outreach.senderName}<br>${NICHE.outreach.senderTitle}</p>
                <p><strong>PS:</strong> We're sending leads from ${provider.city} to listed providers for free during beta. Happy to make sure yours are coming through.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #999;">
                    You are receiving this because your clinic is listed on ${NICHE.siteName}. 
                    To unsubscribe, reply "Unsubscribe" or <a href="https://${NICHE.domain}/unsubscribe?domain=${encodeURIComponent(provider.website || '')}">click here</a>.
                </p>
            </div>
        `
    }),
    followup: (provider: any) => ({
        subject: `Is your pricing accurate on ${NICHE.siteName}?`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi ${provider.name},</p>
                <p>Sent you a note a few days ago about your listing in ${provider.city}: <a href="https://${NICHE.domain}/provider/${provider.slug}">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                <p>One thing patients ask us constantly is whether the pricing they see is current. If your ${NICHE.priceUnit} price has changed or you'd like to add a range, I can update it manually — just reply with the number.</p>
                <p>Takes 2 minutes and puts you ahead of every clinic in ${provider.city} that hasn't confirmed theirs yet.</p>
                <p>${NICHE.outreach.senderName}<br>${NICHE.siteName}</p>
            </div>
        `
    }),
    final: (provider: any) => ({
        subject: `Last note about your ${provider.city} listing`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi ${provider.name},</p>
                <p>Last email from me. Your listing has been live for two weeks: <a href="https://${NICHE.domain}/provider/${provider.slug}">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                <p>If you ever want to update your pricing, add photos, or see how many patients are viewing your profile — I'm at this address.</p>
                <p>${NICHE.outreach.senderName}<br>${NICHE.siteName}</p>
            </div>
        `
    })
};

export async function sendOutreachEmail(provider: any, type: OutreachEmailType) {
    if (!provider.email && !provider.website) {
        console.error(`Cannot send outreach to ${provider.name}: No email or website.`);
        return { error: 'No contact info' };
    }

    // Heuristic: if we don't have the provider's direct email, 
    // we use a placeholder or log it for manual outreach if website-only.
    const targetEmail = provider.email;

    if (!targetEmail) {
        console.log(`[MANUAL QUEUE] ${provider.name} needs email found for website: ${provider.website}`);
        return { error: 'Needs manual email finding' };
    }

    const { subject, html } = OUTREACH_TEMPLATES[type](provider);

    try {
        const { data, error } = await resend.emails.send({
            from: SENDER,
            to: targetEmail,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { error };
        }

        return { success: true, id: data?.id };
    } catch (err) {
        console.error('Failed to send outreach:', err);
        return { error: err };
    }
}
