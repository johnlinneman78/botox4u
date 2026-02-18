
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role for admin updates
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GOOGLE_API_KEY) {
    console.error('Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface EnrichmentOptions {
    dryRun?: boolean;
    providerId?: string;
    limit?: number;
}

const DELAY_MS = 200;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Regex patterns for credentials
const CREDENTIAL_PATTERNS = [
    { pattern: /Board[- ]?certified/i, badge: "Board Certified" },
    { pattern: /Allergan (Diamond|Black Diamond|Platinum)/i, badge: "Allergan Top Provider" }, // Simplified mapping
    { pattern: /([0-9,]+)\+? injections/i, badge: "High Volume Injector" }, // dynamic extraction
    { pattern: /([0-9]+)\+? years/i, badge: "Experienced Provider" } // dynamic
];

async function fetchGooglePlaceData(name: string, city: string, state: string, address?: string) {
    // 1. Find Place ID
    // Try text search with name + city
    const query = `${name} ${city} ${state}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;

    try {
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.results || searchData.results.length === 0) {
            console.log(`No Google Place found for: ${query}`);
            return null;
        }

        const placeId = searchData.results[0].place_id;

        // 2. Get Place Details
        // Fields: rating, user_ratings_total, reviews, photos, editorial_summary (description)
        const fields = 'place_id,rating,user_ratings_total,reviews,photos,editorial_summary,website';
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;

        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        return detailsData.result;
    } catch (e) {
        console.error('Google Places API Error:', e);
        return null;
    }
}

async function scrapeWebsiteContent(url: string) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) }); // 5s timeout
        if (!res.ok) return null;
        const html = await res.text();

        // Simple regex extraction for meta description and first p tag
        const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        const firstPMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

        return {
            description: metaDescMatch ? metaDescMatch[1] : '',
            firstP: firstPMatch ? firstPMatch[1].replace(/<[^>]+>/g, '') : '',
            ogImage: ogImageMatch ? ogImageMatch[1] : ''
        };
    } catch (e) {
        console.log(`Failed to scrape ${url}:`, e instanceof Error ? e.message : String(e));
        return null;
    }
}

async function generateAIDescription(rawText: string, providerName: string) {
    if (!OPENAI_API_KEY) {
        console.log('Skipping AI description (No OPENAI_API_KEY)');
        return null;
    }

    const systemPrompt = `You are a medical aesthetics copywriter.
Output requirements:
- EXACTLY 2 sentences
- MAX 160 characters total
- Lead with doctor credentials + specialty if found
- End with one differentiator (volume, award, technique)
- Never invent credentials not present in source text`;

    const userPrompt = `Generate a description for ${providerName} using this source text:
"${rawText.slice(0, 1000)}"`;

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 100,
                temperature: 0.3
            })
        });

        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (e) {
        console.error('OpenAI API Error:', e);
        return null;
    }
}

async function enrichProvider(provider: any, options: EnrichmentOptions) {
    console.log(`Processing ${provider.name} (${provider.id})...`);

    // 1. Google Data
    const googleData = await fetchGooglePlaceData(provider.name, provider.city, provider.state, provider.address);

    let enrichedData: any = {
        google_place_id: googleData?.place_id || null,
        rating: googleData?.rating || null,
        review_count: googleData?.user_ratings_total || null,
        top_reviews: [],
        gallery: [],
        hero_image_url: null,
        badges: [],
        ai_description: null,
        enriched_at: new Date().toISOString()
    };

    // Reviews
    if (googleData?.reviews) {
        enrichedData.top_reviews = googleData.reviews
            .filter((r: any) => r.rating >= 4)
            .sort((a: any, b: any) => b.rating - a.rating || b.time - a.time) // Rating desc, then Time desc
            .slice(0, 3)
            .map((r: any) => ({
                author_name: r.author_name,
                rating: r.rating,
                text: r.text,
                time: r.time, // Unix timestamp
                relative_time_description: r.relative_time_description,
                source: 'google',
                profile_photo_url: r.profile_photo_url,
                author_url: r.author_url
            }));
    }

    // Images
    if (googleData?.photos && googleData.photos.length > 0) {
        // Construct photo URLs
        // Note: Actual rendering requires passing these references to client or proxying
        // For now we store the photo references to be constructed on client or keys
        // "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=..."

        const photos = googleData.photos.slice(0, 3).map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_API_KEY}`
        );

        enrichedData.hero_image_url = photos[0];
        if (photos.length > 1) enrichedData.gallery.push(photos[1]);
        if (photos.length > 2) enrichedData.gallery.push(photos[2]);
    }

    // Website Scraping & Fallbacks
    let rawTextForAI = provider.description || '';
    if (provider.website) {
        const scraped = await scrapeWebsiteContent(provider.website);
        if (scraped) {
            if (!enrichedData.hero_image_url && scraped.ogImage) {
                enrichedData.hero_image_url = scraped.ogImage;
            }
            rawTextForAI += ` ${scraped.description} ${scraped.firstP}`;
        }
    }

    // Fallback Image (Geometric)
    if (!enrichedData.hero_image_url) {
        enrichedData.hero_image_url = "/images/placeholders/clinic-geo-navy.jpg"; // Placeholder
    }

    // Credentials Extraction
    const combinedText = `${rawTextForAI} ${provider.name}`;
    CREDENTIAL_PATTERNS.forEach(cp => {
        const match = combinedText.match(cp.pattern);
        if (match) {
            let badgeText = cp.badge;
            if (cp.badge.includes("Injector") && match[1]) badgeText = `${match[1]} Injections`;
            if (cp.badge.includes("Experienced") && match[1]) badgeText = `${match[1]} Years Experience`;
            if (!enrichedData.badges.includes(badgeText)) {
                enrichedData.badges.push(badgeText);
            }
        }
    });

    // AI Description
    if (rawTextForAI.length > 20) {
        enrichedData.ai_description = await generateAIDescription(rawTextForAI, provider.name);
    }

    if (options.dryRun) {
        console.log(`[DRY RUN] Would update ${provider.name}:`, JSON.stringify(enrichedData, null, 2));
    } else {
        const { error } = await supabase
            .from('providers')
            .update(enrichedData)
            .eq('id', provider.id);

        if (error) console.error(`Error updating ${provider.name}:`, error);
        else console.log(`Successfully enriched ${provider.name}`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    console.log(`Starting Enrichment Pipeline (Dry Run: ${dryRun})...`);

    // Fetch providers that haven't been enriched or enriched > 30 days ago
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .or('enriched_at.is.null,enriched_at.lt.2025-01-01') // simplified logic
        .limit(10);

    if (error || !providers) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Found ${providers.length} providers to enrich.`);

    for (const provider of providers) {
        await enrichProvider(provider, { dryRun });
        await sleep(DELAY_MS);
    }

    console.log('Enrichment batch complete.');
}

main().catch(console.error);
