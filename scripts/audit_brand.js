const fs = require('fs');
const path = require('path');

const searchTerms = ['botox-4u', 'Botox-4U', 'Botox-4u', 'botox4u', 'Botox4U', 'Find Top Providers & Compare Costs'];
const searchDirs = ['app', 'components', 'config', 'lib', 'public', 'content', 'data', 'emails', 'email', 'templates'];
const searchExts = ['.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.html', '.css', '.txt', '.env', '.local', '.production'];
const ignoreDirs = ['node_modules', '.next', '.git', '.venv', 'scripts'];

const results = {};

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(item)) walkDir(full);
        } else {
            const ext = path.extname(item);
            if (searchExts.includes(ext) || item.startsWith('.env')) {
                try {
                    const content = fs.readFileSync(full, 'utf8');
                    for (const term of searchTerms) {
                        if (content.includes(term)) {
                            const lines = content.split('\n');
                            lines.forEach((line, idx) => {
                                if (line.includes(term)) {
                                    const key = `${full}:${idx + 1}`;
                                    if (!results[term]) results[term] = [];
                                    results[term].push(`  ${full}:${idx + 1}: ${line.trim().slice(0, 120)}`);
                                }
                            });
                        }
                    }
                } catch (e) { }
            }
        }
    }
}

// Walk all dirs from cwd
walkDir('.');

let found = false;
for (const term of searchTerms) {
    if (results[term] && results[term].length > 0) {
        found = true;
        console.log(`\n⚠️  FOUND [${term}] (${results[term].length} occurrences):`);
        results[term].slice(0, 20).forEach(l => console.log(l));
        if (results[term].length > 20) console.log(`  ... and ${results[term].length - 20} more`);
    } else {
        console.log(`✅ OK: [${term}] - no matches`);
    }
}

if (!found) console.log('\n✅ All brand terms clean — ready to deploy.');
