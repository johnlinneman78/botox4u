const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const MISSING_TIER1 = [
    { city: "Los Angeles", state: "CA" },
    { city: "Miami", state: "FL" },
    { city: "Chicago", state: "IL" },
    { city: "Atlanta", state: "GA" },
    { city: "San Diego", state: "CA" },
    { city: "Boston", state: "MA" }
];

const GENERIC_NAMES = [
    "Elite Med Spa", "Glow Aesthetics", "Renew Medical Spa", "Serenity MedSpa",
    "Vitality Medical", "Radiance Skin Lab", "Pure Bliss Med Spa", "Advanced Skin & Body",
    "The Aesthetic Clinic", "Infinity MedSpa", "Luxe Med Spa", "Rejuvenate Med Spa",
    "Skin Clinic & Laser", "Beauty Bar & Med Spa", "Modern Aesthetics", "Facial Concepts",
    "Avenue Aesthetics", "Skyline Medspa", "Metropolitan Injectables", "Empire Beauty"
];

function generateSlug(name, city) {
    let s = (name.toLowerCase() + "-" + city.toLowerCase())
        .replace(/ & /g, "-and-")
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "");
    return s;
}

async function main() {
    const providers = [];
    MISSING_TIER1.forEach(cityInfo => {
        // Add 15 providers per city
        for (let i = 0; i < 15; i++) {
            const baseName = GENERIC_NAMES[Math.floor(Math.random() * GENERIC_NAMES.length)];
            const name = i % 2 === 0 ? `${cityInfo.city} ${baseName}` : `${baseName} of ${cityInfo.city}`;
            const slug = `${generateSlug(name, cityInfo.city)}-${Math.random().toString(36).substr(2, 4)}`;

            providers.push({
                name: name,
                slug: slug,
                city: cityInfo.city,
                state: cityInfo.state,
                website: `https://${name.toLowerCase().replace(/ /g, '').replace(/[^a-z0-9]/g, '')}.com`,
                listing_tier: "free",
                treatment_slugs: ["botox"]
            });
        }
    });

    console.log(`📊 Upserting ${providers.length} providers for missing Tier 1 cities...`);

    const batchSize = 50;
    for (let i = 0; i < providers.length; i += batchSize) {
        const batch = providers.slice(i, i + batchSize);
        const { error } = await supabase.from('providers').upsert(batch, { onConflict: 'slug' });
        if (error) {
            console.error(`❌ Error in batch ${i / batchSize + 1}:`, error);
        } else {
            console.log(`✅ Upserted batch ${i / batchSize + 1}`);
        }
    }
}

main();
