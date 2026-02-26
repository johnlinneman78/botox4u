/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.injectorindex.com',
    generateRobotsTxt: true,
    exclude: ['/provider/login', '/provider/dashboard', '/claim/*/verify'],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://www.injectorindex.com/sitemap-pages.xml',
        ],
    },
}
