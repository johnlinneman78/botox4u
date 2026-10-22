import { Resend } from 'resend';
import { NICHE } from '@/config/niche';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');
const SENDER = process.env.CONTACT_EMAIL || `${NICHE.outreach.senderName} from ${NICHE.siteName} <${NICHE.outreach.senderEmail}>`;

export type OutreachEmailType = 'notification' | 'followup' | 'final';

export const OUTREACH_TEMPLATES = {
    notification: (provider: any) => {
        const subject = `Patients in ${provider.city} are looking for you on ${NICHE.siteName}`;

        return {
            subject: subject,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a2332; max-width: 600px; font-size: 16px;">
                    <p>Hi ${provider.name},</p>
                    
                    <p>Patients in <strong>${provider.city}</strong> are already finding your practice on <strong>${NICHE.siteName}</strong> — the independent index for aesthetic medicine providers ranked by verified credentials, transparent pricing, and natural results.</p>
                    
                    <p>Your listing is live right now, but your pricing shows as <strong>"Not Listed"</strong> and patients filter past that.</p>
                    
                    <p>Claiming your profile is free and takes 2 minutes. No credit card, no commitment — just your practice represented accurately.</p>
                    
                    <p style="margin: 30px 0;">
                        <a href="https://${NICHE.domain}/claim/${provider.slug}" style="background-color: #1a2332; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Claim Your Free Profile →</a>
                    </p>
                    
                    <p>Best,</p>
                    
                    <p><strong>${NICHE.outreach.senderName}</strong><br>
                    Founder, ${NICHE.siteName}<br>
                    <span style="color: #64748b; font-size: 14px;">Built for patients. Trusted by providers.</span></p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 11px; color: #999;">
                        You are receiving this because your clinic is listed on ${NICHE.siteName}.<br>
                        To unsubscribe, reply "Unsubscribe" or <a href="https://${NICHE.domain}/unsubscribe?id=${provider.id}" style="color: #999;">click here</a>.
                    </p>
                </div>
            `
        };
    },
    followup: (provider: any) => ({
        subject: `Is your pricing accurate on ${NICHE.siteName}?`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; color: #1a2332;">
                        ${NICHE.brandName}<span style="color: #d4af37;">${NICHE.brandSuffix}</span><span style="font-weight: 400; font-size: 16px; color: #94a3b8;">.com</span>
                    </div>
                </div>
                <p>Hi ${provider.name},</p>
                <p>Sent you a note a few days ago about your listing in ${provider.city}: <a href="https://${NICHE.domain}/provider/${provider.slug}" style="color: #1a2332; text-decoration: underline;">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                <p>One thing patients ask us constantly is whether the pricing they see is current. If your ${NICHE.priceUnit} price has changed or you'd like to add a range, I can update it manually — just reply with the number.</p>
                <p>Takes 2 minutes and puts you ahead of every clinic in ${provider.city} that hasn't confirmed theirs yet.</p>
                <p>${NICHE.outreach.senderName}<br>${NICHE.siteName}</p>
            </div>
        `
    }),
    final: (provider: any) => ({
        subject: `Last note about your ${provider.city} listing`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; color: #1a2332;">
                        ${NICHE.brandName}<span style="color: #d4af37;">${NICHE.brandSuffix}</span><span style="font-weight: 400; font-size: 16px; color: #94a3b8;">.com</span>
                    </div>
                </div>
                <p>Hi ${provider.name},</p>
                <p>Last email from me. Your listing has been live for two weeks: <a href="https://${NICHE.domain}/provider/${provider.slug}" style="color: #1a2332; text-decoration: underline;">https://${NICHE.domain}/provider/${provider.slug}</a></p>
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
