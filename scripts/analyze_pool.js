const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countPotential() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, outreach_status, enriched_attrs')
        .in('outreach_status', ['not_sent', 'no_email', 'notified'])
        .not('enriched_attrs', 'is', null);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const withEmails = data.filter(p => p.enriched_attrs?.email);
    console.log(`Potential candidates with emails: ${withEmails.length}`);

    // Check distribution of status for these
    const counts = {};
    withEmails.forEach(p => {
        counts[p.outreach_status] = (counts[p.outreach_status] || 0) + 1;
    });
    console.log('Status Counts for candidates:', counts);
}

countPotential();
