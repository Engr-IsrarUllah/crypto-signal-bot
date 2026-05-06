const axios = require("axios");

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({
            error: "Missing BOT_TOKEN or CHAT_ID in environment variables."
        });
    }

    try {
        // TradingView sends data here. 
        // Ensure you set Content-Type: application/json in your webhook request if possible.
        const { symbol, action, price } = req.body;

        if (!symbol && !action && !price) {
            return res.status(400).json({
                error: "Invalid request body. Expected symbol, action, and price.",
                received: req.body
            });
        }

        const message = `
🚨 LIVE CRYPTO SIGNAL

🪙 Coin: ${symbol || "N/A"}
📊 Action: ${action || "N/A"}
💰 Price: ${price || "N/A"}
⏰ Time: ${new Date().toLocaleString()}
    `;

        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        });

        return res.status(200).json({ 
            success: true, 
            message: "Signal sent to Telegram",
            telegram_status: response.status 
        });

    } catch (error) {
        console.error("Webhook Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || "No additional details"
        });
    }
};