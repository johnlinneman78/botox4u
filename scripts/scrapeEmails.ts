
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function scrapeEmail(url: string): Promise<string | null> {
    try {
        console.log(`Scraping ${url}...`);
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const html = await res.text();

        // Simple email regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = html.match(emailRegex);

        if (matches) {
            // Filter out common false positives or image extensions
            const validEmails = matches.filter(e =>
                !e.endsWith('.png') &&
                !e.endsWith('.jpg') &&
                !e.endsWith('.jpeg') &&
                !e.endsWith('.svg') &&
                !e.toLowerCase().includes('sentry') &&
                !e.toLowerCase().includes('example')
            );
            return validEmails[0] || null;
        }
        return null;
    } catch (e) {
        console.error(`Failed to scrape ${url}:`, e);
        return null;
    }
}

async function run() {
    console.log('--- Email Scraper for Track B ---');

    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, website')
        .or('city.ilike.Scottsdale,city.ilike.Austin')
        .not('website', 'is', null);

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Found ${providers.length} providers to check.`);

    for (const provider of providers) {
        const email = await scrapeEmail(provider.website);
        if (email) {
            console.log(`Found email for ${provider.name}: ${email}`);
            // Use enriched_attrs for now since email column might be missing
            const { data: current } = await supabase.from('providers').select('enriched_attrs').eq('id', provider.id).single();
            const newAttrs = { ...(current?.enriched_attrs || {}), email };

            await supabase
                .from('providers')
                .update({ enriched_attrs: newAttrs })
                .eq('id', provider.id);
        } else {
            console.log(`No email found for ${provider.name}`);
        }
    }

    console.log('--- Email Scraper Complete ---');
}

run();
