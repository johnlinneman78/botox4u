
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.prod' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    console.error('❌ Missing credentials. Check .env.prod');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

// Config
const BATCH_SIZE = 10;
const FROM_EMAIL = process.env.CONTACT_EMAIL || 'hello@injectorindex.com';
const YOUR_NAME = 'John Linneman';

async function sendOutreach() {
    console.log('🚀 Starting automated outreach run...');

    // 1. Get providers ready for outreach
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .eq('outreach_status', 'not_sent')
        .limit(BATCH_SIZE);

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    if (!providers || providers.length === 0) {
        console.log('✅ No pending outreach emails found.');
        return;
    }

    console.log(`found ${providers.length} providers to email.`);

    // 2. Loop and send
    let sentCount = 0;
    for (const provider of providers) {
        // Skip if no email
        if (!provider.email) {
            console.log(`Skipping ${provider.name} (no email)`);
            // Optionally mark as skipped/failed
            await supabase.from('providers').update({ outreach_status: 'failed_no_email' }).eq('id', provider.id);
            continue;
        }

        const providerPageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/provider/${provider.slug}`;

        try {
            const firstName = provider.name.split(' ')[0];
            const priceStr = provider.price_per_unit ? `$${provider.price_per_unit}` : '$12';

            const { data, error: emailError } = await resend.emails.send({
                from: FROM_EMAIL,
                to: provider.email,
                subject: `question about the ${provider.city} price listing for ${provider.name}`,
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a2332; max-width: 600px; font-size: 16px;">
                        <p>Hi ${firstName},</p>
                        
                        <p>I'm the founder of <strong>InjectorIndex.com</strong>. I've just published our 2026 local guide for clinicians in <strong>${provider.city}</strong> and I've featured your clinic here:</p>
                        
                        <p><a href="${providerPageUrl}" style="color: #2563eb; text-decoration: underline;">${providerPageUrl}</a></p>
                        
                        <p>We currently show your average price as <strong>${priceStr} / unit</strong> — can you confirm if that is still accurate?</p>
                        
                        <p>I want to make sure the patients we're sending from the directory are getting the right information before they book.</p>
                        
                        <p>Best,</p>
                        
                        <p><strong>${YOUR_NAME}</strong><br>
                        Founder, InjectorIndex.com</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 11px; color: #999;">
                            You are receiving this because your clinic is listed on InjectorIndex.com.<br>
                            To unsubscribe, reply "Unsubscribe".
                        </p>
                    </div>
                `
            });

            if (emailError) {
                console.error(`Failed to email ${provider.email}:`, emailError);
                continue;
            }

            console.log(`✅ Sent to: ${provider.email} (${provider.name})`);

            // 3. Mark as sent
            await supabase
                .from('providers')
                .update({
                    outreach_status: 'sent',
                    date_sent: new Date().toISOString()
                })
                .eq('id', provider.id);

            sentCount++;

            // Tiny delay to be nice to API limits if needed
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.error(`Unexpected error for ${provider.name}:`, err);
        }
    }

    console.log(`\n🎉 Done! Sent ${sentCount} emails.`);

    // 4. Notify Admin
    if (process.env.ADMIN_EMAIL) {
        try {
            await resend.emails.send({
                from: `System <${FROM_EMAIL}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `Outreach Summary: ${sentCount} Emails Sent`,
                html: `
                    <h1>Outreach Run Complete</h1>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Processed:</strong> ${providers.length} providers</p>
                    <p><strong>Sent:</strong> ${sentCount} emails</p>
                    <p>Check your <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard">Admin Dashboard</a> for details.</p>
                `
            });
            console.log(`📧 Summary sent to ${process.env.ADMIN_EMAIL}`);
        } catch (emailErr) {
            console.error('Failed to send summary email:', emailErr);
        }
    }
}

sendOutreach();
