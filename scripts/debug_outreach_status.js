const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStatus() {
    console.log('--- Checking Outreach Status distribution ---');
    const { data, error } = await supabase
        .from('providers')
        .select('outreach_status');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const counts = {};
    data.forEach(p => {
        const s = p.outreach_status || 'null';
        counts[s] = (counts[s] || 0) + 1;
    });

    console.log('Status Counts:');
    console.table(counts);

    console.log('\n--- Checking for potential contacts ---');
    const { data: contacts, error: contactError } = await supabase
        .from('providers')
        .select('name, email_primary, outreach_status, enriched_attrs')
        .not('outreach_status', 'eq', 'email_1_sent')
        .limit(10);

    if (contactError) {
        console.error('Contact Error:', contactError);
        return;
    }

    contacts.forEach(c => {
        const email = c.email_primary || c.enriched_attrs?.email_playbook?.primary || 'none';
        console.log(`- ${c.name} | Status: ${c.outreach_status} | Email: ${email}`);
    });
}

checkStatus();
