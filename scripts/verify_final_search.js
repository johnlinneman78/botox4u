
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyHS7Search() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const q = 'HS7';
    const qLower = q.toLowerCase();
    const initialsQuery = q.split('').join('%') + '%';

    console.log(`Testing Smart Search for: "${q}"`);
    console.log(`Initials Query: "${initialsQuery}"`);

    const { data, error } = await supabase
        .from('providers')
        .select('name, score')
        .or(`name.ilike.%${q}%,name.ilike.${initialsQuery}`);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} matches:`);
    data.forEach(p => console.log(`- ${p.name} (Score: ${p.score})`));
}

verifyHS7Search().catch(console.error);
