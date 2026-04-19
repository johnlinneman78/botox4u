
const { NICHE } = require('./config/niche.js');
const { REVERSE_STATE_MAP, TREATMENTS } = require('./lib/constants.ts');

async function testSitemap() {
    try {
        console.log('Testing sitemap logic...');
        const baseUrl = 'https://www.verifiedaesthetics.com';

        const staticRoutes = [
            '',
            '/find-providers',
            '/calculator',
            '/botox',
            '/provider/login',
            '/provider/register',
        ].map(route => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1 : 0.8,
        }));

        console.log('Static routes generated:', staticRoutes.length);

        // Mocking Supabase for now since we don't have env vars here
        const providers = [];
        const locations = [];

        const providerRoutes = (providers || []).map((p) => ({
            url: `${baseUrl}/provider/${p.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        const uniqueLocations = Array.from(new Set((locations || []).map((c) => `${c.city.toLowerCase().replace(/ /g, '-')}:${c.state.toLowerCase()}`)));

        const cityRoutes = uniqueLocations.map(loc => {
            const [city, state] = loc.split(':')
            return {
                url: `${baseUrl}/botox/${city}-${state}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            }
        });

        const treatmentCityRoutes = []
        for (const treatment of TREATMENTS) {
            for (const loc of (uniqueLocations)) {
                const [city, state] = loc.split(':')
                treatmentCityRoutes.push({
                    url: `${baseUrl}/botox/${treatment.slug}/${state}/${city}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                })
            }
        }

        const uniqueStateCodes = Array.from(new Set((locations || []).map((s) => s.state?.toUpperCase())))
        const stateRoutes = uniqueStateCodes.map(code => ({
            url: `${baseUrl}/botox/state/${REVERSE_STATE_MAP[code]}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        })).filter(route => !!route.url.split('/').pop() && route.url.split('/').pop() !== 'undefined')

        const finalSitemap = [
            ...staticRoutes,
            ...providerRoutes,
            ...cityRoutes,
            ...treatmentCityRoutes,
            ...stateRoutes
        ];

        console.log('Sitemap generated successfully!', finalSitemap.length, 'entries');
    } catch (err) {
        console.error('Sitemap generation failed:', err);
    }
}

testSitemap();
