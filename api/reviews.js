require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  try {
    const response = await fetch('https://api.avito.ru/core/v1/items/reviews', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': process.env.AVITO_CLIENT_ID
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Avito API error',
        details: errorText
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: String(err) });
  }
};


