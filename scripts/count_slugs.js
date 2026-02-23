
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function countSlugs() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('providers')
        .select('treatment_slugs');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const counts = {};
    data.forEach(row => {
        (row.treatment_slugs || []).forEach(slug => {
            counts[slug] = (counts[slug] || 0) + 1;
        });
    });

    console.log('Treatment Slug Counts:', counts);
}

countSlugs().catch(console.error);
