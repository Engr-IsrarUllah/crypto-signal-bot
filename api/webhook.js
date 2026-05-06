const axios = require("axios");

module.exports = async (req, res) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    try {
        // TradingView sends data here
        const { symbol, action, price } = req.body;

        const message = `
🚨 LIVE CRYPTO SIGNAL

🪙 Coin: ${symbol || "N/A"}
📊 Action: ${action || "N/A"}
💰 Price: ${price || "N/A"}
⏰ Time: ${new Date().toLocaleString()}
    `;

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};