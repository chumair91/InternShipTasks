const Stripe=require('stripe');
const config = require('.');
const stripe=new Stripe(config.stripeSecret);

module.exports=stripe;