
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

async function setup() {
    console.log('--- Setting up API Products in Stripe ---');

    const products = [
        {
            id: 'api_starter',
            name: 'VerifiedAesthetics API Starter',
            description: '5,000 API calls per month for AI agents and platforms.',
            amount: 2900, // $29.00
        },
        {
            id: 'api_pro',
            name: 'VerifiedAesthetics API Pro',
            description: 'Unlimited API calls for enterprise AI infrastructure.',
            amount: 9900, // $99.00
        }
    ];

    for (const p of products) {
        try {
            console.log(`Creating/Updating product: ${p.name}...`);
            const product = await stripe.products.create({
                name: p.name,
                description: p.description,
                metadata: { plan_id: p.id }
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: p.amount,
                currency: 'usd',
                recurring: { interval: 'month' },
            });

            console.log(`✅ Success! Product: ${product.id}, Price: ${price.id}`);
            console.log(`ADD TO .env: STRIPE_${p.id.toUpperCase()}_PRICE_ID=${price.id}`);
        } catch (e: any) {
            console.error(`❌ Error creating ${p.id}:`, e.message);
        }
    }
}

setup();
