
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function dumpProvider() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('name', '%Houston Studios%')
        .single();

    if (error) {
        console.error('Error fetching provider:', error);
        // Try fallback to any provider
        const { data: fallback } = await supabase.from('providers').select('*').limit(1).single();
        console.log('Fallback Sample Row:', fallback);
        return;
    }

    console.log('Provider Row:', JSON.stringify(data, null, 2));
}

dumpProvider().catch(console.error);
