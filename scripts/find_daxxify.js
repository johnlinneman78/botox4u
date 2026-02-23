
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function findDaxxify() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1000);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const matches = data.filter(row => {
        return JSON.stringify(row).toLowerCase().includes('daxxify');
    });

    console.log(`Found ${matches.length} matches for "Daxxify"`);
    if (matches.length > 0) {
        const first = matches[0];
        console.log('Match Column Breakdown:');
        for (const [key, value] of Object.entries(first)) {
            if (JSON.stringify(value).toLowerCase().includes('daxxify')) {
                console.log(`${key}:`, value);
            }
        }
    }
}

findDaxxify().catch(console.error);
