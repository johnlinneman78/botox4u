
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
    const { count: pending, error: e1 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .eq('outreach_status', 'not_sent');

    const { count: sent, error: e2 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .eq('outreach_status', 'sent');

    const { count: total, error: e3 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Outreach Status:`);
    console.log(`- Total Providers: ${total}`);
    console.log(`- Already Sent:    ${sent}`);
    console.log(`- Pending:         ${pending}`);
}

checkStatus();
