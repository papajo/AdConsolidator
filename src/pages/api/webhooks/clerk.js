import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

export async function GET() {
  return new Response('Clerk webhook endpoint is alive', { status: 200 });
}

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });

  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return new Response('Missing svix headers', { status: 400 });

  const body = await req.text();
  const verified = verifySvixSignature(svixId, svixTimestamp, body, svixSignature, WEBHOOK_SECRET);
  if (!verified) return new Response('Invalid signature', { status: 401 });

  const event = JSON.parse(body);
  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const primaryEmail = data.email_addresses?.find((e) => e.primary)?.email_address || data.email_addresses?.[0]?.email_address;
    const { error } = await supabaseAdmin.from('profiles').upsert({
      clerk_id: data.id,
      email: primaryEmail,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      avatar_url: data.image_url || null,
      phone: data.phone_numbers?.[0]?.phone_number || null,
    }, { onConflict: 'clerk_id' });

    if (error) console.error('Error syncing user:', error);
  } else if (type === 'user.deleted') {
    const { error } = await supabaseAdmin.from('profiles').delete().eq('clerk_id', data.id);
    if (error) console.error('Error deleting user:', error);
  }

  return new Response('OK', { status: 200 });
}

function verifySvixSignature(svixId, svixTimestamp, body, svixSignature, secret) {
  const crypto = require('crypto');
  const signingSecret = secret.startsWith('whsec_') ? secret.replace('whsec_', '') : secret;
  const key = Buffer.from(signingSecret, 'base64');
  const payload = `${svixId}.${svixTimestamp}.${body}`;
  const expected = crypto.createHmac('sha256', key).update(payload).digest('base64');
  const v1Match = svixSignature.split(' ').find((s) => s.startsWith('v1,'));
  if (!v1Match) return false;
  const received = v1Match.replace('v1,', '');
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}
