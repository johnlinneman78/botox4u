
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log('Searching for New York providers...');
    const { data, error } = await supabase
        .from('providers')
        .select('id, name, city, state, address')
        .or('city.ilike.%New York%,state.ilike.%New York%,address.ilike.%New York%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} providers.`);
    if (data.length > 0) {
        console.log('Sample Data:', data.slice(0, 3));
    }

    // Check specifically for "NYC" or "Manhattan" if nothing found
    if (data.length === 0) {
        const { data: alt } = await supabase
            .from('providers')
            .select('city')
            .limit(1000);
        const cities = [...new Set(alt.map(p => p.city))].filter(c => c && c.toLowerCase().includes('new'));
        console.log('Similar cities in DB:', cities);
    }
}

run();
