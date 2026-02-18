require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'providers' });

    if (error) {
        // Fallback: try a direct query to see if it fails on lat/lng
        const { error: queryError } = await supabase.from('providers').select('lat').limit(1);
        if (queryError) {
            console.error('Column check failed:', queryError.message);
        } else {
            console.log('Columns lat/lng exist.');
        }
    } else {
        console.log('Columns:', data);
    }
}

async function runRaw() {
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Fetch error:', error);
    } else {
        console.log('Available columns in first row:', Object.keys(data[0] || {}));
    }
}

runRaw();
