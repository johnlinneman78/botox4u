const https = require('https');

const NOTION_TOKEN = process.env.NOTION_API_KEY || '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';

function makeNotionRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
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

async function findDatabase(name) {
    const response = await makeNotionRequest('POST', '/v1/search', {
        filter: { property: 'object', value: 'database' },
        sort: { direction: 'descending', timestamp: 'last_edited_time' }
    });

    for (const db of response.results) {
        const title = db.title[0]?.plain_text || '';
        if (title === name) return db.id;
    }
    return null;
}

async function createDatabase(title, properties, parentPageId) {
    return makeNotionRequest('POST', '/v1/databases', {
        parent: { type: 'page_id', page_id: parentPageId },
        title: [{ type: 'text', text: { content: title } }],
        properties: properties
    });
}

async function main() {
    console.log('🔍 Finding Content Calendar database...');
    const contentCalendarId = await findDatabase('Content Calendar');

    if (!contentCalendarId) {
        console.error('❌ Content Calendar database not found!');
        process.exit(1);
    }

    console.log(`✅ Found Content Calendar: ${contentCalendarId}`);
    console.log('\n🚀 Creating Programmatic Pages Tracker...');

    const properties = {
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
        'State': {
            select: {
                options: [
                    { name: 'CA', color: 'blue' },
                    { name: 'NY', color: 'green' },
                    { name: 'TX', color: 'red' },
                    { name: 'FL', color: 'orange' }
                ]
            }
        },
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
        'Target Page': {
            relation: {
                database_id: contentCalendarId,
                single_property: {}
            }
        }
    };

    try {
        const result = await createDatabase(
            'Programmatic Pages Tracker',
            properties,
            '309baf92-cb44-813c-b5b3-f160fb4c73b8'
        );

        console.log('✅ Created: Programmatic Pages Tracker');
        console.log(`   Database ID: ${result.id}`);
        console.log('\n✨ Complete! The relation to Content Calendar is now set up.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
