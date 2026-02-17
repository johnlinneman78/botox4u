
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    console.error('❌ Missing credentials. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

// Config
const BATCH_SIZE = 50;
const FROM_EMAIL = 'hello@botox-4-u.com'; // Or whatever verified domain you have
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
            const { data, error: emailError } = await resend.emails.send({
                from: FROM_EMAIL,
                to: provider.email,
                subject: `Your ${provider.name} is featured in ${provider.city} Botox directory`,
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <p>Hi,</p>
                        <p>We've listed <strong>${provider.name}</strong> in our Botox directory for <strong>${provider.city}</strong> with your real pricing and clinic photos.</p>
                        <p><a href="${providerPageUrl}" style="color: #2563eb; font-weight: bold;">View Your Page Here</a></p>
                        <p>During our beta launch:</p>
                        <ul>
                            <li>Free featured visibility in ${provider.city}</li>
                            <li>Direct patient leads routing to your inbox</li>
                        </ul>
                        <p>Reply "yes" if you'd like to claim this listing or update any details.</p>
                        <br>
                        <p>Best,</p>
                        <p><strong>${YOUR_NAME}</strong><br>Botox-4-U.com Directory</p>
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
}

sendOutreach();
