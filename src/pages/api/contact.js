export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // In production, use Resend:
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@xyzadconsolidator.com',
  //   to: 'support@xyzadconsolidator.com',
  //   subject: `[${subject}] ${name}`,
  //   replyTo: email,
  //   html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
  // });

  console.log(`[EMAIL] Subject: ${subject} | From: ${name} <${email}>`);
  console.log(`[EMAIL] Message: ${message}`);

  return res.status(200).json({ ok: true, message: 'Email sent!' });
}
