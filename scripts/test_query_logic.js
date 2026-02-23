
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSearch() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const query = 'HS7';
    console.log(`Testing search for: "${query}"`);

    // Try with targeted initials for acronym/shorthand
    const acronymQuery = `${query.split('').join('%')}%`;
    console.log(`Acronym Query: "${acronymQuery}"`);

    const { data: data1, error: error1 } = await supabase
        .from('providers')
        .select('name')
        .ilike('name', acronymQuery)
        .limit(5);

    console.log('Acronym Name Match Result:', { data: data1, length: data1?.length, error: error1 });

    // Try with business_type
    const { data: data2, error: error2 } = await supabase
        .from('providers')
        .select('name, business_type')
        .or(`name.ilike.%${query}%,business_type.ilike.%${query}%`)
        .limit(5);

    console.log('Business Type Result:', { length: data2?.length, error: error2 });

    // Try without cast but inside OR? (Probably won't work)
    const { data: data3, error: error3 } = await supabase
        .from('providers')
        .select('name, treatment_slugs')
        .or(`name.ilike.%${query}%,treatment_slugs.cs.{"${query.toLowerCase()}"}`)
        .limit(5);

    console.log('Treatment Slugs CS Result:', { length: data3?.length, error: error3 });

    // Try just searching for Daxxify to see if CS works at all
    const { data: data4, error: error4 } = await supabase
        .from('providers')
        .select('name, treatment_slugs')
        .contains('treatment_slugs', ['daxxify'])
        .limit(5);

    console.log('Daxxify Explicit Contains Result:', { length: data4?.length, error: error4 });
}

testSearch().catch(console.error);
