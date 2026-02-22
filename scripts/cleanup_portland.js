
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('🧹 Cleaning up remaining Portland providers...');

    const { data, error: fetchError } = await supabase
        .from('providers')
        .select('id, name, slug, price_per_unit, hero_image_url')
        .ilike('city', 'Portland');

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    for (const p of data) {
        const update = {};
        let needsUpdate = false;

        if (!p.price_per_unit) {
            update.price_per_unit = 14;
            needsUpdate = true;
        }

        if (!p.hero_image_url || p.hero_image_url.includes('photo-1629909613654-28e377c37b09')) {
            update.hero_image_url = `https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?q=80&w=800&auto=format&fit=crop&sig=${Math.random()}`;
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`Updating ${p.name}...`);
            const { error } = await supabase
                .from('providers')
                .update(update)
                .eq('id', p.id);

            if (error) console.error(`Error updating ${p.name}:`, error);
        }
    }

    console.log('✅ Portland cleanup complete.');
}

run();
