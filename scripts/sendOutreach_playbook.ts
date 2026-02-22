
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
    price_per_unit?: number;
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

function getSubjectLine(provider: Provider): string {
    return `Patients in ${provider.city} are looking for you on ${NICHE.siteName}`;
}

function getEmailTemplate(provider: Provider) {
    return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a2332; max-width: 600px; font-size: 16px;">
            <p>Hi ${provider.name},</p>
            
            <p>Patients in <strong>${provider.city}</strong> are already finding your practice on <strong>${NICHE.siteName}</strong> — the independent index for aesthetic medicine providers ranked by verified credentials, transparent pricing, and natural results.</p>
            
            <p>Your listing is live right now, but your pricing shows as <strong>"Not Listed"</strong> and patients filter past that.</p>
            
            <p>Claiming your profile is free and takes 2 minutes. No credit card, no commitment — just your practice represented accurately.</p>
            
            <p style="margin: 30px 0;">
                <a href="https://${NICHE.domain}/claim/${provider.slug}" style="background-color: #1a2332; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Claim Your Free Profile →</a>
            </p>
            
            <p>Best,</p>
            
            <p><strong>${NICHE.outreach.senderName}</strong><br>
            Founder, ${NICHE.siteName}<br>
            <span style="color: #64748b; font-size: 14px;">Built for patients. Trusted by providers.</span></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 11px; color: #999;">
                You are receiving this because your clinic is listed on ${NICHE.siteName}.<br>
                To unsubscribe, reply "Unsubscribe" or <a href="https://${NICHE.domain}/unsubscribe?id=${provider.id}" style="color: #999;">click here</a>.
            </p>
        </div>
    `;
}

async function runOutreach(targetCount = 10) {
    console.log(`--- STARTING PLAYBOOK OUTREACH (Target: ${targetCount}) ---`);

    // Fetch all providers that haven't been contacted yet
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .in('outreach_status', ['not_sent', 'no_email', 'notified'])
        .not('enriched_attrs', 'is', null);

    if (error || !providers) {
        console.error('Error fetching providers:', error);
        return;
    }

    let sent = 0;

    for (const provider of providers) {
        if (sent >= targetCount) break;

        // Find email address
        let email = (provider as any).email;
        if (!email && provider.enriched_attrs?.email) {
            email = provider.enriched_attrs.email;
        }

        if (!email) {
            continue; // SILENTLY SKIP
        }

        const subject = getSubjectLine(provider);
        const html = getEmailTemplate(provider);

        console.log(`[${sent + 1}/${targetCount}] Sending to: ${provider.name} (${email})`);
        console.log(`  Subject: ${subject}`);

        try {
            const { error: sendError } = await resend.emails.send({
                from: `${NICHE.outreach.senderName} <${NICHE.outreach.senderEmail}>`,
                to: email,
                subject: subject,
                html: html
            });

            if (sendError) {
                console.error(`  Failed to send to ${provider.name}:`, sendError);
                continue;
            }

            await supabase
                .from('providers')
                .update({
                    outreach_status: 'email_1_sent',
                    date_sent: new Date().toISOString()
                })
                .eq('id', provider.id);

            sent++;
            // Small delay to avoid Resend rate limits
            await new Promise(resolve => setTimeout(resolve, 800));
        } catch (e) {
            console.error(`  Exception sending to ${provider.name}:`, e);
        }
    }

    console.log(`\nOutreach batch complete. Total sent: ${sent}`);
}

runOutreach(50);
