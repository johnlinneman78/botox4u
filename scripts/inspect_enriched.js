const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectEnriched() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, enriched_attrs')
        .not('enriched_attrs', 'is', null)
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(data[0], null, 2));
}

inspectEnriched();
