import { createAd } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ad = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!ad.title || !ad.category_id) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const result = await createAd(ad);

    if (result.error) {
      console.error('Create ad error:', JSON.stringify(result.error));
      return res.status(400).json({ error: result.error.message || 'Failed to create ad' });
    }

    return res.status(201).json({ ad: result.data });
  } catch (err) {
    console.error('API /api/ads error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
