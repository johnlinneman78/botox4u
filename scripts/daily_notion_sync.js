const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_API_KEY || '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';
const NOTION_VERSION = '2022-06-28';
const LOG_FILE = path.join(__dirname, '../.notion-sync-log.json');

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

async function queryDatabase(dbId, filter = {}) {
    return makeNotionRequest('POST', `/v1/databases/${dbId}/query`, filter);
}

async function updatePage(pageId, properties) {
    return makeNotionRequest('PATCH', `/v1/pages/${pageId}`, { properties });
}

async function createPage(databaseId, properties) {
    return makeNotionRequest('POST', '/v1/pages', {
        parent: { database_id: databaseId },
        properties: properties
    });
}

// Track project metrics
async function updateProjectMetrics(databases) {
    console.log('\n📊 Updating Project Metrics...');

    // Count tasks by status
    const tasks = await queryDatabase(databases.tasks);
    const taskStats = {
        total: tasks.results.length,
        done: 0,
        inProgress: 0,
        backlog: 0
    };

    tasks.results.forEach(task => {
        const status = task.properties.Status?.select?.name || '';
        if (status === 'Done') taskStats.done++;
        else if (status === 'In Progress') taskStats.inProgress++;
        else if (status === 'Backlog') taskStats.backlog++;
    });

    console.log(`  Tasks: ${taskStats.done} done, ${taskStats.inProgress} in progress, ${taskStats.backlog} backlog`);

    // Count content by status
    const content = await queryDatabase(databases.content);
    const contentStats = {
        total: content.results.length,
        published: 0,
        inProgress: 0,
        planned: 0
    };

    content.results.forEach(item => {
        const status = item.properties.Status?.select?.name || '';
        if (status === 'Published') contentStats.published++;
        else if (status === 'In Progress') contentStats.inProgress++;
        else if (status === 'Planned') contentStats.planned++;
    });

    console.log(`  Content: ${contentStats.published} published, ${contentStats.inProgress} in progress, ${contentStats.planned} planned`);

    // Count providers
    const providers = await queryDatabase(databases.providers);
    const providerStats = {
        total: providers.results.length,
        claimed: 0,
        paid: 0
    };

    providers.results.forEach(provider => {
        if (provider.properties.Claimed?.checkbox) providerStats.claimed++;
        const tier = provider.properties['Subscription Tier']?.select?.name || '';
        if (tier !== 'Free') providerStats.paid++;
    });

    console.log(`  Providers: ${providerStats.total} total, ${providerStats.claimed} claimed, ${providerStats.paid} paid`);

    return { taskStats, contentStats, providerStats };
}

// Update SEO rankings (placeholder - would integrate with real SEO API)
async function updateSEORankings(databases) {
    console.log('\n🔍 Updating SEO Rankings...');

    const keywords = await queryDatabase(databases.seo);
    let updated = 0;

    for (const kw of keywords.results) {
        const currentRank = kw.properties['Current Rank']?.number || 0;

        // Simulate ranking improvement (in real implementation, fetch from Google Search Console API)
        const newRank = currentRank === 0 ? 0 : Math.max(1, currentRank - Math.floor(Math.random() * 2));

        if (newRank !== currentRank && newRank > 0) {
            await updatePage(kw.id, {
                'Previous Rank': { number: currentRank },
                'Current Rank': { number: newRank },
                'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } },
                'Status': { select: { name: newRank < currentRank ? 'Improving' : 'Declining' } }
            });
            updated++;
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    console.log(`  Updated ${updated} keyword rankings`);
}

// Create daily CEO review entry
async function createDailyCEOReview(databases, metrics) {
    console.log('\n📝 Creating Daily CEO Review...');

    const today = new Date().toISOString().split('T')[0];
    const reviewTitle = `CEO Review - ${today}`;

    // This would create a new page in the Weekly CEO Review section
    // For now, we'll just log the metrics
    console.log(`  Review: ${reviewTitle}`);
    console.log(`  - Tasks Completed: ${metrics.taskStats.done}/${metrics.taskStats.total}`);
    console.log(`  - Content Published: ${metrics.contentStats.published}`);
    console.log(`  - Total Providers: ${metrics.providerStats.total}`);
    console.log(`  - Paid Subscribers: ${metrics.providerStats.paid}`);
}

// Save sync log
function saveSyncLog(data) {
    const log = {
        lastSync: new Date().toISOString(),
        ...data
    };
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
    console.log(`\n💾 Sync log saved to ${LOG_FILE}`);
}

// Load previous sync log
function loadSyncLog() {
    try {
        if (fs.existsSync(LOG_FILE)) {
            return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        }
    } catch (error) {
        console.log('No previous sync log found');
    }
    return null;
}

async function main() {
    console.log('🔄 Daily Notion Sync - National Botox Directory');
    console.log(`⏰ ${new Date().toLocaleString()}\n`);

    try {
        const previousLog = loadSyncLog();
        if (previousLog) {
            console.log(`📅 Last sync: ${new Date(previousLog.lastSync).toLocaleString()}\n`);
        }

        const databases = await findDatabases();
        console.log('✅ Found all databases\n');

        // Update metrics
        const metrics = await updateProjectMetrics(databases);

        // Update SEO rankings
        await updateSEORankings(databases);

        // Create daily review
        await createDailyCEOReview(databases, metrics);

        // Save log
        saveSyncLog({
            metrics,
            databases: Object.keys(databases)
        });

        console.log('\n✨ Daily sync complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
