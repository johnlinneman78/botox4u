
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.prod' });

import { createClient } from '@supabase/supabase-js';
import { sendOutreachEmail } from '../lib/email/outreach';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function triggerOutreach() {
    console.log('--- Target: Scottsdale & Austin Track B Outreach ---');

    // 1. Fetch targets
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .or('city.ilike.Scottsdale,city.ilike.Austin')
        .gte('rating', 4.7)
        .gte('review_count', 75)
        .not('website', 'is', null);
    // .eq('display_status', 'live'); // Column missing in DB schema

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    if (!providers || providers.length === 0) {
        console.log('No Track B targets found for Scottsdale or Austin.');
        return;
    }

    console.log(`Found ${providers.length} targets.`);

    for (const provider of providers) {
        // Skip if already notified or no_email
        if (provider.outreach_status === 'notified' || provider.outreach_status === 'no_email') {
            console.log(`Skipping ${provider.name} (Status: ${provider.outreach_status})`);
            continue;
        }

        const email = provider.email || provider.enriched_attrs?.email;

        if (!email) {
            console.log(`No email for ${provider.name}. Updating status to 'no_email'.`);
            await supabase
                .from('providers')
                .update({ outreach_status: 'no_email' })
                .eq('id', provider.id);
            continue;
        }

        // Filter out obvious junk/agency emails
        const junkDomains = ['growth99.com', 'ideationmarketingllc.com', 'sentry.io', 'example.com'];
        if (junkDomains.some(domain => email.toLowerCase().includes(domain))) {
            console.log(`Skipping junk/agency email for ${provider.name}: ${email}`);
            await supabase
                .from('providers')
                .update({ outreach_status: 'no_email' }) // Flag as no_email to skip in future
                .eq('id', provider.id);
            continue;
        }

        // Send Email
        console.log(`Sending notification to ${provider.name} (${email})...`);
        const result = await sendOutreachEmail({ ...provider, email }, 'notification');

        if (result.success) {
            console.log(`Successfully sent to ${provider.name}. Updating status.`);
            await supabase
                .from('providers')
                .update({
                    outreach_status: 'notified',
                    date_sent: new Date().toISOString()
                })
                .eq('id', provider.id);
        } else {
            console.error(`Failed to send to ${provider.name}:`, result.error);
        }

        // Add 1s delay to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('--- Outreach Loop Complete ---');
}

triggerOutreach();
