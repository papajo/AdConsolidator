import { getAdById, getReviewsByAdId } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const ad = getAdById(id);

  if (!ad) {
    return res.status(404).json({ error: 'Ad not found' });
  }

  const reviews = getReviewsByAdId(id);
  res.status(200).json({ ad, reviews });
}
