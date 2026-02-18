const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's default sender if custom domain isn't verified yet
const FROM_EMAIL = 'onboarding@resend.dev';
const TO_EMAIL = process.env.ADMIN_EMAIL;

async function testEmail() {
    console.log(`📧 Testing email notification...`);
    console.log(`   From: ${FROM_EMAIL}`);
    console.log(`   To:   ${TO_EMAIL}`);

    if (!TO_EMAIL) {
        console.error('❌ ADMIN_EMAIL is missing in .env.local');
        return;
    }

    try {
        const data = await resend.emails.send({
            from: `Botox-4u System <${FROM_EMAIL}>`,
            to: TO_EMAIL,
            subject: '🔔 Test Notification: Admin Alert',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #2563eb;">It Works! 🎉</h2>
                    <p>This is a test notification from your <strong>Botox-4u.com</strong> system.</p>
                    <p>If you are seeing this, your <strong>ADMIN_EMAIL</strong> is correctly configured to receive:</p>
                    <ul>
                        <li>New Patient Leads</li>
                        <li>Daily Traffic Reports</li>
                        <li>Outreach Summaries</li>
                    </ul>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        if (data.error) {
            console.error('❌ Failed to send:', data.error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log('   Check your inbox at:', TO_EMAIL);
            console.log('   (Check Spam folder just in case since it is from @resend.dev)');
        }
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
    }
}

testEmail();
