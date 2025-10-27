import { getWaitlistEmails } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const result = await getWaitlistEmails();
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        data: result.data 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (err) {
    console.error("Admin API error:", err);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}