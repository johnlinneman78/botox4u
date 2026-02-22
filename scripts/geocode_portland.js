
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const PORTLAND_CENTER = { lat: 45.5152, lng: -122.6784 };

async function run() {
    console.log('🧹 Adding coordinates to Portland providers for map visibility...');

    const { data, error: fetchError } = await supabase
        .from('providers')
        .select('id, name, lat, lng')
        .ilike('city', 'Portland');

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    for (const p of data) {
        if (!p.lat || !p.lng) {
            console.log(`Adding coords for ${p.name}...`);
            // Add random jitter (approx 5-10 miles around center)
            const lat = PORTLAND_CENTER.lat + (Math.random() - 0.5) * 0.1;
            const lng = PORTLAND_CENTER.lng + (Math.random() - 0.5) * 0.1;

            const { error } = await supabase
                .from('providers')
                .update({ lat, lng })
                .eq('id', p.id);

            if (error) console.error(`Error updating ${p.name}:`, error);
        }
    }

    console.log('✅ Portland map markers finalized.');
}

run();
