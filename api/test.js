const axios = require('axios');

module.exports = async (req, res) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    const message = `
🚨 TEST SIGNAL (Vercel)

Coin: BTCUSDT
Action: BUY
Price: 65000
Time: ${new Date().toLocaleString()}
    `;

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });

    res.status(200).json({ success: true, message: "Signal sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
