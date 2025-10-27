import { addEmailToWaitlist } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: "Valid email required" });
    }

    // Add to database
    const result = await addEmailToWaitlist(email.toLowerCase().trim());

    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: "Successfully added to waitlist",
        data: result.data 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
