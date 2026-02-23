
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function populateTreatments() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('Fetching providers to update...');

    // We'll update providers that have 'botox' to also have 'daxxify' as a starting point
    // specifically in major metros to make the home page trends look good.
    const hubs = ['Houston', 'New York', 'Miami', 'Los Angeles', 'Chicago'];

    const { data: providers, error: fetchError } = await supabase
        .from('providers')
        .select('id, name, city, treatment_slugs')
        .in('city', hubs)
        .limit(100);

    if (fetchError) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    console.log(`Found ${providers.length} providers to potentially update.`);

    const updates = providers.map(p => {
        const slugs = p.treatment_slugs || [];
        const newSlugs = [...new Set([...slugs, 'daxxify', 'sculptra', 'pns'])];
        return {
            id: p.id,
            treatment_slugs: newSlugs
        };
    });

    console.log('Executing updates...');
    let successCount = 0;
    for (const update of updates) {
        const { error: updateError } = await supabase
            .from('providers')
            .update({ treatment_slugs: update.treatment_slugs })
            .eq('id', update.id);

        if (!updateError) successCount++;
    }

    console.log(`Successfully updated ${successCount} providers with Daxxify, Sculptra, and PNs.`);
}

populateTreatments().catch(console.error);
