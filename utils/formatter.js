function formatSignalMessage(symbol, action, price) {
    const emoji = action === "BUY" ? "📈" : "📉";
    const actionText = action ? action.toUpperCase() : "N/A";
    
    // Professional Risk Management (Example: 3% TP, 2% SL)
    const tp = action === "BUY" ? (price * 1.03).toFixed(4) : (price * 0.97).toFixed(4);
    const sl = action === "BUY" ? (price * 0.98).toFixed(4) : (price * 1.02).toFixed(4);

    return `
🚨 *LIVE CRYPTO SIGNAL*

🪙 *Coin:* ${symbol || "N/A"}
📊 *Action:* ${actionText} ${emoji}
💰 *Price:* ${price || "N/A"}

🎯 *Target (TP):* ${tp} (+3%)
🛑 *Stop Loss (SL):* ${sl} (-2%)

⏰ *Time:* ${new Date().toLocaleString()}
    `;
}

module.exports = {
    formatSignalMessage
};