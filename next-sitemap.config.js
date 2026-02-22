/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://injectorindex.com',
    generateRobotsTxt: true,
    exclude: ['/provider/login', '/provider/dashboard'],
    robotsTxtOptions: {
        additionalSitemaps: [],
    },
}
