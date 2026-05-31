import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
  }

  let event;

  try {
    const buf = Buffer.from(await req.arrayBuffer());
    event = webhookSecret
      ? stripe.webhooks.constructEvent(buf, sig, webhookSecret)
      : JSON.parse(buf.toString());
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // TODO: When Supabase is connected, update user subscription in DB
  // For now just log events

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✅ Checkout completed:', event.data.object.id);
  break;
    case 'customer.subscription.created':
      console.log('🆕 Subscription created:', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      console.log('🔄 Subscription updated:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      console.log('❌ Subscription deleted:', event.data.object.id);
      break;
    case 'invoice.paid':
      console.log('💳 Invoice paid:', event.data.object.id);
      break;
    case 'invoice.payment_failed':
      console.log('⚠️ Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
