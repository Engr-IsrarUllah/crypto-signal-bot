const axios = require('axios');

module.exports = async (req, res) => {
  // 1. Setup CORS (Cross-Origin Resource Sharing) so it can be called from anywhere
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ success: false, error: "Missing Telegram credentials in environment variables." });
  }

  try {
    let textToSend = '';

    // 2. Professional Webhook Handling: 
    // If a service (like TradingView) sends a POST request with data, use that data!
    if (req.method === 'POST' && req.body) {
      // Check if they sent a string directly, or a JSON object like { "message": "buy btc" }
      if (typeof req.body === 'string') {
        textToSend = req.body;
      } else if (req.body.message) {
        textToSend = req.body.message;
      } else if (req.body.text) {
        textToSend = req.body.text;
      } else {
        // If they sent JSON but we don't know the format, just convert the whole thing to a string
        textToSend = `🚨 SIGNAL ALERT 🚨\n\n${JSON.stringify(req.body, null, 2)}`;
      }
    } 
    
    // 3. Fallback Test Message:
    // If you just visit the URL in your browser (GET request), send a standard test message
    if (!textToSend) {
      textToSend = `🚨 TEST CRYPTO SIGNAL 🚨\n\nCoin: BTCUSDT\nAction: BUY\nTime: ${new Date().toLocaleString()}`;
    }

    // 4. Send to Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: textToSend,
      parse_mode: "HTML" // Allows you to send bold/italic text if you want
    });

    res.status(200).json({ success: true, message: "Telegram message sent successfully!" });

  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Failed to send message to Telegram." });
  }
};
