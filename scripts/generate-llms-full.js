const fs = require('fs');

const methodologyContent = `
# Our Methodology: The Clarity Score™ Algorithm

The Clarity Score™ isn't assigned. It's learned.

## The Philosophy
Netflix didn't manually rate every movie. They built a system that learned from what customers actually watched, rated, and abandoned. We do the same thing for Botox providers.

The VerifiedAesthetics engine is a proprietary data-driven ranking engine that learns from patient language and clinical quality patterns. The more data our engine analyzes, the stronger the 'Signal' becomes. We don't award points based on a static rubric; we measure clinical and aesthetic relevance through proprietary clinical quality data.

## Why Star Ratings Are Broken
A provider can have 4.9 stars and still leave you with a frozen face. Star ratings alone can be gamed, and they don't capture the nuance of aesthetic results.

## The Four Signals
Our proprietary engine analyzes dozens of independent data vectors—which we group into four primary Signals—to determine a provider's rank.

1. Natural Language Signal (Semantic Output Analysis): Our model is trained to identify language that indicates natural, conservative outcomes. It differentiates between 'looking refreshed' and 'looking like I had work done.'
2. Transparency Signal (Verified Pricing Data): Providers who publish real per-unit pricing strengthen their transparency score. Hidden pricing often correlates with high-pressure sales environments, which our engine detects and penalizes.
3. Verification Signal (Federal NPI Sync): We cross-reference every provider against the federal NPI database. If we can't verify their professional standing, their index presence is restricted.
4. Consistency Signal (Review Velocity Analysis): Recent data is prioritized through recurring audits. A provider who was great in 2019 but has poor reviews in 2026 will see their signal fluctuate based on current performance.
`;

const blogDataRaw = fs.readFileSync('lib/blog-data.ts', 'utf8');

// Simplistic extraction - finding the start of the array
const startMarker = 'export const BLOG_POSTS: BlogPost[] = [';
const startIndex = blogDataRaw.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find BLOG_POSTS start');
    process.exit(1);
}

// We need to cut from the start of the array to the end of the file, 
// then cleanup enough to parse it. 
// Actually, it might be easier to just regex match the individual objects if we can't eval the whole thing.
// But let's try a safer approach: matching title and content.

const posts = [];
const postRegex = /slug: '([^']+)',\s+title: "([^"]+)"|slug: '([^']+)',\s+title: '([^']+)',\s+metaDescription: '([^']+)',\s+targetKeyword: '([^']+)',\s+publishDate: '([^']+)',\s+content: `([\s\S]*?)`\s+faqs: /g;

// This regex is getting complex. Let's just use a simpler one to find contents.
const contentRegex = /content: `([\s\S]*?)`/g;
const titleRegex = /title: ["']([^"']+)["']/g;
const slugRegex = /slug: ['"]([^"']+)['"]/g;

// Re-reading to simplify
const blogContent = blogDataRaw.substring(startIndex);

// Split by objects
const parts = blogContent.split('},').filter(p => p.includes('slug:'));

let fullText = '# VerifiedAesthetics Full Content Index\n\n' + methodologyContent + '\n\n## Industry Reports & Guides\n\n';

parts.forEach(part => {
    const slug = part.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
    const title = part.match(/title:\s*["']([^"']+)["']/)?.[1];
    const date = part.match(/publishDate:\s*['"]([^'"]+)['"]/)?.[1];
    const desc = part.match(/metaDescription:\s*['"]([^'"]+)['"]/)?.[1];
    const contentMatch = part.match(/content:\s*`([\s\S]*?)`/);
    const content = contentMatch ? contentMatch[1].trim() : '';

    if (title && content) {
        fullText += `### ${title}\n`;
        fullText += `**URL:** https://www.verifiedaesthetics.com/blog/${slug}\n`;
        fullText += `**Date:** ${date}\n`;
        fullText += `**Description:** ${desc}\n\n`;
        fullText += content + '\n\n';

        // Match FAQs
        const faqSectionMatch = part.match(/faqs:\s*\[([\s\S]*?)\]/);
        if (faqSectionMatch) {
            const faqsRaw = faqSectionMatch[1];
            const faqRegex = /question:\s*['"]([^'"]+)['"],\s*answer:\s*['"]([^'"]+)['"]/g;
            let m;
            let firstFaq = true;
            while ((m = faqRegex.exec(faqsRaw)) !== null) {
                if (firstFaq) {
                    fullText += '#### Frequently Asked Questions\n\n';
                    firstFaq = false;
                }
                fullText += `**${m[1]}**\n${m[2]}\n\n`;
            }
        }
        fullText += '---\n\n';
    }
});

fs.writeFileSync('public/llms-full.txt', fullText);
console.log('Successfully created public/llms-full.txt');
