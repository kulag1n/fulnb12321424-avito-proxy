// api/oauth-callback.mjs
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://smolmaf.ru');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing "code" parameter' });

  // Собираем redirect_uri из заголовков
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/oauth-callback`;

  try {
    const tokenResp = await fetch('https://api.avito.ru/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.AVITO_CLIENT_ID,
        client_secret: process.env.AVITO_CLIENT_SECRET,
        redirect_uri: redirectUri
      })
    });

    const raw = await tokenResp.text();
    console.log('OAuth token resp:', tokenResp.status, raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { parseError: true, raw };
    }

    return res.status(tokenResp.ok ? 200 : tokenResp.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Token exchange failed', details: String(e) });
  }
}

