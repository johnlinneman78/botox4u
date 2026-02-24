const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_API_KEY || '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'; // Fallback for dev
const NOTION_VERSION = '2022-06-28';
const PARENT_PAGE_ID = '309baf92-cb44-813c-b5b3-f160fb4c73b8'; // From create_notion_databases.py

const README_PATH = path.join(__dirname, '../docs/LAUNCH_README.md');

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

function parseMarkdown(content) {
    const lines = content.split('\n');
    const blocks = [];
    let inCodeBlock = false;
    let codeContent = '';

    for (const line of lines) {
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                blocks.push({
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [{ type: 'text', text: { content: codeContent.trim() } }],
                        language: 'bash' // adjust as needed
                    }
                });
                codeContent = '';
            }
            inCodeBlock = !inCodeBlock;
            continue;
        }

        if (inCodeBlock) {
            codeContent += line + '\n';
            continue;
        }

        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('# ')) {
            // Heading 1
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: {
                    rich_text: [{ type: 'text', text: { content: trimmed.replace('# ', '') } }]
                }
            });
        } else if (trimmed.startsWith('## ')) {
            // Heading 2
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: trimmed.replace('## ', '') } }]
                }
            });
        } else if (trimmed.startsWith('### ')) {
            // Heading 3
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: {
                    rich_text: [{ type: 'text', text: { content: trimmed.replace('### ', '') } }]
                }
            });
        } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            // Bulleted List
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: trimmed.replace(/^[*|-] /, '') } }]
                }
            });
        } else if (trimmed.match(/^\d+\. /)) {
            // Numbered List (simplified)
            blocks.push({
                object: 'block',
                type: 'numbered_list_item',
                numbered_list_item: {
                    rich_text: [{ type: 'text', text: { content: trimmed.replace(/^\d+\. /, '') } }]
                }
            });
        } else {
            // Paragraph
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: trimmed } }]
                }
            });
        }
    }
    return blocks;
}

async function main() {
    console.log('🚀 Importing LAUNCH_README.md to Notion...');

    try {
        const readmeContent = fs.readFileSync(README_PATH, 'utf8');
        const blocks = parseMarkdown(readmeContent);

        console.log(`Parsed ${blocks.length} blocks.`);
        if (blocks.length > 0) {
            console.log('First block:', JSON.stringify(blocks[0], null, 2));
        }

        // Notion has a block limit per request (usually 100), handle large docs in chunks if necessary
        // For this README, it should be small enough.

        const newPage = await makeNotionRequest('POST', '/v1/pages', {
            parent: { page_id: PARENT_PAGE_ID },
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: 'InjectorIndex.com Launch Guide'
                            }
                        }
                    ]
                }
            },
            children: blocks.slice(0, 95) // simple truncation to avoid limits for now
        });

        console.log(`✅ Successfully created page: ${newPage.url}`);

        if (blocks.length > 95) {
            console.log('⚠️ Document was truncated due to API block limits. You can implement chunking for full upload.');
        }

    } catch (error) {
        console.error('❌ Error importing to Notion:', error.message);
        if (error.responseBody) {
            console.error('API Response details:', error.responseBody);
        }
    }
}

main();
