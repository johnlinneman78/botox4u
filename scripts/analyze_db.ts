import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tgqgsmaqmyeguapcogel.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWdzbWFxbXllZ3VhcGNvZ2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE5NDgyNCwiZXhwIjoyMDg2NzcwODI0fQ.zVpz7CjppFXXThUnCTIBo2XfLscdhSNJ0t2EddGcFHc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    let output = "";
    const log = (msg?: any) => {
        output += (msg !== undefined ? String(msg) : '') + '\n';
    };
    const logObj = (obj: any) => {
        output += JSON.stringify(obj, null, 2) + '\n';
    };

    const openapiFiles = fs.readFileSync('openapi.json', 'utf8');
    const openapi = JSON.parse(openapiFiles);

    // 1. SHOW ME THE SCHEMA
    log("=== 1. SCHEMA ===");
    const defs = openapi.definitions || openapi.components?.schemas || {};
    for (const table of Object.keys(defs)) {
        log(`\nTABLE: ${table}`);
        const props = defs[table].properties || {};
        for (const col of Object.keys(props)) {
            const type = props[col].format || props[col].type || 'any';
            log(`  - ${col}: ${type}`);
        }
    }

    // 2. PROVIDERS DEEP DIVE
    log("\n=== 2. PROVIDER TABLE DEEP DIVE ===");
    const { count } = await supabase.from('providers').select('*', { count: 'exact', head: true });
    log(`Total row count: ${count}`);

    const { data: sampleData } = await supabase.from('providers').select('*').limit(50);

    const distinctCities: string[] = [];
    const sample3: any[] = [];
    for (const row of sampleData || []) {
        if (!distinctCities.includes(row.city) && sample3.length < 3) {
            distinctCities.push(row.city);
            sample3.push(row);
        }
    }
    log(`3 Sample rows (distinct cities):`);
    logObj(sample3);

    let allProviders: any[] = [];
    let page = 0;
    const pageSize = 1000;
    while (true) {
        const { data: pageData, error } = await supabase.from('providers').select('*').range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) { console.error(error); break; }
        if (!pageData || pageData.length === 0) break;
        allProviders = allProviders.concat(pageData);
        if (pageData.length < pageSize) break;
        page++;
    }

    const columns = Object.keys(defs['providers']?.properties || {});
    log("\nCounts for each column (Non-null vs null/empty):");
    for (const col of columns) {
        let nonNull = 0;
        let isNull = 0;
        for (const row of allProviders) {
            const val = row[col];
            if (val === null || val === undefined || val === '') {
                isNull++;
            } else {
                nonNull++;
            }
        }
        log(`${col}: ${nonNull} non-null, ${isNull} null/empty`);
    }

    // 3. NPI SPECIFIC DATA
    log("\n=== 3. NPI-SPECIFIC DATA ===");
    const keywords = ['npi', 'license', 'credential', 'education', 'school', 'board', 'certification', 'specialty', 'taxonomy', 'supervis', 'medical_degree'];
    for (const table of Object.keys(defs)) {
        const props = defs[table].properties || {};
        for (const col of Object.keys(props)) {
            if (keywords.some(k => col.toLowerCase().includes(k))) {
                log(`Found column in ${table}: ${col}`);
                const { data: colData } = await supabase.from(table).select(col).not(col, 'is', null).limit(3);
                log(`  Sample values: ${JSON.stringify(colData?.map((d: any) => d[col]))}`);
            }
        }
    }

    // 4. GOOGLE PLACES DATA
    log("\n=== 4. GOOGLE PLACES DATA ===");
    const googleKeywords = ['review', 'rating', 'photo', 'place_id', 'google'];
    for (const table of Object.keys(defs)) {
        const props = defs[table].properties || {};
        for (const col of Object.keys(props)) {
            if (googleKeywords.some(k => col.toLowerCase().includes(k))) {
                log(`Found Google column in ${table}: ${col}`);
                const { data: gColData } = await supabase.from(table).select(col).not(col, 'is', null).limit(3);
                log(`  Sample values: ${JSON.stringify(gColData?.map((d: any) => d[col]))}`);
            }
        }
    }

    // 5. SUMMARY
    log("\n=== 5. SUMMARY ===");
    const npiCount = allProviders.filter(p => p.npi).length;
    log(`Providers with NPI numbers: ${npiCount}`);

    // Find actual column names dynamically based on what we see in schema definition
    const credCol = columns.find(c => c.toLowerCase().includes('credential') || c.toLowerCase().includes('license'));
    const creds = allProviders.filter(p => credCol && p[credCol]);
    log(`Providers with license type data (${credCol}): ${creds.length}`);

    const edCol = columns.find(c => c.toLowerCase().includes('education') || c.toLowerCase().includes('school'));
    const ed = allProviders.filter(p => edCol && p[edCol]);
    log(`Providers with education/school data (${edCol}): ${ed.length}`);

    const boardCol = columns.find(c => c.toLowerCase().includes('board') || c.toLowerCase().includes('cert'));
    const board = allProviders.filter(p => boardCol && p[boardCol]);
    log(`Providers with board certification data (${boardCol}): ${board.length}`);

    const basicProviders = allProviders.filter(p => {
        const hasNpi = p.npi;
        const hasCred = credCol && p[credCol];
        const hasEd = edCol && p[edCol];
        const hasBoard = boardCol && p[boardCol];
        // Check if they only have name, location, google reviews
        // Assuming 'nothing else' means NPI-related fields are absent
        return !hasNpi && !hasCred && !hasEd && !hasBoard;
    });
    log(`Providers with literally just name/location/Google: ${basicProviders.length}`);

    fs.writeFileSync('db_report_utf8.txt', output, 'utf8');
}

main().catch(console.error);
