
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
    console.log('--- Resetting Outreach Status for Valid Scraped Emails ---');

    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, enriched_attrs')
        .or('city.ilike.Scottsdale,city.ilike.Austin');

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    const junkDomains = ['growth99.com', 'ideationmarketingllc.com', 'sentry.io', 'example.com'];

    for (const provider of providers) {
        const email = provider.enriched_attrs?.email;
        if (email) {
            if (!junkDomains.some(d => email.toLowerCase().includes(d))) {
                console.log(`Resetting ${provider.name} (${email}) to 'pending'...`);
                await supabase
                    .from('providers')
                    .update({ outreach_status: 'pending' })
                    .eq('id', provider.id);
            } else {
                console.log(`Still skipping junk email for ${provider.name}: ${email}`);
            }
        }
    }

    console.log('--- Reset Complete ---');
}

run();
