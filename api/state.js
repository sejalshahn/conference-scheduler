// Talks directly to Upstash Redis's REST API — no npm dependency needed.
// Works with the "Upstash" storage option in Vercel's Storage tab, which
// injects UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (or, on some
// setups, KV_REST_API_URL / KV_REST_API_TOKEN) into the project.

const KEY = 'conference-scheduler-state';

function getCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return { url, token };
}

export default async function handler(req, res) {
  const { url, token } = getCreds();

  if (!url || !token) {
    res.status(500).json({ error: 'No Redis database connected to this project yet. See README.md.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${url}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await r.json();
      const data = json.result ? JSON.parse(json.result) : null;
      res.status(200).json({ data });
      return;
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const r = await fetch(`${url}/set/${KEY}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: raw
      });
      if (!r.ok) throw new Error('Redis SET failed: ' + (await r.text()));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
