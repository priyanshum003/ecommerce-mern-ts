import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

if (!STRIPE_SECRET_KEY) {
    throw new Error('No STRIPE_SECRET_KEY provided');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;