const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findReviewText() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, top_reviews')
        .not('top_reviews', 'is', null)
        .limit(100);

    if (error) {
        console.error(error);
        return;
    }

    const withText = data.filter(p => p.top_reviews && p.top_reviews.some(r => r.text && r.text.length > 10));
    console.log(`Found ${withText.length} providers with review text out of 100.`);
    if (withText.length > 0) {
        console.log("Sample text:", withText[0].top_reviews.find(r => r.text).text);
    }
}

findReviewText();
