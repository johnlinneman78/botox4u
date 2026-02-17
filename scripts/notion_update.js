const https = require('https');

const NOTION_TOKEN = process.env.NOTION_API_KEY || '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';
const NOTION_VERSION = '2022-06-28';

function makeNotionRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = jsonData.length;
        }

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function findDatabases() {
    const response = await makeNotionRequest('POST', '/v1/search', {
        filter: { property: 'object', value: 'database' },
        sort: { direction: 'descending', timestamp: 'last_edited_time' }
    });

    const databases = {};
    for (const db of response.results) {
        const title = db.title[0]?.plain_text || '';
        if (title === 'Provider Database') databases.providers = db.id;
        if (title === 'Content Calendar') databases.content = db.id;
        if (title === 'SEO Performance Tracker') databases.seo = db.id;
        if (title === 'Revenue Tracker') databases.revenue = db.id;
        if (title === 'Development Tasks') databases.tasks = db.id;
    }

    return databases;
}

async function createPage(databaseId, properties) {
    return makeNotionRequest('POST', '/v1/pages', {
        parent: { database_id: databaseId },
        properties: properties
    });
}

// Marketing updates
async function logMarketingActivity(databases, activity) {
    console.log(`\n📢 Logging Marketing Activity: ${activity.type}`);

    await createPage(databases.content, {
        'Name': { title: [{ text: { content: activity.name } }] },
        'Content Type': { select: { name: activity.contentType || 'Blog Post' } },
        'Status': { select: { name: activity.status || 'Planned' } },
        'Priority': { select: { name: activity.priority || 'Medium' } },
        'Target Keywords': { multi_select: (activity.keywords || []).map(k => ({ name: k })) }
    });

    console.log(`  ✅ Added: ${activity.name}`);
}

// Development updates
async function logDevelopmentTask(databases, task) {
    console.log(`\n💻 Logging Development Task: ${task.name}`);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (task.daysUntilDue || 7));

    await createPage(databases.tasks, {
        'Name': { title: [{ text: { content: task.name } }] },
        'Task Type': { select: { name: task.type || 'Feature' } },
        'Sprint': { select: { name: task.sprint || 'Sprint 1 - MVP' } },
        'Priority': { select: { name: task.priority || 'Medium' } },
        'Status': { select: { name: task.status || 'Backlog' } },
        'Due Date': { date: { start: dueDate.toISOString().split('T')[0] } },
        'Estimated Hours': { number: task.hours || 4 }
    });

    console.log(`  ✅ Added: ${task.name}`);
}

// Financial updates
async function logRevenue(databases, revenue) {
    console.log(`\n💰 Logging Revenue: ${revenue.source}`);

    await createPage(databases.revenue, {
        'Name': { title: [{ text: { content: revenue.description } }] },
        'Revenue Source': { select: { name: revenue.source } },
        'Amount': { number: revenue.amount },
        'Date': { date: { start: revenue.date || new Date().toISOString().split('T')[0] } },
        'Status': { select: { name: revenue.status || 'Pending' } },
        'MRR': { checkbox: revenue.isRecurring || false },
        'Stripe ID': { rich_text: [{ text: { content: revenue.stripeId || '' } }] }
    });

    console.log(`  ✅ Added: $${revenue.amount} from ${revenue.source}`);
}

// Provider updates
async function addProvider(databases, provider) {
    console.log(`\n👤 Adding Provider: ${provider.name}`);

    await createPage(databases.providers, {
        'Name': { title: [{ text: { content: provider.name } }] },
        'Business Name': { rich_text: [{ text: { content: provider.businessName || provider.name } }] },
        'City': { select: { name: provider.city } },
        'State': { select: { name: provider.state } },
        'Specialty': { multi_select: (provider.specialties || ['Botox']).map(s => ({ name: s })) },
        'Status': { select: { name: provider.status || 'Active' } },
        'Subscription Tier': { select: { name: provider.tier || 'Free' } },
        'Monthly Revenue': { number: provider.monthlyRevenue || 0 },
        'Lead Count': { number: 0 },
        'Claimed': { checkbox: provider.claimed || false },
        'Email': provider.email ? { email: provider.email } : undefined,
        'Phone': provider.phone ? { phone_number: provider.phone } : undefined,
        'Website': provider.website ? { url: provider.website } : undefined,
        'Date Added': { date: { start: new Date().toISOString().split('T')[0] } }
    });

    console.log(`  ✅ Added: ${provider.name} in ${provider.city}, ${provider.state}`);
}

// SEO updates
async function logSEOKeyword(databases, keyword) {
    console.log(`\n🔍 Tracking SEO Keyword: ${keyword.term}`);

    await createPage(databases.seo, {
        'Name': { title: [{ text: { content: keyword.term } }] },
        'Target Keyword': { rich_text: [{ text: { content: keyword.term } }] },
        'Page URL': keyword.url ? { url: keyword.url } : undefined,
        'Current Rank': { number: keyword.rank || 0 },
        'Previous Rank': { number: keyword.rank || 0 },
        'Organic Traffic': { number: keyword.traffic || 0 },
        'Impressions': { number: keyword.impressions || 0 },
        'CTR': { number: keyword.ctr || 0 },
        'Status': { select: { name: 'Stable' } },
        'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } }
    });

    console.log(`  ✅ Tracking: ${keyword.term}`);
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    console.log('🔧 Notion Update Tool - Botox-4-U.com\n');

    try {
        const databases = await findDatabases();

        switch (command) {
            case 'marketing':
                await logMarketingActivity(databases, {
                    name: args[1] || 'New Marketing Campaign',
                    type: args[2] || 'campaign',
                    contentType: args[3] || 'Blog Post',
                    status: args[4] || 'Planned',
                    priority: args[5] || 'Medium'
                });
                break;

            case 'dev':
            case 'task':
                await logDevelopmentTask(databases, {
                    name: args[1] || 'New Development Task',
                    type: args[2] || 'Feature',
                    priority: args[3] || 'Medium',
                    status: args[4] || 'Backlog',
                    hours: parseInt(args[5]) || 4
                });
                break;

            case 'revenue':
                await logRevenue(databases, {
                    description: args[1] || 'New Revenue',
                    source: args[2] || 'Subscriptions',
                    amount: parseFloat(args[3]) || 0,
                    status: args[4] || 'Pending',
                    isRecurring: args[5] === 'true'
                });
                break;

            case 'provider':
                await addProvider(databases, {
                    name: args[1] || 'New Provider',
                    city: args[2] || 'Los Angeles',
                    state: args[3] || 'California',
                    tier: args[4] || 'Free'
                });
                break;

            case 'seo':
                await logSEOKeyword(databases, {
                    term: args[1] || 'botox near me',
                    rank: parseInt(args[2]) || 0,
                    traffic: parseInt(args[3]) || 0
                });
                break;

            default:
                console.log('Usage:');
                console.log('  node notion_update.js marketing "Campaign Name" "type" "Content Type" "Status" "Priority"');
                console.log('  node notion_update.js dev "Task Name" "Type" "Priority" "Status" hours');
                console.log('  node notion_update.js revenue "Description" "Source" amount "Status" isRecurring');
                console.log('  node notion_update.js provider "Name" "City" "State" "Tier"');
                console.log('  node notion_update.js seo "keyword" rank traffic');
                console.log('\nExamples:');
                console.log('  node notion_update.js marketing "Launch Instagram Campaign" "social" "Blog Post" "In Progress" "High"');
                console.log('  node notion_update.js dev "Add payment gateway" "Feature" "High" "In Progress" 8');
                console.log('  node notion_update.js revenue "First subscriber" "Subscriptions" 49 "Paid" true');
                console.log('  node notion_update.js provider "LA Med Spa" "Los Angeles" "California" "Basic ($49/mo)"');
                console.log('  node notion_update.js seo "botox los angeles" 15 250');
                process.exit(0);
        }

        console.log('\n✨ Update complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
