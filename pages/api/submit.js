export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzKTC70E2xjBizIkNYvBWjTpdZxfUtBRkPZrwstv9C4_6ZsagGewNFiaqVwG8fWpMb3/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    // Try parsing response
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: true, raw: text }; // assume success if script returned text
    }

    // ✅ Force success if HTTP status is 200
    if (response.ok) {
      return res.status(200).json({ success: true, message: "Added to sheet", data: result });
    } else {
      return res.status(400).json({ success: false, error: "Bad response from script" });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
