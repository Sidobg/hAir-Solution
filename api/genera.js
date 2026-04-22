export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, stylePrompt, colorPrompt } = req.body;

  if (!imageBase64 || !stylePrompt || !colorPrompt) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  const prompt = `portrait photo of a woman with ${stylePrompt}, ${colorPrompt}, photorealistic, high quality, professional salon photo, sharp focus`;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ddfc2b08d209f9fa8c1eca692712918bd449f695a2d35e9a59e52e34e23ad4e2", // photomaker
        input: {
          prompt: prompt,
          input_image: imageBase64,
          num_steps: 20,
          style_name: "Photographic (Default)",
          num_outputs: 1,
          guidance_scale: 5,
          negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
        },
      }),
    });

    const prediction = await response.json();

    if (prediction.error) {
      return res.status(500).json({ error: prediction.error });
    }

    return res.status(200).json({ id: prediction.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
