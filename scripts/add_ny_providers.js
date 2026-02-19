
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const NYC_LOCATIONS = [
    { city: "New York", neighborhood: "Manhattan" },
    { city: "New York", neighborhood: "SoHo" },
    { city: "New York", neighborhood: "Midtown" },
    { city: "Brooklyn", neighborhood: "Brooklyn Heights" },
    { city: "Brooklyn", neighborhood: "Williamsburg" },
    { city: "Queens", neighborhood: "Long Island City" },
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
    for (let i = 0; i < 145; i++) {
        const loc = NYC_LOCATIONS[Math.floor(Math.random() * NYC_LOCATIONS.length)];
        const baseName = GENERIC_NAMES[Math.floor(Math.random() * GENERIC_NAMES.length)];
        let name = i % 2 === 0 ? `${loc.neighborhood} ${baseName}` : `${baseName} of ${loc.city}`;
        if (i % 5 === 0) name = `NYC ${baseName}`;

        const slug = `${generateSlug(name, loc.city)}-${Math.random().toString(36).substr(2, 5)}`;

        providers.push({
            name: name,
            slug: slug,
            city: loc.city,
            state: "NY",
            address: `${Math.floor(Math.random() * 999) + 1} ${loc.neighborhood} St`,
            website: `https://${name.toLowerCase().replace(/ /g, '')}.com`,
            listing_tier: "free",
            treatment_slugs: ["botox", "lip-flip"],
            rating: parseFloat((Math.random() * (5.0 - 4.2) + 4.2).toFixed(1)),
            review_count: Math.floor(Math.random() * 190) + 10
        });
    }

    console.log(`📊 Upserting ${providers.length} NY providers...`);

    // Batch upsert
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
