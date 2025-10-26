export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzKTC70E2xjBizIkNYvBWjTpdZxfUtBRkPZrwstv9C4_6ZsagGewNFiaqVwG8fWpMb3/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    let result = {};
    try {
      result = JSON.parse(text);
    } catch {
      result = {};
    }

    return res.status(200).json({ success: true, raw: result });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
