const axios = require("axios");

module.exports = async (req, res) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: "Missing BOT_TOKEN or CHAT_ID environment variables." });
    }

    try {
        let message = "";

        if (req.method === "POST") {
            // Handle actual signal from TradingView
            const { symbol, action, price } = req.body;

            if (!symbol && !action && !price) {
                return res.status(400).json({ error: "Empty body. Ensure Content-Type is application/json" });
            }

            message = `
🚨 *LIVE CRYPTO SIGNAL*

🪙 *Coin:* ${symbol || "N/A"}
📊 *Action:* ${action ? action.toUpperCase() : "N/A"} 📈
💰 *Price:* ${price || "N/A"}
⏰ *Time:* ${new Date().toLocaleString()}
            `;
        } else {
            // Handle browser visit (GET) for testing
            message = `
✅ *WEBHOOK ENDPOINT ACTIVE*
This is a test message to confirm your webhook URL is working.

Endpoint: /api/webhook
Status: Ready for TradingView signals 🚀
            `;
        }

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        });

        return res.status(200).json({
            success: true,
            method: req.method,
            status: "Message sent to Telegram"
        });

    } catch (error) {
        console.error("Webhook Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || "Check your BOT_TOKEN and CHAT_ID"
        });
    }
};
