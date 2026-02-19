import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER = process.env.CONTACT_EMAIL || 'John from Botox 4U <hello@botox-4u.com>';

export type OutreachEmailType = 'notification' | 'followup' | 'value_add';

export const OUTREACH_TEMPLATES = {
    notification: (provider: any) => ({
        subject: `You're already listed on a new Botox directory for ${provider.city}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi,</p>
                <p>We’ve listed <strong>${provider.name}</strong> in our new Botox directory for <strong>${provider.city}</strong>, with your real per-unit pricing and clinic photos so patients can compare injectors transparently.</p>
                <p><strong>Your Page:</strong> <a href="https://botox-4u.com/provider/${provider.slug}">https://botox-4u.com/provider/${provider.slug}</a></p>
                <p>During beta, we’ll send any leads from ${provider.city} to you for free and highlight clinics that are up-front about pricing and credentials.</p>
                <p>If you’d like to update your info or see how many people are viewing your listing, just reply and I’ll set up access.</p>
                <p>Best,<br><br><strong>John Linneman</strong><br>Founder, Botox 4U</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #999;">
                    You are receiving this because your clinic is listed on Botox-4U.com. 
                    To unsubscribe, reply "Unsubscribe" or <a href="https://botox-4u.com/unsubscribe?domain=${encodeURIComponent(provider.website || '')}">click here</a>.
                </p>
            </div>
        `
    }),
    followup: (provider: any) => ({
        subject: `Quick question about ${provider.name}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi again,</p>
                <p>I sent over a link to your new listing on Botox 4U a few days ago. Did you have a chance to check it out?</p>
                <p><a href="https://botox-4u.com/provider/${provider.slug}">View your listing here</a></p>
                <p>We're seeing a lot of interest in <strong>${provider.city}</strong> lately. I'd love to make sure your pricing and "Black Diamond" status (if applicable) are 100% accurate before we start routing more patient inquiries your way.</p>
                <p>Any updates needed?</p>
                <p>Best,<br><br><strong>John Linneman</strong><br>Founder, Botox 4U</p>
            </div>
        `
    }),
    value_add: (provider: any) => ({
        subject: `Patient search activity in ${provider.city}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px;">
                <p>Hi,</p>
                <p>Quick update — your listing for <strong>${provider.name}</strong> is performing well. We've had a surge of searches for "Botox in ${provider.city}" this week.</p>
                <p>I noticed you don't have a "New Patient Special" listed on your profile yet. Clinics with a small first-time offer (like $50 off or $10/unit) are currently getting 3x more clicks in our beta tests.</p>
                <p>Would you like me to add a special offer to your page? Just let me know what works for you.</p>
                <p>Best,<br><br><strong>John Linneman</strong><br>Founder, Botox 4U</p>
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
