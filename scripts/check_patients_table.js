require('dotenv').config({ path: '.env.prod' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
    // This is a bit tricky with Supabase JS directly if pg_tables is not exposed.
    // Usually we just try to select from the table we expect.
    const { data, error } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

    if (error && error.code === '42P01') {
        console.log('❌ "patients" table does NOT exist.');
    } else if (error) {
        console.error('Error checking table:', error);
    } else {
        console.log('✅ "patients" table exists.');
    }
}

listTables();
