const { Resend } = require('resend');
require('dotenv').config({ path: '.env.prod' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkStats() {
    console.log('📊 Fetching Resend Email Statistics...');

    try {
        const { data, error } = await resend.emails.list({ limit: 100 });

        if (error) {
            console.error('❌ Resend API Error:', error);
            return;
        }

        if (!data || !data.data) {
            console.log('ℹ️ No email data found.');
            return;
        }

        const emails = data.data;
        const total = emails.length;

        if (total > 0) {
            console.log('--- Debug: First Email Object ---');
            console.log(JSON.stringify(emails[0], null, 2));
        }

        const stats = {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            complained: 0,
            failed: 0
        };

        emails.forEach(email => {
            const status = email.last_event;
            if (stats.hasOwnProperty(status)) {
                stats[status]++;
            } else if (status) {
                console.log(`Unknown status: ${status}`);
            }
        });

        console.log('\n--- Summary (Last ' + total + ' emails) ---');
        console.log(`Total Emails: ${total}`);
        Object.entries(stats).forEach(([status, count]) => {
            if (count > 0) {
                const percentage = ((count / total) * 100).toFixed(1);
                console.log(`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} (${percentage}%)`);
            }
        });

        console.log('\n--- Recent Activity ---');
        emails.slice(0, 10).forEach(email => {
            const date = new Date(email.created_at).toLocaleString();
            console.log(`[${date}] To: ${email.to.join(', ')} | Status: ${email.last_event} | Subject: ${email.subject}`);
        });

    } catch (err) {
        console.error('❌ Critical Error:', err.message);
    }
}

checkStats();
