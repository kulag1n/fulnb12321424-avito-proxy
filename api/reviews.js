// api/reviews.js

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res
      .setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_ALLOWED || '*')
      .setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .status(200)
      .end();
  }

  try {
    // Получаем access_token по client_credentials
    const tokenResp = await fetch('https://api.avito.ru/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          `${process.env.AVITO_CLIENT_ID}:${process.env.AVITO_CLIENT_SECRET}`
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    const tokenData = await tokenResp.json();
    const access_token = tokenData.access_token;

    // Запрашиваем отзывы
    const reviewsResp = await fetch('https://api.avito.ru/core/v1/accounts/me/reviews', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const raw = await reviewsResp.json();

    // Преобразуем данные в простой формат
    const normalized = (raw.items || []).map(review => ({
      author: review.author?.name || 'Покупатель',
      rating: review.rating ?? null,
      date: review.date || null,
      text: review.text || ''
    }));

    res
      .setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_ALLOWED || '*')
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .json({ count: normalized.length, reviews: normalized });
  } catch (err) {
    console.error('Ошибка:', err);
    res
      .setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_ALLOWED || '*')
      .status(500)
      .json({ error: 'Не удалось получить отзывы', details: err.message });
  }
}
