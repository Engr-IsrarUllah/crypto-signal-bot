const { RSI, EMA } = require("technicalindicators");

function calculateIndicators(closes) {

    const rsi = RSI.calculate({
        values: closes,
        period: 14
    });

    const ema = EMA.calculate({
        values: closes,
        period: 200
    });

    return {
        rsi: rsi[rsi.length - 1],
        ema: ema[ema.length - 1]
    };
}

module.exports = {
    calculateIndicators
};