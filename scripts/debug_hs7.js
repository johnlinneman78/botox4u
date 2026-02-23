
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function dumpHS7() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('name', '%Houston Studios%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach((row, i) => {
        console.log(`\n--- Row ${i + 1} ---`);
        for (const [key, value] of Object.entries(row)) {
            if (value !== null && value !== undefined) {
                console.log(`${key}:`, value);
            }
        }
    });
}

dumpHS7().catch(console.error);
