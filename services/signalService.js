function getSignal(price, rsi, ema) {

    if (!rsi || !ema) return null;

    // BUY Strategy: RSI is oversold (< 30) and price is above EMA 200 (Uptrend)
    if (rsi < 30 && price > ema) {
        return "BUY";
    }

    // SELL Strategy: RSI is overbought (> 70) and price is below EMA 200 (Downtrend)
    if (rsi > 70 && price < ema) {
        return "SELL";
    }

    return null;
}

module.exports = {
    getSignal
};