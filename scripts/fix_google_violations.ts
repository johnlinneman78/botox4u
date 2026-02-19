
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
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
loadEnv('.env.prod');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function scrapeOgImage(url: string) {
    try {
        console.log(`Scraping ${url}...`);
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return null;
        const html = await res.text();

        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
        const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["'](.*?)["']/i);

        const imageUrl = ogImageMatch ? ogImageMatch[1] : (twitterImageMatch ? twitterImageMatch[1] : null);

        if (imageUrl && !imageUrl.startsWith('http')) {
            // Handle relative URLs
            try {
                const base = new URL(url);
                return new URL(imageUrl, base).toString();
            } catch {
                return null;
            }
        }
        return imageUrl;
    } catch (e) {
        console.log(`Failed to scrape ${url}:`, e instanceof Error ? e.message : String(e));
        return null;
    }
}

async function fixViolations() {
    console.log("Starting Google ToS Fix Script...");

    // 1. Fetch providers with Google photo URLs or with top_reviews text
    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, website, hero_image_url, top_reviews');

    if (error || !providers) {
        console.error("Error fetching providers:", error);
        return;
    }

    console.log(`Found ${providers.length} providers to check.`);

    for (const provider of providers) {
        let needsUpdate = false;
        const updates: any = {};

        // A. Check Image
        const isGoogleImage = provider.hero_image_url?.includes('googleapis.com') ||
            provider.hero_image_url?.includes('googleusercontent.com');

        if (isGoogleImage) {
            console.log(`[IMAGE] ${provider.name} has Google image. Attempting rescue...`);
            if (provider.website) {
                const ogImage = await scrapeOgImage(provider.website);
                if (ogImage) {
                    console.log(`[SUCCESS] Found og:image: ${ogImage}`);
                    updates.hero_image_url = ogImage;
                    needsUpdate = true;
                } else {
                    console.log(`[FALLBACK] No og:image found. Setting to null for placeholder.`);
                    updates.hero_image_url = null; // Will trigger geometric placeholder in UI
                    needsUpdate = true;
                }
            } else {
                console.log(`[FALLBACK] No website. Setting to null.`);
                updates.hero_image_url = null;
                needsUpdate = true;
            }
        }

        // B. Check Reviews
        if (provider.top_reviews && Array.isArray(provider.top_reviews)) {
            const hasVerbatimText = provider.top_reviews.some((r: any) => r.text !== null);
            if (hasVerbatimText) {
                console.log(`[REVIEWS] Clearing verbatim text for ${provider.name}`);
                updates.top_reviews = provider.top_reviews.map((r: any) => ({
                    ...r,
                    text: null,
                    profile_photo_url: null
                }));
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`Updating ${provider.name}...`);
            const { error: updateError } = await supabase
                .from('providers')
                .update(updates)
                .eq('id', provider.id);

            if (updateError) console.error(`Error updating ${provider.name}:`, updateError);
        }
    }

    console.log("ToS Fix Complete.");
}

fixViolations().catch(console.error);
