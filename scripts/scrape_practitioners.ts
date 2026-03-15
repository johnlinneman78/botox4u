import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

// Load env
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

const DELAY_MS = 2000;
async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const PATHS_TO_CHECK = [
    '/team', '/staff', '/our-team', '/providers', '/meet-our-team',
    '/about-us', '/about', '/our-providers', '/meet-the-team',
    '/meet-our-providers', '/injectors', '/doctors', '/specialists'
];

function normalizeLicenseType(suffix: string): string | null {
    if (!suffix) return null;
    const s = suffix.toUpperCase().replace(/\./g, '').trim();
    if (['MD', 'DO'].includes(s)) return s;
    if (s.match(/^(NP|NPC|NPBC|FNP|FNPC|FNPBC|DNP|APRN|ANP)$/)) return 'NP';
    if (s.match(/^(PA|PAC)$/)) return 'PA';
    if (s.match(/^(RN|BSN|MSN)$/)) return 'RN';
    if (s.match(/^(DDS|DMD)$/)) return 'DDS';
    return null;
}



async function fetchHtml(url: string) {
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(10000)
        });
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

async function findTeamPage(baseUrl: string) {
    let html = await fetchHtml(baseUrl);
    if (!html) return null;

    const $ = cheerio.load(html);
    let teamUrl: string | null = null;

    // 1. Look for links matching our keywords
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().toLowerCase();
        if (href && PATHS_TO_CHECK.some(p => href.toLowerCase().includes(p) || text.includes('team') || text.includes('staff'))) {
            teamUrl = href;
            return false; // break
        }
    });

    if (teamUrl) {
        try {
            const tUrl = teamUrl as string;
            return tUrl.startsWith('http') ? tUrl : new URL(tUrl, baseUrl).href;
        } catch {
            return null;
        }
    }

    // 2. Try common paths blindly if no link found
    for (const p of PATHS_TO_CHECK.slice(0, 3)) {
        const testUrl = new URL(p, baseUrl).href;
        const testHtml = await fetchHtml(testUrl);
        if (testHtml && typeof testHtml === 'string' && testHtml.toLowerCase().includes('team')) {
            return testUrl;
        }
    }
    return null;
}

async function scrapePractitioners(url: string) {
    const html = await fetchHtml(url);
    if (!html) return [];

    const $ = cheerio.load(html);

    // Remove scripts and styles before extracting text
    $('script, style, noscript').remove();
    // Get raw text from the page, clean up whitespace
    const rawText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 15000); // Send up to 15k chars to LLM

    if (rawText.length < 50) return [];

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
        console.warn("OPENROUTER_API_KEY not set! Cannot extract.");
        return [];
    }

    const prompt = `
You are a highly accurate data extraction system. Your task is to extract medical and aesthetic practitioners (doctors, nurses, PAs) from the following website text.

Look for names with medical or aesthetic credentials like MD, DO, RN, BSN, MSN, NP, PA, DDS. Also look for "Dr. [Name]".
Ignore general policies, business names, or generic roles like "receptionist" unless they are clearly an injection provider.

Return your response ONLY as valid JSON in the following format. Ensure the JSON is completely valid:
{
  "practitioners": [
    {
      "full_name": "Full string as it appeared (e.g. 'Dr. Sarah Smith, MD')",
      "first_name": "Sarah",
      "last_name": "Smith",
      "credential_suffix": "MD",
      "normalized_license_type": "MD"
    }
  ]
}

Note: For normalized_license_type, use MD, DO, NP, PA, RN, or DDS. If none, output null.

--- WEBSITE TEXT ---
${rawText}
`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen-2.5-72b-instruct", // Qwen 2.5 72b via OpenRouter
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            console.error("OpenRouter API error:", response.statusText);
            return [];
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return [];

        // Parse JSON safely by finding the json block if it added markdown wrapped code blocks
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];

        const result = JSON.parse(jsonStr);
        if (result && Array.isArray(result.practitioners)) {
            return result.practitioners.map((p: any) => ({
                ...p,
                source_url: url
            }));
        }
        return [];
    } catch (e) {
        console.error("Error calling Qwen API:", e);
        return [];
    }
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    console.log(`Starting Practitioner Scraping (Dry Run: ${dryRun})`);

    const { data: existingData } = await supabase.from('provider_practitioners').select('provider_id');
    const existingIds = new Set((existingData || []).map(row => row.provider_id));

    const { data: allProviders, error } = await supabase
        .from('providers')
        .select('*')
        .not('website', 'is', null);

    if (error || !allProviders) {
        console.error('Error fetching:', error);
        return;
    }

    const providers = allProviders.filter(p => !existingIds.has(p.id));

    console.log(`Processing ${providers.length} providers with websites (skipped ${existingIds.size})...`);

    let providersFound = 0;
    for (const p of providers) {
        console.log(`\n--- Provider: ${p.name}`);
        const teamUrl = await findTeamPage(p.website);
        if (!teamUrl) {
            console.log(`  -> No team page found on ${p.website}`);
            continue;
        }
        console.log(`  -> Found team page: ${teamUrl}`);

        let practitioners = await scrapePractitioners(teamUrl);
        // Deduplicate
        const seen = new Set();
        practitioners = practitioners.filter((prac: any) => {
            const k = prac.first_name + ' ' + prac.last_name;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });

        if (practitioners.length > 0) {
            console.log(`  -> Scraped ${practitioners.length} practitioners:`, practitioners.map((x: any) => x.full_name));
            providersFound++;
            if (!dryRun) {
                for (const prac of practitioners) {
                    prac.provider_id = p.id;
                    const { error: insErr } = await supabase.from('provider_practitioners').insert(prac);
                    if (insErr) console.error('  -> Failed to insert:', insErr);
                }
            }
        } else {
            console.log(`  -> Could not extract any names from ${teamUrl}`);
        }
        await sleep(DELAY_MS);
    }
    console.log(`\nDone. Found practitioners for ${providersFound}/${providers.length} tested websites.`);
}

main().catch(console.error);
