const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExactQuery() {
    console.log('--- Checking exact filter in DB ---');
    const { data, error } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs')
        .in('outreach_status', ['not_sent', 'no_email', 'notified'])
        .not('enriched_attrs', 'is', null)
        .limit(100);

    if (error) {
        console.error('Error:', error);
        return;
    }

    let foundWithEmail = 0;
    data.forEach(p => {
        if (p.enriched_attrs?.email) {
            console.log(`- ${p.name} | Status: ${p.outreach_status} | Email: ${p.enriched_attrs.email}`);
            foundWithEmail++;
        }
    });

    console.log(`\nFound ${foundWithEmail} in sample of ${data.length} with emails.`);
}

checkExactQuery();
