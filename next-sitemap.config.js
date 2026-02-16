/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://botoxdirectory.com',
    generateRobotsTxt: true,
    exclude: ['/provider/login', '/provider/dashboard'],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://botoxdirectory.com/server-sitemap.xml',
        ],
    },
}
