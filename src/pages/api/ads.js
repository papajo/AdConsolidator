import { getAds, createAd } from '../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const featured = req.query.featured === 'true';
      if (featured) {
        const ads = await getFeaturedAds();
        return res.status(200).json({ ads });
      }
      const { q, category, sort, page, limit } = req.query;
      const result = await getAds({
        search: q || '', category: category || 'All', sort: sort || 'default',
        page: parseInt(page) || 1, limit: parseInt(limit) || 12,
      });
      return res.status(200).json(result);
    } catch (err) {
      console.error('GET /api/ads error:', err);
      return res.status(500).json({ ads: [], total: 0 });
    }
  }

  if (req.method === 'POST') {
    try {
      const adData = req.body;
      // Set default status and views
      adData.status = adData.status || 'pending';
      adData.views = adData.views || 0;
      adData.sponsored = adData.sponsored || false;

      const result = await createAd(adData);
      if (result.error) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (err) {
      console.error('POST /api/ads error:', err);
      return res.status(500).json({ error: 'Failed to create ad' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
