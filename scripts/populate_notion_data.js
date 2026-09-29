const https = require('https');

const NOTION_TOKEN = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

// Database IDs - we'll need to find these first
let DATABASE_IDS = {};

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
    console.log('🔍 Finding databases...');
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

    console.log('Found databases:', Object.keys(databases));
    return databases;
}

async function createPage(databaseId, properties) {
    return makeNotionRequest('POST', '/v1/pages', {
        parent: { database_id: databaseId },
        properties: properties
    });
}

async function populateDevelopmentTasks(dbId) {
    console.log('\n📋 Populating Development Tasks...');

    const tasks = [
        {
            name: 'Set up Next.js project with App Router',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'Critical',
            status: 'Done',
            hours: 4
        },
        {
            name: 'Configure Supabase database and authentication',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'Critical',
            status: 'In Progress',
            hours: 6
        },
        {
            name: 'Create provider database schema',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'High',
            status: 'Backlog',
            hours: 3
        },
        {
            name: 'Build city page template with ISR',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'High',
            status: 'Backlog',
            hours: 8
        },
        {
            name: 'Implement provider listing component',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'High',
            status: 'Backlog',
            hours: 6
        },
        {
            name: 'Set up Stripe integration',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'Medium',
            status: 'Backlog',
            hours: 8
        },
        {
            name: 'Create sitemap generation script',
            type: 'SEO',
            sprint: 'Sprint 1 - MVP',
            priority: 'High',
            status: 'Backlog',
            hours: 4
        },
        {
            name: 'Implement provider claim workflow',
            type: 'Feature',
            sprint: 'Sprint 2 - Scale',
            priority: 'Medium',
            status: 'Backlog',
            hours: 10
        },
        {
            name: 'Build provider dashboard',
            type: 'Feature',
            sprint: 'Sprint 2 - Scale',
            priority: 'Medium',
            status: 'Backlog',
            hours: 12
        },
        {
            name: 'Create lead generation forms',
            type: 'Feature',
            sprint: 'Sprint 3 - Monetize',
            priority: 'High',
            status: 'Backlog',
            hours: 6
        },
        {
            name: 'Implement analytics tracking',
            type: 'Feature',
            sprint: 'Sprint 2 - Scale',
            priority: 'Medium',
            status: 'Backlog',
            hours: 4
        },
        {
            name: 'Set up Vercel deployment',
            type: 'Feature',
            sprint: 'Sprint 1 - MVP',
            priority: 'Critical',
            status: 'Done',
            hours: 2
        }
    ];

    for (const task of tasks) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (task.status === 'Backlog' ? 30 : 7));

        await createPage(dbId, {
            'Name': { title: [{ text: { content: task.name } }] },
            'Task Type': { select: { name: task.type } },
            'Sprint': { select: { name: task.sprint } },
            'Priority': { select: { name: task.priority } },
            'Status': { select: { name: task.status } },
            'Due Date': { date: { start: dueDate.toISOString().split('T')[0] } },
            'Estimated Hours': { number: task.hours }
        });
        console.log(`  ✅ ${task.name}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

async function populateContentCalendar(dbId) {
    console.log('\n📅 Populating Content Calendar...');

    const cities = [
        { city: 'Los Angeles', state: 'California', priority: 'High' },
        { city: 'New York', state: 'New York', priority: 'High' },
        { city: 'Miami', state: 'Florida', priority: 'High' },
        { city: 'Chicago', state: 'Illinois', priority: 'Medium' },
        { city: 'Houston', state: 'Texas', priority: 'Medium' },
        { city: 'Phoenix', state: 'Arizona', priority: 'Medium' },
        { city: 'San Francisco', state: 'California', priority: 'High' },
        { city: 'Dallas', state: 'Texas', priority: 'Medium' },
        { city: 'San Diego', state: 'California', priority: 'Medium' },
        { city: 'Atlanta', state: 'Georgia', priority: 'Medium' }
    ];

    for (const location of cities) {
        await createPage(dbId, {
            'Name': { title: [{ text: { content: `Botox in ${location.city}, ${location.state}` } }] },
            'Content Type': { select: { name: 'City Page' } },
            'Target City': { rich_text: [{ text: { content: location.city } }] },
            'Target State': { select: { name: location.state } },
            'Target Keywords': {
                multi_select: [
                    { name: `botox ${location.city.toLowerCase()}` },
                    { name: `botox near me` }
                ]
            },
            'Status': { select: { name: 'Planned' } },
            'Priority': { select: { name: location.priority } },
            'Word Count': { number: 1500 }
        });
        console.log(`  ✅ ${location.city}, ${location.state}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Add blog posts
    const blogPosts = [
        'Complete Guide to Botox: What You Need to Know',
        'Botox vs Dysport: Which is Right for You?',
        'How Much Does Botox Cost in 2026?',
        'Botox Safety: Common Myths Debunked'
    ];

    for (const post of blogPosts) {
        await createPage(dbId, {
            'Name': { title: [{ text: { content: post } }] },
            'Content Type': { select: { name: 'Blog Post' } },
            'Status': { select: { name: 'Planned' } },
            'Priority': { select: { name: 'Medium' } },
            'Word Count': { number: 2000 }
        });
        console.log(`  ✅ ${post}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

async function populateSEOTracker(dbId) {
    console.log('\n📊 Populating SEO Performance Tracker...');

    const keywords = [
        { keyword: 'botox near me', rank: 0, traffic: 0 },
        { keyword: 'botox los angeles', rank: 0, traffic: 0 },
        { keyword: 'botox cost', rank: 0, traffic: 0 },
        { keyword: 'best botox provider', rank: 0, traffic: 0 },
        { keyword: 'botox injections', rank: 0, traffic: 0 }
    ];

    for (const kw of keywords) {
        await createPage(dbId, {
            'Name': { title: [{ text: { content: kw.keyword } }] },
            'Target Keyword': { rich_text: [{ text: { content: kw.keyword } }] },
            'Current Rank': { number: kw.rank },
            'Previous Rank': { number: kw.rank },
            'Organic Traffic': { number: kw.traffic },
            'Impressions': { number: 0 },
            'CTR': { number: 0 },
            'Status': { select: { name: 'Stable' } },
            'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } }
        });
        console.log(`  ✅ ${kw.keyword}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

async function populateProviders(dbId) {
    console.log('\n👥 Populating Provider Database (sample data)...');

    const providers = [
        {
            name: 'Beverly Hills Aesthetics',
            business: 'Beverly Hills Aesthetics Medical Spa',
            city: 'Los Angeles',
            state: 'California',
            specialties: ['Botox', 'Dermal Fillers'],
            status: 'Active',
            tier: 'Free',
            claimed: false
        },
        {
            name: 'Manhattan Dermatology',
            business: 'Manhattan Dermatology & Cosmetics',
            city: 'New York',
            state: 'New York',
            specialties: ['Botox', 'Dysport'],
            status: 'Active',
            tier: 'Free',
            claimed: false
        },
        {
            name: 'Miami Med Spa',
            business: 'Miami Medical Spa & Wellness',
            city: 'Miami',
            state: 'Florida',
            specialties: ['Botox', 'Lip Fillers', 'Dermal Fillers'],
            status: 'Active',
            tier: 'Free',
            claimed: false
        }
    ];

    for (const provider of providers) {
        await createPage(dbId, {
            'Name': { title: [{ text: { content: provider.name } }] },
            'Business Name': { rich_text: [{ text: { content: provider.business } }] },
            'City': { select: { name: provider.city } },
            'State': { select: { name: provider.state } },
            'Specialty': { multi_select: provider.specialties.map(s => ({ name: s })) },
            'Status': { select: { name: provider.status } },
            'Subscription Tier': { select: { name: provider.tier } },
            'Monthly Revenue': { number: 0 },
            'Lead Count': { number: 0 },
            'Claimed': { checkbox: provider.claimed },
            'Date Added': { date: { start: new Date().toISOString().split('T')[0] } }
        });
        console.log(`  ✅ ${provider.name}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

async function main() {
    console.log('🚀 Populating Notion Databases...\n');

    try {
        DATABASE_IDS = await findDatabases();

        if (DATABASE_IDS.tasks) {
            await populateDevelopmentTasks(DATABASE_IDS.tasks);
        }

        if (DATABASE_IDS.content) {
            await populateContentCalendar(DATABASE_IDS.content);
        }

        if (DATABASE_IDS.seo) {
            await populateSEOTracker(DATABASE_IDS.seo);
        }

        if (DATABASE_IDS.providers) {
            await populateProviders(DATABASE_IDS.providers);
        }

        console.log('\n✨ Database population complete!');
        console.log('\n📝 Summary:');
        console.log('  - Development Tasks: 12 tasks added');
        console.log('  - Content Calendar: 14 items added (10 cities + 4 blog posts)');
        console.log('  - SEO Tracker: 5 keywords added');
        console.log('  - Providers: 3 sample providers added');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
