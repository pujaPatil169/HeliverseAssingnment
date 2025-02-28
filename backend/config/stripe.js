let stripe;

if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('Stripe functionality is disabled. No secret key provided.');
}

module.exports = stripe;
