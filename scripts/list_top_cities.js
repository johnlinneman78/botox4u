require('dotenv').config({ path: '.env.prod' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listCities() {
    const { data: allProviders, error: fetchError } = await supabase
        .from('providers')
        .select('city');

    if (fetchError) {
        console.error(fetchError);
        return;
    }

    const cityCounts = allProviders.reduce((acc, p) => {
        const city = p.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
    console.log('Top Cities in Database:');
    sorted.slice(0, 30).forEach(([city, count]) => {
        console.log(`${city}: ${count}`);
    });
}

listCities();
