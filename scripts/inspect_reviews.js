const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectReviews() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, top_reviews')
        .not('top_reviews', 'is', null)
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(data[0], null, 2));
}

inspectReviews();
