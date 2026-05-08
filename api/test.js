const { sendTelegramMessage } = require("../services/telegramService");

module.exports = async (req, res) => {
    try {
        const message = `
🚨 *TEST SIGNAL (VERCEL FIXED)*

🪙 *Coin:* BTCUSDT
📊 *Action:* BUY 📈
💰 *Price:* 65000
⏰ *Time:* ${new Date().toLocaleString()}
        `;

        await sendTelegramMessage(message);

        return res.status(200).json({
            success: true,
            message: "Test message sent to Telegram"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};