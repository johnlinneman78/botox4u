
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns in providers table:', Object.keys(data[0]));
    }

    const { data: portlandData, error: err2 } = await supabase
        .from('providers')
        .select('*')
        .ilike('city', 'Portland');

    if (err2) {
        console.error(err2);
        return;
    }

    const dataArr = portlandData;


    const noCoords = dataArr.filter(p => !p.lat || !p.lng);
    console.log(`${noCoords.length} / ${dataArr.length} providers in Portland have NO coordinates (0 or null).`);

    const byName = {};
    const byWebsite = {};
    const byPlaceId = {};

    dataArr.forEach(p => {
        if (p.name) {
            if (!byName[p.name]) byName[p.name] = [];
            byName[p.name].push(p);
        }
        if (p.website) {
            if (!byWebsite[p.website]) byWebsite[p.website] = [];
            byWebsite[p.website].push(p);
        }
        if (p.google_place_id) {
            if (!byPlaceId[p.google_place_id]) byPlaceId[p.google_place_id] = [];
            byPlaceId[p.google_place_id].push(p);
        }
    });

    console.log('\n--- Duplicate Names ---');
    for (const name in byName) {
        if (byName[name].length > 1) {
            console.log(`${name}: ${byName[name].length} duplicates`);
        }
    }

    console.log('\n--- Duplicate Websites ---');
    for (const site in byWebsite) {
        if (byWebsite[site].length > 1 && site !== 'null') {
            console.log(`${site}: ${byWebsite[site].length} duplicates`);
        }
    }

    console.log('\n--- Duplicate Place IDs ---');
    for (const pid in byPlaceId) {
        if (byPlaceId[pid].length > 1 && pid !== 'null') {
            console.log(`${pid}: ${byPlaceId[pid].length} duplicates`);
        }
    }

}

checkDuplicates();
