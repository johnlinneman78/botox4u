const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSpecificStatus() {
    console.log('--- Checking Beverly Hills Rejuvenation Center ---');
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('name', '%Beverly Hills Rejuvenation Center%')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  Status: ${p.outreach_status}`);
        console.log(`  Enriched Email: ${p.enriched_attrs?.email || 'none'}`);
        console.log(`  Review Count: ${p.review_count}`);
        console.log('-------------------');
    });

    console.log('\n--- Checking for ANY not_sent with email in enriched_attrs ---');
    const { data: anyData, error: anyError } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs')
        .eq('outreach_status', 'not_sent')
        .limit(100);

    if (anyError) {
        console.error('AnyError:', anyError);
    } else {
        let count = 0;
        anyData.forEach(p => {
            if (p.enriched_attrs?.email) {
                console.log(`- ${p.name} | Email: ${p.enriched_attrs.email}`);
                count++;
            }
        });
        console.log(`Total 'not_sent' with email in sample: ${count}`);
    }
}

checkSpecificStatus();
