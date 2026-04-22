export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, haircutStyle, hairColor } = req.body;

  if (!imageBase64 || !haircutStyle || !hairColor) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/models/flux-kontext-apps/change-haircut/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          input_image: imageBase64,
          haircut: haircutStyle,
          hair_color: hairColor,
          gender: "female",
        },
      }),
    });

    const prediction = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: JSON.stringify(prediction) });
    }

    return res.status(200).json({ id: prediction.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
