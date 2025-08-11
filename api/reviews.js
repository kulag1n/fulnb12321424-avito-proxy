require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  const response = await fetch('https://api.avito.ru/core/v1/items/reviews', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': process.env.AVITO_CLIENT_ID
    }
  });

  const data = await response.json();
  res.status(200).json(data);
};

