require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Send Telegram Message Function (DIRECT API CALL)
async function sendMessage(text) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const res = await axios.post(url, {
      chat_id: CHAT_ID,
      text: text
    });

    console.log("✅ Message sent");
    return res.data;

  } catch (error) {
    console.log("❌ Telegram Error:", error.message);
  }
}

// Test route
app.get('/', (req, res) => {
  res.send('Crypto Signal Bot Running 🚀');
});

// Test signal
app.get('/test', async (req, res) => {
  await sendMessage(`
🚨 TEST SIGNAL

Coin: BTCUSDT
Action: BUY
Price: 65000
Time: ${new Date().toLocaleString()}
  `);

  res.send("Signal sent");
});

// app.listen(3000, () => {
//   console.log("🚀 Server running on port 3000");
// });

module.exports = app;