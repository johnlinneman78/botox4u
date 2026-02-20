
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const NICHE = {
    name: "Botox",
    siteName: "Botox-4U.com",
    domain: "botox-4u.com",
    brandName: "Botox",
    brandSuffix: "-4u",
    providerType: "injector",
    providerTypePlural: "injectors",
    priceUnit: "per unit",
    outreach: {
        senderName: "John Linneman",
        senderTitle: "Founder, Botox-4U.com",
        senderEmail: "hello@botox-4u.com"
    }
};

const SENDER = `${NICHE.outreach.senderName} from ${NICHE.siteName} <${NICHE.outreach.senderEmail}>`;

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
            signal: AbortSignal.timeout(30000),
            redirect: 'follow'
        });

        if (!res.ok) {
            console.log(`    Fetch failed (${res.status}): ${cleanUrl}`);

            // If 403 or 404, try different URL pattern once
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

        // If it was a SSL/TLS error or timeout, try http as last resort
        if (!isRetry && (e.message.includes('SSL') || e.message.includes('timeout') || e.message.includes('fetch failed'))) {
            const httpUrl = url.trim().replace(/\s/g, '').replace('https://', 'http://');
            console.log(`    Retrying with HTTP fallback: ${httpUrl}`);
            return scrapePage(httpUrl, true);
        }
        return [];
    }
}

async function scrapeEmailSmart(baseUrl: string, providerName: string): Promise<string | null> {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const paths = ['', '/contact', '/contact-us', '/about', '/about-us'];
    const skipKeywords = ['info@', 'noreply@', 'support@', 'example.com', 'sentry.io', '.png', '.jpg', '.jpeg', '.svg', 'growth99', 'ideation'];

    let allFound: string[] = [];

    for (const path of paths) {
        const urlToCheck = `${cleanBase}${path}`;
        const found = await scrapePage(urlToCheck);
        allFound = [...allFound, ...found];
        if (allFound.length > 3) break;
    }

    if (allFound.length === 0) return null;

    const validEmails = [...new Set(allFound)].filter(e => {
        const email = e.toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
        return !skipKeywords.some(k => email.includes(k));
    });

    if (validEmails.length === 0) return null;

    const providerWords = providerName.toLowerCase().split(' ').filter(w => w.length > 2);
    const prioritized = validEmails.sort((a, b) => {
        const aMatch = providerWords.some(w => a.toLowerCase().includes(w));
        const bMatch = providerWords.some(w => b.toLowerCase().includes(w));
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    return prioritized[0];
}

function extractTopKeyword(provider: any): string | null {
    const targetKeywords = ['natural', 'subtle', 'conservative', 'honest', 'gentle'];
    const reviews = provider.top_reviews || [];
    const counts: Record<string, number> = {};

    reviews.forEach((r: any) => {
        if (!r.text) return;
        const text = r.text.toLowerCase();
        targetKeywords.forEach(k => {
            if (text.includes(k)) {
                counts[k] = (counts[k] || 0) + 1;
            }
        });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
}

function getEmailTemplate(provider: any, topKeyword: string | null) {
    const hook = topKeyword
        ? `Your patients keep saying "${topKeyword}" — we noticed`
        : `Your ${provider.review_count} reviews in ${provider.city} — we noticed`;

    const bodyIntro = topKeyword
        ? `I've been building a directory specifically for injectors known for ${topKeyword} results — and your name kept coming up.`
        : `I've been building a directory specifically for injectors in ${provider.city} who have built a massive reputation — and your name kept coming up.`;

    return {
        subject: hook,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: serif; font-size: 28px; font-weight: 800; color: #1a2332;">
                        ${NICHE.brandName}<span style="color: #d4af37;">${NICHE.brandSuffix}</span><span style="font-weight: 400; font-size: 16px; color: #94a3b8;">.com</span>
                    </div>
                </div>
                
                <p>Hi ${provider.name},</p>
                
                <p>${bodyIntro}</p>
                
                <p>Your ${provider.review_count} reviews speak for themselves.</p>
                
                <p>We built <a href="https://${NICHE.domain}" style="color: #d4af37; font-weight: bold; text-decoration: none;">${NICHE.siteName}</a> around exactly what your patients value — providers who don't overdo it. Your listing is live and ranking based on that reputation.</p>
                
                <p><strong>Your listing:</strong> <a href="https://${NICHE.domain}/provider/${provider.slug}" style="color: #1a2332; text-decoration: underline;">https://${NICHE.domain}/provider/${provider.slug}</a></p>
                
                <p>Nothing needed from you — just wanted you to know you're there and why.</p>
                
                <p>${NICHE.outreach.senderName}<br>Founder, ${NICHE.siteName}</p>
                
                <p style="font-size: 14px; margin-top: 20px;"><strong>PS:</strong> We're sending patient inquiries from ${provider.city} to listed providers for free right now.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 11px; color: #999; text-align: center;">
                    You are receiving this because your clinic is listed on ${NICHE.siteName}.<br>
                    To unsubscribe, reply "Unsubscribe" or <a href="https://${NICHE.domain}/unsubscribe?domain=${encodeURIComponent(provider.website || '')}" style="color: #999;">click here</a>.
                </p>
            </div>
        `
    };
}

async function runLaunch() {
    console.log('--- TRACK B OUTREACH LAUNCH (Smarter Scraper + Personalization, Cap 50) ---');

    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, city, website, slug, enriched_attrs, outreach_status, top_reviews, review_count')
        .gte('rating', 4.7)
        .gte('review_count', 75)
        .eq('outreach_status', 'not_sent')
        .not('website', 'is', null)
        .order('review_count', { ascending: false });

    if (error) {
        console.error('Error fetching candidates:', error);
        return;
    }

    console.log(`Found ${providers?.length || 0} potential candidates.`);

    let sentToday = 0;
    const MAX_SENDS = 50;

    for (const provider of (providers || [])) {
        if (sentToday >= MAX_SENDS) {
            console.log('\n--- REACHED SEND CAP (50) ---');
            break;
        }

        console.log(`\n[${sentToday + 1}/${MAX_SENDS}] Processing: ${provider.name} (${provider.city})...`);

        // 1. Get/Scrape email
        let email = provider.enriched_attrs?.email;
        if (!email) {
            email = await scrapeEmailSmart(provider.website, provider.name);
        }

        if (!email) {
            console.log(`  No valid email found after checking pages. Marking 'no_email'.`);
            await supabase.from('providers').update({ outreach_status: 'no_email' }).eq('id', provider.id);
            continue;
        }

        console.log(`  Target email: ${email}`);

        // 2. Personalization
        const topKeyword = extractTopKeyword(provider);
        if (topKeyword) console.log(`  Personalized with keyword: ${topKeyword}`);

        // 3. Save email if new
        if (!provider.enriched_attrs?.email) {
            const newAttrs = { ...(provider.enriched_attrs || {}), email };
            await supabase.from('providers').update({
                enriched_attrs: newAttrs
            }).eq('id', provider.id);
        }

        // 4. Send
        console.log(`  Sending outreach...`);
        const template = getEmailTemplate(provider, topKeyword);

        try {
            const { data, error: sendError } = await resend.emails.send({
                from: SENDER,
                to: email,
                subject: template.subject,
                html: template.html,
            });

            if (sendError) {
                console.error(`  Failed to send:`, sendError);
                continue;
            }

            console.log(`  Successfully sent! ID: ${data?.id}`);

            await supabase.from('providers').update({
                outreach_status: 'notified',
                date_sent: new Date().toISOString()
            }).eq('id', provider.id);

            sentToday++;
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.error(`  Error:`, err);
        }
    }

    console.log('\n--- LAUNCH COMPLETE ---');
    console.log(`Total sent: ${sentToday}`);
}

runLaunch();
