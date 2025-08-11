// oauth-callback.mjs
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://smolmaf.ru');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing "code" parameter' });

  // Собираем точный redirect_uri текущего деплоя
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/oauth-callback`;

  try {
    const tokenResp = await fetch('https://www.avito.ru/oauth/token', {
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

    const data = await tokenResp.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Token exchange failed', details: String(e) });
  }
}
