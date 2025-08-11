// /api/oauth-callback.js

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Code not provided in query.' });
  }

  try {
    const tokenResponse = await fetch('https://www.avito.ru/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: 'LBqPURrC3ihc-LRAj6S1',
        client_secret: 'RQHTyCyzBMUNLvpoETxqZudRhKJSPWLNYuO341Ce',
        redirect_uri: 'https://api.smolmaf.ru/api/oauth-callback'
      })
    });

    const data = await tokenResponse.json();

    if (data.access_token) {
      return res.status(200).json({ access_token: data.access_token });
    } else {
      return res.status(500).json({ error: 'Access token not received', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Token exchange failed', details: error.message });
  }
}
