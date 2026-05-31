export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return res.status(500).json({
      error: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to .env.local',
      hint: 'Create an unsigned upload preset in Cloudinary > Settings > Upload',
    });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const form = new URLSearchParams();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('folder', 'xyzt-ads');

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      }
    );

    const result = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      return res.status(cloudinaryRes.status).json(result);
    }

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
