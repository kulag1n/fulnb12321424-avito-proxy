// /api/reviews.js

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access token required in Authorization header.' });
  }

  try {
    const response = await fetch('https://api.avito.ru/core/v1/reviews', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': 'LBqPURrC3ihc-LRAj6S1'
      }
    });

    const reviews = await response.json();

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
}
