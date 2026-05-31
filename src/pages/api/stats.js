import { getStats } from '../../lib/data';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error('API /api/stats error:', err);
    res.status(500).json({ totalAds: 0, totalReviews: 0, avgRating: '0.0', totalViews: 0 });
  }
}
