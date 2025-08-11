export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  const tokenResponse = await fetch("https://api.avito.ru/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from("YOUR_CLIENT_ID:YOUR_CLIENT_SECRET").toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://fulnb12321424-avito-proxy.vercel.app/api/oauth-callback",
    }),
  });

  const data = await tokenResponse.json();

  res.status(200).json(data);
}
