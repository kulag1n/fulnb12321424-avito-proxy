export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  const tokenResponse = await fetch("https://api.avito.ru/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from("YAWW3KcdXMl9jEQyse35:UduRFoVWHe61ZJip_HC9DNZ1-zuusium3c-OVti7").toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://smolmaf.ru",
    }),
  });

  const data = await tokenResponse.json();

  res.status(200).json(data);
}
