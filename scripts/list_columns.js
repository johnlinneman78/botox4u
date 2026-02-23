
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function listColumns() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Columns:', Object.keys(data).join(', '));
    console.log('Sample Row Text Fields:', {
        name: data.name,
        city: data.city,
        state: data.state,
        business_type: data.business_type,
        google_place_id: data.google_place_id,
        bio: data.bio,
        description: data.description,
        ai_description: data.ai_description,
        services_offered: data.services_offered,
        treatment_slugs: data.treatment_slugs
    });
}

listColumns().catch(console.error);
