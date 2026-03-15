import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const loadEnv = (name: string) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = require('dotenv').parse(fs.readFileSync(p));
        for (const k in config) {
            if (!process.env[k]) process.env[k] = config[k];
        }
    }
};
loadEnv('.env.local');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const AESTHETIC_TAXONOMIES = [
    "207N00000X", // Dermatology
    "208200000X", // Plastic Surgery  
    "207R00000X", // Internal Medicine 
    "207Q00000X", // Family Medicine 
    "204E00000X", // Oral & Maxillofacial Surgery
    "363L00000X", // Nurse Practitioner
    "363LP0200X", // Nurse Practitioner, Pediatric 
    "363A00000X", // Physician Assistant
    "163W00000X", // Registered Nurse
    "364S00000X"  // Clinical Nurse Specialist
];

const DELAY_MS = 1000;
async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function searchNPI(firstName: string, lastName: string, state: string, taxonomy?: string) {
    let url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&state=${encodeURIComponent(state)}&enumeration_type=NPI-1`;
    if (taxonomy) {
        url += `&taxonomy_description=${encodeURIComponent(taxonomy)}`;
    }

    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) {
            if (res.status === 429) return 'RATE_LIMIT';
            return null;
        }
        const data = await res.json();
        return data;
    } catch {
        return null; // timeout
    }
}

async function lookupNPI(practitioner: any, providerCity: string, providerState: string) {
    for (const taxonomy of AESTHETIC_TAXONOMIES) {
        let results = await searchNPI(practitioner.first_name, practitioner.last_name, providerState, taxonomy);

        while (results === 'RATE_LIMIT') {
            console.log('Rate limit hit. Waiting 60 seconds...');
            await sleep(60000);
            results = await searchNPI(practitioner.first_name, practitioner.last_name, providerState, taxonomy);
        }

        if (results && results.result_count === 1) {
            return { match: results.results[0], confidence: 'high' };
        } else if (results && results.result_count > 1) {
            for (const r of results.results) {
                if (r.addresses && r.addresses.some((a: any) => a.city.toLowerCase() === providerCity.toLowerCase())) {
                    return { match: r, confidence: 'medium' };
                }
            }
            return { match: results.results[0], confidence: 'low' };
        }
    }

    // Fallback: No taxonomy filter
    let results = await searchNPI(practitioner.first_name, practitioner.last_name, providerState);
    while (results === 'RATE_LIMIT') {
        console.log('Rate limit hit. Waiting 60 seconds...');
        await sleep(60000);
        results = await searchNPI(practitioner.first_name, practitioner.last_name, providerState);
    }

    if (results && results.result_count === 1) {
        return { match: results.results[0], confidence: 'medium' };
    }

    return { match: null, confidence: 'none' };
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    console.log(`Starting NPI Lookup Pipeline (Dry Run: ${dryRun})`);

    while (true) {
        // Fetch up to 100 practitioners missing NPI lookup
        const { data: practitioners, error } = await supabase
            .from('provider_practitioners')
            .select('*, providers!inner(city, state)')
            .eq('npi_lookup_attempted', false)
            .limit(100);

        if (error) {
            console.error('Error fetching practitioners:', error);
            break;
        }

        if (!practitioners || practitioners.length === 0) {
            console.log('No more practitioners found to process. Done!');
            break;
        }

        console.log(`\nFound ${practitioners.length} practitioners to process in this batch.`);

        for (const prac of practitioners) {
            console.log(`\nLooking up NPI for: ${prac.first_name} ${prac.last_name} in ${prac.providers.state}`);

            const result = await lookupNPI(prac, prac.providers.city, prac.providers.state);

            const updateData: any = {
                npi_lookup_attempted: true,
                npi_lookup_attempted_at: new Date().toISOString()
            };

            if (result.match) {
                const m = result.match;
                console.log(`  -> Match found! Confidence: ${result.confidence}, NPI: ${m.number}, Taxonomy: ${m.taxonomies?.[0]?.desc}`);
                updateData.npi_number = m.number;
                updateData.npi_verified = true;
                updateData.npi_taxonomy_code = m.taxonomies?.[0]?.code;
                updateData.npi_taxonomy_description = m.taxonomies?.[0]?.desc;
                updateData.npi_state = m.addresses?.[0]?.state;
                updateData.npi_license_number = m.taxonomies?.[0]?.license;
                updateData.npi_enumeration_date = m.basic?.enumeration_date;
                updateData.npi_last_updated = m.basic?.last_updated;
                updateData.npi_match_confidence = result.confidence;
            } else {
                console.log(`  -> No match found.`);
            }

            if (!dryRun) {
                const { error: updErr } = await supabase
                    .from('provider_practitioners')
                    .update(updateData)
                    .eq('id', prac.id);

                if (updErr) console.error('  -> Failed to update:', updErr);
            }
            await sleep(DELAY_MS);
        }
        console.log('Batch complete.');
    }
}

main().catch(console.error);
