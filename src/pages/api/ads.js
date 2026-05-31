import { getAds, getFeaturedAds, getStats } from '../../lib/data';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const featured = req.query.featured === 'true';

  try {
    if (featured) {
      const ads = await getFeaturedAds();
      return res.status(200).json({ ads });
    }

    const { q, category, sort, page, limit } = req.query;

    const result = await getAds({
      search: q || '',
      category: category || 'All',
      sort: sort || 'default',
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('API /api/ads error:', err);
    res.status(500).json({ ads: [], total: 0 });
  }
}
