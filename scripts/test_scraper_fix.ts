
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function scrapePage(url: string, isRetry = false): Promise<string[]> {
    try {
        let cleanUrl = url.trim().replace(/\s/g, '');
        if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;

        console.log(`    Fetching ${cleanUrl}...`);

        const res = await fetch(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            },
            signal: AbortSignal.timeout(15000),
            redirect: 'follow'
        });

        if (!res.ok) {
            console.log(`    Fetch failed (${res.status}): ${cleanUrl}`);
            if (!isRetry && (res.status === 403 || res.status === 404)) {
                const altUrl = cleanUrl.includes('www.')
                    ? cleanUrl.replace('www.', '')
                    : cleanUrl.replace('://', '://www.');
                console.log(`    Retrying with alternative URL: ${altUrl}`);
                return scrapePage(altUrl, true);
            }
            return [];
        }

        const html = await res.text();
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        return [...new Set(html.match(emailRegex) || [])];

    } catch (e: any) {
        console.log(`    Fetch error: ${e.message}`);
        if (!isRetry && (e.message.includes('SSL') || e.message.includes('timeout') || e.message.includes('fetch failed'))) {
            const httpUrl = url.trim().replace(/\s/g, '').replace('https://', 'http://');
            console.log(`    Retrying with HTTP fallback: ${httpUrl}`);
            return scrapePage(httpUrl, true);
        }
        return [];
    }
}

async function testFailedScrapes() {
    console.log('--- TESTING IMPROVED SCRAPER ON PREVIOUSLY FAILED SITES ---');

    // Get 5 providers marked as 'no_email'
    const { data: providers } = await supabase
        .from('providers')
        .select('name, website')
        .eq('outreach_status', 'no_email')
        .limit(5);

    if (!providers) return;

    for (const provider of providers) {
        console.log(`\nTesting: ${provider.name} (${provider.website})`);
        const paths = ['', '/contact', '/contact-us'];
        let foundAny = false;

        for (const path of paths) {
            const emails = await scrapePage(`${provider.website}${path}`);
            if (emails.length > 0) {
                console.log(`  ✅ SUCCESS! Found emails: ${emails.join(', ')}`);
                foundAny = true;
                break;
            }
        }
        if (!foundAny) console.log(`  ❌ Still failed.`);
    }
}

testFailedScrapes();
