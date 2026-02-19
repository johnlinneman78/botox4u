require('dotenv').config({ path: '.env.prod' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPatientsColumns() {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns in "patients":', Object.keys(data[0]));
    } else {
        console.log('Table is empty. Checking via RPC or information_schema?');
        // Let's try to just insert a dummy and delete it? No, just use a common column.
        console.log('Attempting to fetch column info via SQL-ish select...');
    }
}

checkPatientsColumns();
