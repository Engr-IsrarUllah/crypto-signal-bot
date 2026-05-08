const axios = require("axios");
const { INTERVAL, LIMIT } = require("../config/constants");

async function getCandles(symbol, interval = INTERVAL, limit = LIMIT) {

    const url =
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await axios.get(url);

    return response.data.map(candle => ({
        close: parseFloat(candle[4])
    }));
}

async function getAllSymbols() {
    const url = "https://api.binance.com/api/v3/exchangeInfo";
    const response = await axios.get(url);
    return response.data.symbols
        .filter(s => s.status === "TRADING" && s.quoteAsset === "USDT")
        .map(s => s.symbol);
}

module.exports = {
    getCandles,
    getAllSymbols
};