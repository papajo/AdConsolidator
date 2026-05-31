import { getStats } from '../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stats = getStats();
  res.status(200).json(stats);
}
