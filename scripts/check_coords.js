require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCoords() {
    const { data, error, count } = await supabase
        .from('providers')
        .select('id, lat, lng', { count: 'exact' });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const hasCoords = data.filter(p => p.lat && p.lng).length;
    console.log(`Total providers: ${data.length}`);
    console.log(`Providers with coordinates: ${hasCoords}`);
    console.log(`Providers missing coordinates: ${data.length - hasCoords}`);
}

checkCoords();
