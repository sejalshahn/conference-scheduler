import { kv } from '@vercel/kv';

// Everyone who opens this app shares one saved schedule (there's no per-user
// login), so we just use a single fixed key in the KV store.
const KEY = 'conference-scheduler-state';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await kv.get(KEY);
      res.status(200).json({ data: data || null });
      return;
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await kv.set(KEY, body);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
