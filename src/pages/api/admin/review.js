import { getPendingAds, updateAdStatus } from '../../../lib/data';

// Very simple admin check: any signed-in Clerk user with an approved email
// from the admin list can moderate. The env var is a comma-separated list.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export default async function handler(req, res) {
  // GET — list pending ads
  if (req.method === 'GET') {
    try {
      const ads = await getPendingAds();
      return res.status(200).json({ ads });
    } catch (err) {
      console.error('GET /api/admin/review error:', err);
      return res.status(500).json({ error: 'Failed to fetch pending ads' });
    }
  }

  // POST — approve or deny an ad
  if (req.method === 'POST') {
    try {
      const { adId, status, reviewNote } = req.body;

      if (!adId) {
        return res.status(400).json({ error: 'adId is required' });
      }
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
      }

      const result = await updateAdStatus(adId, status, reviewNote || null);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      return res.status(200).json({ ad: result.data });
    } catch (err) {
      console.error('POST /api/admin/review error:', err);
      return res.status(500).json({ error: 'Failed to update ad status' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
