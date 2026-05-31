import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Store in Supabase
  const { error: dbError } = await supabaseAdmin
    .from('contact_messages')
    .insert({ name, email, subject, message, status: 'new' });

  if (dbError) console.error('DB insert error:', dbError);

  // Send email via Resend if configured
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = 'support@xyzadconsolidator.com';

  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'XYZT Ad Consolidator <noreply@xyztadconsolidator.com>',
          to: [TO_EMAIL],
          replyTo: email,
          subject: `[${subject}] ${name}`,
          html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
        }),
      });
    } catch (err) {
      console.error('Resend error:', err);
    }
  }

  return res.status(200).json({ ok: true, message: RESEND_API_KEY ? 'Message sent!' : 'Message received! (email not configured)' });
}
