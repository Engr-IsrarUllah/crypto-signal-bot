const axios = require("axios");

module.exports = async (req, res) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({
      error: "Missing BOT_TOKEN or CHAT_ID in Vercel env variables"
    });
  }

  try {
    const message = `
🚨 TEST SIGNAL (VERCEL FIXED)

Coin: BTCUSDT
Action: BUY 📈
Price: 65000
Time: ${new Date().toLocaleString()}
    `;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message
    });

    return res.status(200).json({
      success: true,
      telegram: response.data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};