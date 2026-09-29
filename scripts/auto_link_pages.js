const https = require('https');

const NOTION_TOKEN = process.env.NOTION_API_KEY;
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
        if (title === 'Programmatic Pages Tracker') databases.pages = db.id;
        if (title === 'Content Calendar') databases.content = db.id;
    }

    return databases;
}

async function queryDatabase(dbId) {
    return makeNotionRequest('POST', `/v1/databases/${dbId}/query`, {});
}

async function createPage(databaseId, properties) {
    return makeNotionRequest('POST', '/v1/pages', {
        parent: { database_id: databaseId },
        properties: properties
    });
}

async function autoLinkProgrammaticPages(databases) {
    console.log('\n🔗 Auto-linking Programmatic Pages to Content Pipeline...');

    // Get all programmatic pages
    const pages = await queryDatabase(databases.pages);
    let linked = 0;

    for (const page of pages.results) {
        const pageTitle = page.properties['Page Title']?.title[0]?.plain_text || '';
        const url = page.properties['URL']?.url || '';
        const status = page.properties['Status']?.select?.name || '';

        // Check if there's already a linked content item
        const targetPage = page.properties['Target Page']?.relation || [];

        if (targetPage.length === 0 && pageTitle) {
            // Create a new Content Calendar entry
            try {
                const contentPage = await createPage(databases.content, {
                    'Name': { title: [{ text: { content: pageTitle } }] },
                    'Content Type': { select: { name: 'City Page' } },
                    'Status': { select: { name: status === 'Published' ? 'Published' : 'Planned' } },
                    'URL': url ? { url: url } : undefined,
                    'Priority': { select: { name: 'Medium' } }
                });

                console.log(`  ✅ Created content entry for: ${pageTitle}`);
                linked++;

                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.error(`  ❌ Failed to create content for: ${pageTitle}`, error.message);
            }
        }
    }

    console.log(`\n✅ Linked ${linked} programmatic pages to content pipeline`);
}

async function main() {
    console.log('🤖 Programmatic Page Auto-Linker\n');

    try {
        const databases = await findDatabases();

        if (!databases.pages || !databases.content) {
            console.error('❌ Required databases not found!');
            console.log('Make sure both "Programmatic Pages Tracker" and "Content Calendar" exist.');
            process.exit(1);
        }

        await autoLinkProgrammaticPages(databases);

        console.log('\n✨ Auto-linking complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
