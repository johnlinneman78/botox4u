const https = require('https');

const NOTION_TOKEN = process.env.NOTION_API_KEY || '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';
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

const advancedDatabases = [
    {
        title: 'Keyword Research Hub',
        properties: {
            'Keyword': { title: {} },
            'Search Volume': { number: { format: 'number' } },
            'Difficulty': { number: { format: 'number' } },
            'CPC': { number: { format: 'dollar' } },
            'Intent': {
                select: {
                    options: [
                        { name: 'Commercial', color: 'green' },
                        { name: 'Informational', color: 'blue' },
                        { name: 'Navigational', color: 'purple' },
                        { name: 'Transactional', color: 'red' }
                    ]
                }
            },
            'Status': {
                select: {
                    options: [
                        { name: 'New', color: 'gray' },
                        { name: 'Researching', color: 'yellow' },
                        { name: 'Targeted', color: 'blue' },
                        { name: 'Ranking', color: 'green' }
                    ]
                }
            },
            'Current Rank': { number: { format: 'number' } },
            'Target URL': { url: {} },
            'Imported On': { date: {} },
            'Imported Batch': { rich_text: {} },
            'Notes': { rich_text: {} }
        }
    },
    {
        title: 'Programmatic Pages Tracker',
        properties: {
            'Page Title': { title: {} },
            'URL': { url: {} },
            'Template': {
                select: {
                    options: [
                        { name: 'City Page', color: 'blue' },
                        { name: 'State Page', color: 'green' },
                        { name: 'Treatment Page', color: 'purple' },
                        { name: 'Provider Page', color: 'pink' }
                    ]
                }
            },
            'City': { rich_text: {} },
            'State': { select: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Planned', color: 'gray' },
                        { name: 'Generated', color: 'yellow' },
                        { name: 'Published', color: 'green' },
                        { name: 'Indexed', color: 'blue' }
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
            'Target Keywords': { multi_select: {} },
            'Word Count': { number: { format: 'number' } },
            'Impressions': { number: { format: 'number' } },
            'Clicks': { number: { format: 'number' } },
            'CTR': { number: { format: 'percent' } },
            'Avg Position': { number: { format: 'number' } },
            'Created Date': { date: {} },
            'Last Updated': { date: {} },
            'Target Page': { relation: { database_id: '' } } // Will be set after Content Pipeline is created
        }
    },
    {
        title: 'KPI Tracker',
        properties: {
            'Metric Name': { title: {} },
            'Category': {
                select: {
                    options: [
                        { name: 'Traffic', color: 'blue' },
                        { name: 'Revenue', color: 'green' },
                        { name: 'Providers', color: 'purple' },
                        { name: 'Content', color: 'yellow' },
                        { name: 'SEO', color: 'pink' }
                    ]
                }
            },
            'Current Value': { number: { format: 'number' } },
            'Target Value': { number: { format: 'number' } },
            'Unit': {
                select: {
                    options: [
                        { name: 'Number', color: 'gray' },
                        { name: 'Dollars', color: 'green' },
                        { name: 'Percent', color: 'blue' },
                        { name: 'Pages', color: 'purple' }
                    ]
                }
            },
            'Progress': { number: { format: 'percent' } },
            'Status': {
                select: {
                    options: [
                        { name: 'On Track', color: 'green' },
                        { name: 'At Risk', color: 'yellow' },
                        { name: 'Behind', color: 'red' }
                    ]
                }
            },
            'Month': { date: {} },
            'Notes': { rich_text: {} }
        }
    },
    {
        title: 'Financial Model',
        properties: {
            'Line Item': { title: {} },
            'Category': {
                select: {
                    options: [
                        { name: 'Revenue', color: 'green' },
                        { name: 'Cost of Goods', color: 'orange' },
                        { name: 'Operating Expense', color: 'red' },
                        { name: 'Marketing', color: 'blue' },
                        { name: 'Development', color: 'purple' }
                    ]
                }
            },
            'Month 1': { number: { format: 'dollar' } },
            'Month 2': { number: { format: 'dollar' } },
            'Month 3': { number: { format: 'dollar' } },
            'Month 6': { number: { format: 'dollar' } },
            'Month 12': { number: { format: 'dollar' } },
            'Annual Total': { number: { format: 'dollar' } },
            'Type': {
                select: {
                    options: [
                        { name: 'Recurring', color: 'green' },
                        { name: 'One-time', color: 'gray' },
                        { name: 'Variable', color: 'yellow' }
                    ]
                }
            },
            'Notes': { rich_text: {} }
        }
    }
];

async function main() {
    console.log('🚀 Creating Advanced Notion Databases...\n');

    const createdDbs = {};

    for (const db of advancedDatabases) {
        try {
            const result = await createDatabase(db.title, db.properties);
            createdDbs[db.title] = result.id;
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Error creating ${db.title}:`, error.message);
        }
    }

    // Now update Content Pipeline to add relation to Programmatic Pages
    if (createdDbs['Programmatic Pages Tracker']) {
        console.log('\n🔗 Setting up database relations...');
        // This would require updating the Content Pipeline database
        // For now, we'll note this in the documentation
        console.log('  Note: Manually add "Target Page" relation in Programmatic Pages Tracker');
        console.log('  Point it to: Content Calendar database');
    }

    console.log('\n✨ Advanced database creation complete!');
    console.log('\n📝 Created databases:');
    Object.keys(createdDbs).forEach(name => {
        console.log(`  - ${name}`);
    });
}

main();
