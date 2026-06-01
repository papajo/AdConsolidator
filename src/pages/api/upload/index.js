import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    body = req.body;
  }

  const { file } = body;
  if (!file) return res.status(400).json({ error: 'No file data provided' });

  // Route 1: Cloudinary (preferred)
  if (CLOUD_NAME && UPLOAD_PRESET) {
    try {
      const form = new URLSearchParams();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('folder', 'xyzt-ads');

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString() }
      );
      const result = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) return res.status(cloudinaryRes.status).json({ error: JSON.stringify(result) });
      return res.status(200).json({
        url: result.secure_url, publicId: result.public_id,
        width: result.width, height: result.height, format: result.format,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Cloudinary upload failed: ' + err.message });
    }
  }

  // Route 2: Supabase Storage
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const matches = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) return res.status(400).json({ error: 'Invalid data URL format' });

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const ext = mimeType.split('/')[1] || 'png';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabaseAdmin.storage
        .from('ad-images')
        .upload(filename, buffer, { contentType: mimeType, upsert: true });

      if (error) {
        const msg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
        return res.status(500).json({ error: 'Storage upload failed: ' + msg });
      }

      const { data: publicData } = supabaseAdmin.storage.from('ad-images').getPublicUrl(filename);
      return res.status(200).json({ url: publicData.publicUrl, publicId: filename });
    } catch (err) {
      return res.status(500).json({ error: 'Upload error: ' + err.message });
    }
  }

  // Route 3: Dev fallback — return base64 data URL as-is
  return res.status(200).json({ url: file, publicId: 'local-' + Date.now() });
}
