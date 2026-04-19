
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
const FROM_EMAIL = process.env.CONTACT_EMAIL || 'hello@verifiedaesthetics.com';
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
            await supabase.from('providers').update({ outreach_status: 'failed_no_email' }).eq('id', provider.id);
            continue;
        }

        const providerPageUrl = `https://www.verifiedaesthetics.com/provider/${provider.slug}`;
        const claimUrl = `https://www.verifiedaesthetics.com/claim/${provider.slug}`;
        const badgeUrl = `https://www.verifiedaesthetics.com/badge`;

        try {
            const firstName = provider.name.split(' ')[0];
            const priceStr = provider.price_per_unit ? `$${provider.price_per_unit}` : '$14';

            // Get city context for ranking
            const { count: cityTotal } = await supabase
                .from('providers')
                .select('*', { count: 'exact', head: true })
                .eq('city', provider.city);

            const isTopProvider = (provider.score >= 80); // Top tier

            let subject = '';
            let html = '';

            if (isTopProvider) {
                // Email 1: Top Providers Honor
                subject = `question about the ${provider.city} Botox index for ${provider.name}`;
                html = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; font-size: 16px;">
                        <p>Hi ${firstName},</p>
                        
                        <p>I'm the founder of <strong>VerifiedAesthetics.com</strong>. I'm writing because your clinic, <strong>${provider.name}</strong>, has been identified as a top-scoring provider in our 2026 <strong>${provider.city}</strong> index based on our independent research into patient results and pricing transparency.</p>
                        
                        <p>Specifically, your <strong>Clarity Score™</strong> (Injector Index Score) is currently <strong>${Math.round(provider.score || 0)}/100</strong>, reflecting a high degree of patient trust and verified credentials compared to the ${cityTotal || 'other'} checked clinics in ${provider.city}.</p>
                        
                        <p>Because of this ranking, you're eligible to display the <strong>"Verified by VerifiedAesthetics"</strong> badge on your site. You can access the badge assets and your scoreboard breakdown here:</p>
                        
                        <p><a href="${badgeUrl}" style="color: #d4af37; font-weight: bold; text-decoration: underline;">${badgeUrl}</a></p>
                        
                        <p>Can you confirm if your current average unit price of <strong>${priceStr}</strong> is still the best point of contact for patients we refer from the index?</p>
                        
                        <p>Best,</p>
                        <p><strong>${YOUR_NAME}</strong><br>Founder, VerifiedAesthetics.com</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 11px; color: #999;">
                            You are receiving this because your clinic ranks in the top tier of our independent clinical index.<br>
                            To unsubscribe, reply "Unsubscribe".
                        </p>
                    </div>
                `;
            } else {
                // Email 2: Follow-up / Claim Profile
                subject = `your pricing listing on VerifiedAesthetics`;
                html = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; font-size: 16px;">
                        <p>Hi ${firstName},</p>
                        
                        <p>I'm the founder of <strong>VerifiedAesthetics.com</strong>. I'm following up on the 2026 ${provider.city} index we just published. We've had several patients reach out asking about the <strong>${priceStr}/unit</strong> listing for your clinic here:</p>
                        
                        <p><a href="${providerPageUrl}" style="color: #2563eb; text-decoration: underline;">${providerPageUrl}</a></p>
                        
                        <p>To ensure your data is 100% accurate and to unlock the full breakdown of your <strong>Clarity Score™</strong> (which covers Natural Results and Credential signals), you can claim your free profile here:</p>
                        
                        <p><a href="${claimUrl}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Claim Your Profile — It's Free</a></p>
                        
                        <p>Nobody pays for a higher score on the Index, but claiming your profile allows you to add photos and product details that patients in ${provider.city} are looking for.</p>
                        
                        <p>Best,</p>
                        <p><strong>${YOUR_NAME}</strong><br>Founder, VerifiedAesthetics.com</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 11px; color: #999;">
                            Independent research for aesthetic medicine since 2026.<br>
                            To unsubscribe, reply "Unsubscribe".
                        </p>
                    </div>
                `;
            }

            const { data, error: emailError } = await resend.emails.send({
                from: FROM_EMAIL,
                to: provider.email,
                subject: subject,
                html: html
            });

            if (emailError) {
                console.error(`Failed to email ${provider.email}:`, emailError);
                continue;
            }

            console.log(`✅ Sent ${isTopProvider ? '(Top)' : '(Follow)'} to: ${provider.email} (${provider.name})`);

            // 3. Mark as sent
            await supabase
                .from('providers')
                .update({
                    outreach_status: 'sent',
                    date_sent: new Date().toISOString()
                })
                .eq('id', provider.id);

            sentCount++;
            await new Promise(r => setTimeout(r, 300));

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
