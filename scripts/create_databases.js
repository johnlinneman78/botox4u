const https = require('https');

// The MCP server must have a token - let's check process.env
const NOTION_TOKEN = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
    console.error('No Notion token found in environment');
    console.log('Checking all environment variables for NOTION...');
    const notionVars = Object.keys(process.env).filter(k => k.toUpperCase().includes('NOTION'));
    console.log('Found:', notionVars.length > 0 ? notionVars : 'None');
    console.log('\nPlease set NOTION_API_KEY or NOTION_TOKEN environment variable');
    console.log('Get your token from: https://www.notion.so/my-integrations');
    process.exit(1);
}

const PARENT_PAGE_ID = '309baf92-cb44-813c-b5b3-f160fb4c73b8';

function createDatabase(title, properties) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
            title: [{ type: 'text', text: { content: title } }],
            properties: properties
        });

        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: '/v1/databases',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ Created: ${title}`);
                    resolve(JSON.parse(body));
                } else {
                    console.error(`❌ Failed: ${title} (${res.statusCode})`);
                    console.error(body);
                    reject(new Error(body));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Database configurations
const databases = [
    {
        title: 'Provider Database',
        properties: {
            'Name': { title: {} },
            'Business Name': { rich_text: {} },
            'City': { select: {} },
            'State': { select: {} },
            'Specialty': {
                multi_select: {
                    options: [
                        { name: 'Botox', color: 'blue' },
                        { name: 'Dermal Fillers', color: 'purple' },
                        { name: 'Lip Fillers', color: 'pink' },
                        { name: 'Dysport', color: 'green' },
                        { name: 'Xeomin', color: 'yellow' }
                    ]
                }
            },
            'Status': {
                select: {
                    options: [
                        { name: 'Active', color: 'green' },
                        { name: 'Pending', color: 'yellow' },
                        { name: 'Inactive', color: 'red' }
                    ]
                }
            },
            'Subscription Tier': {
                select: {
                    options: [
                        { name: 'Free', color: 'gray' },
                        { name: 'Basic ($49/mo)', color: 'blue' },
                        { name: 'Premium ($99/mo)', color: 'purple' },
                        { name: 'Elite ($199/mo)', color: 'red' }
                    ]
                }
            },
            'Monthly Revenue': { number: { format: 'dollar' } },
            'Lead Count': { number: { format: 'number' } },
            'Claimed': { checkbox: {} },
            'Email': { email: {} },
            'Phone': { phone_number: {} },
            'Website': { url: {} },
            'Date Added': { date: {} }
        }
    },
    {
        title: 'Content Calendar',
        properties: {
            'Name': { title: {} },
            'Content Type': {
                select: {
                    options: [
                        { name: 'City Page', color: 'blue' },
                        { name: 'State Page', color: 'green' },
                        { name: 'Blog Post', color: 'purple' },
                        { name: 'FAQ', color: 'yellow' },
                        { name: 'Provider Profile', color: 'pink' }
                    ]
                }
            },
            'Target City': { rich_text: {} },
            'Target State': { select: {} },
            'Target Keywords': { multi_select: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Planned', color: 'gray' },
                        { name: 'In Progress', color: 'yellow' },
                        { name: 'Published', color: 'green' },
                        { name: 'Needs Update', color: 'orange' }
                    ]
                }
            },
            'Priority': {
                select: {
                    options: [
                        { name: 'High', color: 'red' },
                        { name: 'Medium', color: 'yellow' },
                        { name: 'Low', color: 'gray' }
                    ]
                }
            },
            'Publish Date': { date: {} },
            'URL': { url: {} },
            'Word Count': { number: { format: 'number' } }
        }
    },
    {
        title: 'SEO Performance Tracker',
        properties: {
            'Name': { title: {} },
            'Target Keyword': { rich_text: {} },
            'Page URL': { url: {} },
            'Current Rank': { number: { format: 'number' } },
            'Previous Rank': { number: { format: 'number' } },
            'Organic Traffic': { number: { format: 'number' } },
            'Impressions': { number: { format: 'number' } },
            'CTR': { number: { format: 'percent' } },
            'Status': {
                select: {
                    options: [
                        { name: 'Improving', color: 'green' },
                        { name: 'Stable', color: 'blue' },
                        { name: 'Declining', color: 'red' }
                    ]
                }
            },
            'Last Updated': { date: {} }
        }
    },
    {
        title: 'Revenue Tracker',
        properties: {
            'Name': { title: {} },
            'Revenue Source': {
                select: {
                    options: [
                        { name: 'Subscriptions', color: 'blue' },
                        { name: 'Lead Generation', color: 'green' },
                        { name: 'Featured Listings', color: 'purple' },
                        { name: 'Advertising', color: 'yellow' }
                    ]
                }
            },
            'Amount': { number: { format: 'dollar' } },
            'Date': { date: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Paid', color: 'green' },
                        { name: 'Pending', color: 'yellow' },
                        { name: 'Failed', color: 'red' }
                    ]
                }
            },
            'MRR': { checkbox: {} },
            'Stripe ID': { rich_text: {} }
        }
    },
    {
        title: 'Development Tasks',
        properties: {
            'Name': { title: {} },
            'Task Type': {
                select: {
                    options: [
                        { name: 'Feature', color: 'blue' },
                        { name: 'Bug Fix', color: 'red' },
                        { name: 'Enhancement', color: 'purple' },
                        { name: 'SEO', color: 'green' },
                        { name: 'Content', color: 'yellow' }
                    ]
                }
            },
            'Sprint': {
                select: {
                    options: [
                        { name: 'Sprint 1 - MVP', color: 'blue' },
                        { name: 'Sprint 2 - Scale', color: 'purple' },
                        { name: 'Sprint 3 - Monetize', color: 'green' }
                    ]
                }
            },
            'Priority': {
                select: {
                    options: [
                        { name: 'Critical', color: 'red' },
                        { name: 'High', color: 'orange' },
                        { name: 'Medium', color: 'yellow' },
                        { name: 'Low', color: 'gray' }
                    ]
                }
            },
            'Status': {
                select: {
                    options: [
                        { name: 'Backlog', color: 'gray' },
                        { name: 'In Progress', color: 'yellow' },
                        { name: 'Testing', color: 'blue' },
                        { name: 'Done', color: 'green' }
                    ]
                }
            },
            'Due Date': { date: {} },
            'Estimated Hours': { number: { format: 'number' } }
        }
    }
];

async function main() {
    console.log('🚀 Creating Notion Databases...\n');

    for (const db of databases) {
        try {
            await createDatabase(db.title, db.properties);
            await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
        } catch (error) {
            console.error(`Error creating ${db.title}:`, error.message);
        }
    }

    console.log('\n✨ Database creation complete!');
}

main();
