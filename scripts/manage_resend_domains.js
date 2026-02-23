const { Resend } = require('resend');
require('dotenv').config({ path: '.env.prod' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkDomains() {
    console.log('🌐 Checking Resend Domain Verification Status...');

    try {
        const { data, error } = await resend.domains.list();

        if (error) {
            console.error('❌ Resend API Error:', error);
            return;
        }

        if (!data || !data.data || data.data.length === 0) {
            console.log('ℹ️ No domains found in Resend. I will attempt to add injectorindex.com.');
            await addDomain('injectorindex.com');
            return;
        }

        console.log(`\nFound ${data.data.length} domain(s):`);
        for (const domain of data.data) {
            console.log(`- Domain: ${domain.name}`);
            console.log(`  ID: ${domain.id}`);
            console.log(`  Status: ${domain.status}`);
            console.log(`  Region: ${domain.region}`);

            if (domain.status !== 'verified') {
                console.log('\n--- DNS Records Required ---');
                // Fetch specific details to get the records
                const details = await resend.domains.get(domain.id);
                if (details.data && details.data.records) {
                    details.data.records.forEach(record => {
                        console.log(`Type: ${record.record} | Name: ${record.name} | Value: ${record.value}`);
                    });
                }
            }
        }

    } catch (err) {
        console.error('❌ Critical Error:', err.message);
    }
}

async function addDomain(name) {
    try {
        console.log(`Adding domain: ${name}...`);
        const { data, error } = await resend.domains.create({ name });

        if (error) {
            console.error('❌ Error adding domain:', error);
            return;
        }

        console.log('✅ Domain added successfully!');
        console.log('ID:', data.id);
        console.log('\n--- DNS Records to Add ---');
        data.records.forEach(record => {
            console.log(`Type: ${record.record} | Name: ${record.name} | Value: ${record.value}`);
        });

    } catch (err) {
        console.error('❌ Failed to add domain:', err.message);
    }
}

checkDomains();
