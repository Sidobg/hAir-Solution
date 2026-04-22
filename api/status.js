export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "ID mancante" });

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    const prediction = await response.json();

    return res.status(200).json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
