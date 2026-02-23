const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
    {
        name: "Aesthetic Laser Center",
        slug: "aesthetic-laser-center-portland",
        services: ["Polynucleotides (PNs)", "NucleoRich PL", "Biostimulators (Sculptra)", "Exosome Therapy", "Daxxify / Long-Acting Tox"],
        flags: { offers_long_acting_tox: true, uses_ai_diagnostics: true, score_results_quality: 35 }
    },
    {
        name: "Aura Aesthetics",
        slug: "aura-aesthetics-portland",
        services: ["Natural Results Integrity", "Baby Botox / Preventative", "Biostimulators (Sculptra)"],
        flags: { score_results_quality: 35 }
    },
    {
        name: "SkinSpirit Portland",
        slug: "skinspirit-portland-portland",
        services: ["Biostimulators (Sculptra)", "Polynucleotides (PNs)", "Daxxify / Long-Acting Tox"],
        flags: { offers_long_acting_tox: true, score_results_quality: 32 }
    },
    {
        name: "Skin Renewal of Portland",
        slug: "skin-renewal-of-portland-portland",
        services: ["Biostimulators (Sculptra)", "Exosome Therapy", "Regenerative Medicine"],
        flags: { score_results_quality: 30 }
    },
    {
        name: "PDX Injectables",
        slug: "pdx-injectables-portland",
        services: ["Clinical Innovation", "Advanced Training", "Biostimulators (Sculptra)"],
        flags: { score_results_quality: 33 }
    }
];

async function enrich() {
    console.log("🚀 Starting Silent Optimization for Portland...");

    for (const update of updates) {
        console.log(`Enriching ${update.name}...`);

        // Fetch current services to avoid overwriting
        const { data: current } = await supabase
            .from('providers')
            .select('services_offered, treatment_slugs, enriched_attrs')
            .eq('slug', update.slug)
            .single();

        const combinedServices = Array.from(new Set([...(current?.services_offered || []), ...update.services]));
        const combinedSlugs = Array.from(new Set([...(current?.treatment_slugs || []), ...update.services.map(s => s.toLowerCase().replace(/\s+/g, '-'))]));

        // Merge enriched_attrs safely
        const updatedEnrichedAttrs = {
            ...(current?.enriched_attrs || {}),
            ...update.flags
        };

        const { error } = await supabase
            .from('providers')
            .update({
                services_offered: combinedServices,
                treatment_slugs: combinedSlugs,
                enriched_attrs: updatedEnrichedAttrs
            })
            .eq('slug', update.slug);

        if (error) {
            console.error(`❌ Error updating ${update.name}:`, error);
        } else {
            console.log(`✅ ${update.name} enriched.`);
        }
    }

    console.log("🏁 Silent Optimization complete.");
}

enrich();
