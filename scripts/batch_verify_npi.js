const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const loadEnv = (name) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = dotenv.parse(fs.readFileSync(p));
        for (const k in config) {
            process.env[k] = config[k];
        }
    }
};

if (fs.existsSync('.env.local')) {
    loadEnv('.env.local');
} else {
    loadEnv('.env.prod');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local or .env.prod');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function cleanName(name) {
    if (!name) return '';
    return name
        .replace(/ (Med Spa|MedSpa|Aesthetics|Medical Spa|Plastic Surgery|Skin Clinic|Laser|Center|and|&|Institute|Group|Health|Wellness|Clinic|Beauty|Studio|Skin).*$/i, '')
        .replace(/^Dr\. /i, '')
        .trim();
}

async function lookupNPI(name, state, isOrganization = false) {
    try {
        const params = new URLSearchParams({
            version: '2.1',
            state: state,
            limit: '5'
        });

        if (isOrganization) {
            params.append('organization_name', name);
        } else {
            const parts = name.split(' ');
            if (parts.length >= 2) {
                params.append('first_name', parts[0]);
                params.append('last_name', parts[parts.length - 1]);
            } else {
                params.append('last_name', name);
            }
        }

        const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?${params.toString()}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        const primaryTaxonomy = result.taxonomies.find(t => t.primary) || result.taxonomies[0];

        return {
            number: result.number,
            credential: result.basic.credential || (isOrganization ? 'Organization' : 'Unknown'),
            taxonomy: primaryTaxonomy.desc
        };
    } catch (error) {
        console.error(`NPI Lookup failed for ${name}:`, error.message);
        return null;
    }
}

async function batchVerify() {
    console.log('--- Starting NPI Batch Verification ---');

    // Get providers that haven't been attempted yet
    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, state')
        .eq('npi_lookup_attempted', false)
        .limit(100); // Process in batches

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Found ${providers.length} providers to verify.`);

    for (const provider of providers) {
        console.log(`Checking ${provider.name} in ${provider.state}...`);

        // 1. Try organization
        let match = await lookupNPI(provider.name, provider.state, true);

        // 2. Try cleaned organization
        if (!match) {
            const cleaned = cleanName(provider.name);
            if (cleaned !== provider.name) {
                console.log(`   Trying cleaned: ${cleaned}...`);
                match = await lookupNPI(cleaned, provider.state, true);
            }
        }

        // 3. Try individual (original)
        if (!match) {
            match = await lookupNPI(provider.name, provider.state, false);
        }

        // 4. Try cleaned individual
        if (!match) {
            const cleaned = cleanName(provider.name);
            if (cleaned !== provider.name) {
                match = await lookupNPI(cleaned, provider.state, false);
            }
        }

        if (match) {
            console.log(`✅ Match found: ${match.number} (${match.credential})`);
            await supabase
                .from('providers')
                .update({
                    npi_number: match.number,
                    npi_verified: true,
                    npi_license_type: match.credential,
                    npi_specialty: match.taxonomy,
                    npi_verified_at: new Date().toISOString(),
                    npi_lookup_attempted: true
                })
                .eq('id', provider.id);
        } else {
            console.log(`❌ No match found.`);
            await supabase
                .from('providers')
                .update({
                    npi_lookup_attempted: true,
                    npi_verified: false,
                    npi_verified_at: new Date().toISOString()
                })
                .eq('id', provider.id);
        }

        // Sleep to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('--- Batch verification complete ---');
}

batchVerify();
