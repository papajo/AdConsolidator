import { getAdById, getReviewsByAdId } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const ad = await getAdById(id);
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    const reviews = await getReviewsByAdId(id);
    res.status(200).json({ ad, reviews });
  } catch (err) {
    console.error('API /api/ads/[id] error:', err);
    res.status(500).json({ error: 'Failed to fetch ad' });
  }
}
