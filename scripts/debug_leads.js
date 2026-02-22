const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBatch() {
    console.log('--- Checking first 10 providers by review_count ---');
    const { data, error } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs, review_count')
        .in('outreach_status', ['not_sent', 'no_email', 'notified'])
        .order('review_count', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(p => {
        const email = p.enriched_attrs?.email || 'none';
        console.log(`- ${p.name} | Reviews: ${p.review_count} | Status: ${p.outreach_status} | Email: ${email}`);
    });

    console.log('\n--- Searching for ANY provider in this set that HAS an email ---');
    const { data: found, error: foundError } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs, review_count')
        .in('outreach_status', ['not_sent', 'no_email', 'notified'])
        .not('enriched_attrs', 'is', null)
        .order('review_count', { ascending: false })
        .limit(200);

    if (foundError) {
        console.error('FoundError:', foundError);
    } else {
        const withEmails = found.filter(p => p.enriched_attrs?.email);
        console.log(`Found ${withEmails.length} providers with emails in top 200.`);
        withEmails.slice(0, 5).forEach(p => {
            console.log(`- ${p.name} (${p.enriched_attrs.email})`);
        });
    }
}

checkBatch();
