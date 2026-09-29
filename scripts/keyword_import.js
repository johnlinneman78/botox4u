const https = require('https');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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
        if (title === 'Keyword Research Hub') databases.keywords = db.id;
        if (title === 'Programmatic Pages Tracker') databases.pages = db.id;
        if (title === 'Content Pipeline') databases.content = db.id;
    }

    return databases;
}

async function createPage(databaseId, properties) {
    return makeNotionRequest('POST', '/v1/pages', {
        parent: { database_id: databaseId },
        properties: properties
    });
}

async function importKeywordsFromCSV(csvPath, databases) {
    console.log(`\n📥 Importing keywords from ${csvPath}...`);

    const batchId = `BATCH-${Date.now()}`;
    const importDate = new Date().toISOString().split('T')[0];
    let imported = 0;

    return new Promise((resolve, reject) => {
        const keywords = [];

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                keywords.push(row);
            })
            .on('end', async () => {
                console.log(`Found ${keywords.length} keywords to import`);

                for (const kw of keywords) {
                    try {
                        await createPage(databases.keywords, {
                            'Keyword': { title: [{ text: { content: kw.keyword || kw.Keyword || '' } }] },
                            'Search Volume': { number: parseInt(kw.volume || kw['Search Volume'] || 0) },
                            'Difficulty': { number: parseInt(kw.difficulty || kw.Difficulty || 0) },
                            'CPC': { number: parseFloat(kw.cpc || kw.CPC || 0) },
                            'Intent': { select: { name: kw.intent || kw.Intent || 'Informational' } },
                            'Status': { select: { name: 'New' } },
                            'Imported On': { date: { start: importDate } },
                            'Imported Batch': { rich_text: [{ text: { content: batchId } }] }
                        });

                        imported++;
                        if (imported % 10 === 0) {
                            console.log(`  Imported ${imported}/${keywords.length}...`);
                        }

                        await new Promise(resolve => setTimeout(resolve, 300));
                    } catch (error) {
                        console.error(`  ❌ Failed to import: ${kw.keyword}`, error.message);
                    }
                }

                console.log(`✅ Imported ${imported} keywords with batch ID: ${batchId}`);
                resolve({ imported, batchId });
            })
            .on('error', reject);
    });
}

async function main() {
    const args = process.argv.slice(2);
    const csvPath = args[0];

    if (!csvPath) {
        console.log('Usage: node keyword_import.js <path-to-csv>');
        console.log('\nCSV Format:');
        console.log('  keyword,volume,difficulty,cpc,intent');
        console.log('  botox near me,12000,45,8.50,Commercial');
        console.log('  botox cost,8500,38,7.20,Informational');
        process.exit(1);
    }

    if (!fs.existsSync(csvPath)) {
        console.error(`❌ File not found: ${csvPath}`);
        process.exit(1);
    }

    try {
        console.log('🔍 Finding databases...');
        const databases = await findDatabases();

        if (!databases.keywords) {
            console.error('❌ Keyword Research Hub database not found!');
            console.log('Please create it first using the setup script.');
            process.exit(1);
        }

        await importKeywordsFromCSV(csvPath, databases);

        console.log('\n✨ Import complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Only run if csv-parser is available
try {
    require.resolve('csv-parser');
    if (require.main === module) {
        main();
    }
} catch (e) {
    console.log('Installing csv-parser...');
    console.log('Run: npm install csv-parser');
}

module.exports = { importKeywordsFromCSV };
