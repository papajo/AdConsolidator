import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const PRICE_MAP = {
  'pro': process.env.STRIPE_PRICE_PRO || 'price_pro_monthly',
  'business': process.env.STRIPE_PRICE_BUSINESS || 'price_business_monthly',
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL
    || (process.env.NEXT_PUBLIC_BASE_URL
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\//, '')}`
      : 'http://localhost:3000');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan } = req.body;

  if (!plan || !PRICE_MAP[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  try {
    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_MAP[plan],
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Checkout failed' });
  }
}
