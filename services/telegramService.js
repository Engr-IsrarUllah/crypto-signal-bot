const axios = require("axios");

async function sendTelegramMessage(message) {

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        }
    );
}

module.exports = {
    sendTelegramMessage
};