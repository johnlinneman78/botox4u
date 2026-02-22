const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmails() {
    console.log('--- Checking for ANY providers with valid emails ---');

    // We'll check the 'phone' column or look for fields containing '@' in enriched_attrs
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs')
        .not('outreach_status', 'eq', 'email_1_sent')
        .limit(100);

    if (error) {
        console.error('Error:', error);
        return;
    }

    let found = 0;
    providers.forEach(p => {
        // Look for any email in enriched_attrs stringified
        const attrs = JSON.stringify(p.enriched_attrs || {});
        if (attrs.includes('@')) {
            console.log(`- ${p.name} | Status: ${p.outreach_status} | Potential Email found in attrs`);
            found++;
            if (found <= 5) {
                console.log(JSON.stringify(p.enriched_attrs, null, 2));
            }
        }
    });

    console.log(`\nFound ${found} providers with potential emails in 100 checked.`);
}

checkEmails();
