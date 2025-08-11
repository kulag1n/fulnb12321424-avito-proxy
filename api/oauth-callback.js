require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  const { code } = req.query;

  const tokenResponse = await fetch('https://www.avito.ru/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      redirect_uri: process.env.AVITO_REDIRECT_URI
    })
  });

  const tokenData = await tokenResponse.json();
  res.status(200).json(tokenData);
};

