import { getAds } from '../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, category, sort, page, limit } = req.query;

  const result = getAds({
    query: q || '',
    category: category || 'All',
    sort: sort || 'default',
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 9,
  });

  res.status(200).json(result);
}
