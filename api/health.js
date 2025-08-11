// /api/health.js
module.exports = async function handler(req, res) {
  res.status(200).json({ status: 'OK' });
};
