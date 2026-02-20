import { Resend } from 'resend';

import { NICHE } from '@/config/niche';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, providerName: string, claimUrl: string) {
    try {
        if (!resend) {
            console.error('Resend not configured (RESEND_API_KEY missing)');
            return { success: false, error: 'Resend not configured' };
        }
        const { data, error } = await resend.emails.send({
            from: `${NICHE.siteName} <hello@${NICHE.domain}>`,
            to: [email],
            subject: `Verify Ownership: ${providerName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a2332;">
                    <h1 style="color: #1a2332; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Verify Your Clinic Ownership</h1>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Hello, thank you for claiming the listing for <strong>${providerName}</strong> on ${NICHE.siteName}.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                        To complete your claim and unlock features like <strong>Photo Priority Logic</strong> and <strong>Warm Leads Tracking</strong>, please click the button below to verify your email.
                    </p>
                    <a href="${claimUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        VERIFY & CONTINUE TO DASHBOARD
                    </a>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                    <p style="font-size: 12px; color: #64748b;">
                        If you did not request this, please ignore this email.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send verification email:', err);
        return { success: false, error: err };
    }
}
