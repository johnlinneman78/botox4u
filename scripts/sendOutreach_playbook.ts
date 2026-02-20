
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';
import { NICHE } from '../config/niche';

dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface Provider {
    id: string;
    name: string;
    city: string;
    rating: number;
    review_count: number;
    slug: string;
    website: string;
    top_badge?: string;
    top_reviews: any[];
    email_primary?: string;
    email_confidence?: number;
    email_secondary?: string[];
    enriched_attrs?: any;
    outreach_status: string;
}

function getCityTier(city: string): number {
    const tier1 = ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Dallas', 'Houston', 'Atlanta', 'Las Vegas', 'San Diego', 'Boston'];
    const tier2 = ['Austin', 'Nashville', 'Denver', 'Seattle', 'Phoenix', 'Charlotte', 'Tampa', 'Portland', 'Minneapolis', 'Philadelphia', 'Scottsdale'];

    if (tier1.some(c => city.includes(c))) return 1;
    if (tier2.some(c => city.includes(c))) return 2;
    return 3;
}

function getTopKeyword(reviews: any[]): string | null {
    if (!reviews || reviews.length === 0) return null;
    const keywords = ['natural', 'subtle', 'conservative', 'gentle', 'honest', 'painless', 'recommend'];
    const text = reviews.map(r => (r.text || '').toLowerCase()).join(' ');

    for (const keyword of keywords) {
        const count = (text.match(new RegExp(keyword, 'g')) || []).length;
        if (count >= 3) return keyword;
    }
    return null;
}

function getSubjectLine(provider: Provider, tier: number): string {
    const keyword = getTopKeyword(provider.top_reviews);
    if (keyword) return `Your patients keep saying '${keyword}' — we noticed`;

    if (provider.top_badge) {
        if (tier === 1) return `${provider.top_badge} in ${provider.city} — your patients agree`;
        if (tier === 2) return `${provider.top_badge} status in ${provider.city} — your listing is live`;
        if (tier === 3) return `${provider.top_badge} + ${provider.review_count} reviews — your listing is live`;
    }

    if (tier === 1) {
        if (provider.review_count > 500) return `The most-reviewed injectors in ${provider.city} — you're on the list`;
        if (provider.review_count > 200) return `Your ${provider.review_count} reviews in ${provider.city} — we noticed`;
        return `Top-rated in ${provider.city}: ${provider.rating}★ from ${provider.review_count} patients`;
    }

    if (tier === 2) {
        if (provider.review_count > 300) return `One of ${provider.city}'s most trusted injectors — according to your patients`;
        if (provider.rating >= 4.8) return `${provider.review_count} reviews and a ${provider.rating}★ in ${provider.city} — that's earned`;
        return `Your ${provider.rating}★ from ${provider.review_count} patients in ${provider.city} — impressive`;
    }

    // Tier 3
    if (provider.rating >= 4.9 && provider.review_count > 200) return `4.9★ from ${provider.review_count} patients — we built something for providers like you`;
    if (provider.review_count > 400) return `Most injectors plateau at 50 reviews. You have ${provider.review_count}.`;
    if (provider.rating >= 4.8) return `A ${provider.rating}★ rating from ${provider.review_count} patients — that's not easy`;
    return `${provider.review_count} reviews and a ${provider.rating}★ — you're in rare company`;
}

function getEmailTemplate(provider: Provider, subject: string) {
    return `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1a2332; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-family: serif; font-size: 28px; font-weight: 800; color: #1a2332;">
                    ${NICHE.brandName}<span style="color: #d4af37;">${NICHE.brandSuffix}</span>
                </div>
            </div>
            
            <p>Hi ${provider.name.split(' ')[0]},</p>
            
            <p>I was looking through providers in ${provider.city} and your profile stood out.</p>
            
            <p>With <strong>${provider.review_count} reviews</strong> and a <strong>${provider.rating}★ rating</strong>, you've clearly built a massive reputation. Most clinics never reach that level of patient trust.</p>
            
            <p>We built <a href="https://${NICHE.domain}" style="color: #d4af37; font-weight: bold;">${NICHE.siteName}</a> specifically to highlight high-performing injectors like you. Your listing is already live and ranking based on your clinical excellence.</p>
            
            <p><strong>Review your listing here:</strong><br>
            <a href="https://${NICHE.domain}/provider/${provider.slug}">https://${NICHE.domain}/provider/${provider.slug}</a></p>
            
            <p>Nothing is needed from your end — we just wanted to make sure you saw where your reputation is being showcased.</p>
            
            <p>Best,<br>
            ${NICHE.outreach.senderName}<br>
            Founder, ${NICHE.siteName}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 11px; color: #999; text-align: center;">
                You are receiving this because your clinic is listed on ${NICHE.siteName}.<br>
                To unsubscribe, reply "Unsubscribe" or <a href="https://${NICHE.domain}/unsubscribe?id=${provider.id}" style="color: #999;">click here</a>.
            </p>
        </div>
    `;
}

async function runOutreach(limit = 10) {
    console.log('--- STARTING PLAYBOOK OUTREACH ---');

    // Fetch providers with scraped emails (either in columns or enriched_attrs)
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .eq('outreach_status', 'pending')
        .order('review_count', { ascending: false })
        .limit(limit);

    if (error || !providers) {
        console.error('Error fetching providers:', error);
        return;
    }

    let sent = 0;

    for (const provider of providers) {
        // Find email address
        let email = provider.email_primary;
        if (!email && provider.enriched_attrs?.email_playbook?.primary) {
            email = provider.enriched_attrs.email_playbook.primary;
        }

        if (!email) {
            console.log(`Skipping ${provider.name}: No email found.`);
            continue;
        }

        const tier = getCityTier(provider.city);
        const subject = getSubjectLine(provider, tier);
        const html = getEmailTemplate(provider, subject);

        console.log(`Sending to: ${provider.name} (${email})`);
        console.log(`  Tier: ${tier} | Subject: ${subject}`);

        try {
            await resend.emails.send({
                from: `${NICHE.outreach.senderName} <${NICHE.outreach.senderEmail}>`,
                to: email,
                subject: subject,
                html: html
            });

            await supabase
                .from('providers')
                .update({
                    outreach_status: 'email_1_sent',
                    date_sent: new Date().toISOString()
                })
                .eq('id', provider.id);

            sent++;
            // Small delay to avoid Resend rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            console.error(`  Failed to send to ${provider.name}:`, e);
        }
    }

    console.log(`\nOutreach batch complete. Total sent: ${sent}`);
}

runOutreach(10);
