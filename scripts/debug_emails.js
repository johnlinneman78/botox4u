const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPending() {
    console.log('--- Checking for providers with outreach_status = "not_sent" AND a valid email ---');
    const { data, error } = await supabase
        .from('providers')
        .select('name, email, outreach_status')
        .eq('outreach_status', 'not_sent')
        .not('email', 'is', null)
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data.length === 0) {
        console.log('No providers found with "not_sent" status and an email.');

        console.log('\nChecking for ANY provider with an email that hasn\'t been contacted (not "sent" or "email_1_sent"):');
        const { data: anyData, error: anyError } = await supabase
            .from('providers')
            .select('name, email, outreach_status')
            .not('email', 'is', null)
            .not('outreach_status', 'in', '("sent","email_1_sent")')
            .limit(10);

        if (anyError) {
            console.error('AnyError:', anyError);
        } else {
            anyData.forEach(p => console.log(`- ${p.name} | Status: ${p.outreach_status} | Email: ${p.email}`));
        }

    } else {
        data.forEach(p => console.log(`- ${p.name} | Status: ${p.outreach_status} | Email: ${p.email}`));
    }
}

checkPending();
