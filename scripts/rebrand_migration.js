const fs = require('fs');
const path = require('path');

const replacements = [
    { find: /Botox-4U\.com/g, replace: 'InjectorIndex.com' },
    { find: /Botox-4u\.com/g, replace: 'InjectorIndex.com' },
    { find: /botox-4u\.com/g, replace: 'injectorindex.com' },
    { find: /Botox-4U/g, replace: 'Injector Index' },
    { find: /Botox-4u/g, replace: 'Injector Index' },
    { find: /botox-4u/g, replace: 'injectorindex' },
    { find: /BOTOX-4U/g, replace: 'INJECTOR INDEX' },
    { find: /Botox4U/g, replace: 'InjectorIndex' },
    { find: /botox4u/g, replace: 'injectorindex' },
    { find: /Find Top Providers & Compare Costs/g, replace: 'The Independent Injector Index' }
];

const ignoredDirs = ['node_modules', '.next', '.git', '.venv', 'scripts'];
const ignoredFiles = ['rebrand_migration.js'];

// Ensure we don't break Botox Pulse
const pulseGuard = (text) => {
    // This is simple: the replacements above will NOT match "Botox Pulse"
    // because "Botox Pulse" does not follow the hyphenated or case patterns of the brand Botox-4U.
    // However, if we replace "Botox" with "Injector Index" generally, that would be bad.
    // Our patterns are specific to "Botox-4U" related strings.
    return text;
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const r of replacements) {
        content = content.replace(r.find, r.replace);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoredDirs.includes(file)) {
                walkDir(fullPath);
            }
        } else {
            const ext = path.extname(file);
            if (['.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.html', '.css', '.env', '.local', '.production'].includes(ext) || file.startsWith('.env')) {
                if (!ignoredFiles.includes(file)) {
                    processFile(fullPath);
                }
            }
        }
    }
}

console.log('Starting rebrand migration...');
walkDir(process.cwd());
console.log('Migration complete.');
