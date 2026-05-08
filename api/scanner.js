const { getAllSymbols, getCandles } = require("../services/binanceService");
const { calculateIndicators } = require("../services/indicatorService");
const { getSignal } = require("../services/signalService");
const { sendTelegramMessage } = require("../services/telegramService");
const { formatSignalMessage } = require("../utils/formatter");

module.exports = async (req, res) => {
    const startTime = Date.now();
    const results = {
        signals: [],
        errors: 0,
        scanned: 0
    };

    try {
        console.log("Fetching all USDT symbols...");
        const allSymbols = await getAllSymbols();
        // Limit to 150 symbols to ensure it finishes within Vercel's 10s Hobby limit
        const symbolsToScan = allSymbols.slice(0, 150); 
        
        console.log(`Starting high-speed scan for ${symbolsToScan.length} symbols...`);

        // Increase batch size for faster execution
        const BATCH_SIZE = 50; 
        for (let i = 0; i < symbolsToScan.length; i += BATCH_SIZE) {
            const batch = symbolsToScan.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async (symbol) => {
                try {
                    const candles = await getCandles(symbol);
                    if (!candles || candles.length < 200) return;

                    const closes = candles.map(c => c.close);
                    const currentPrice = closes[closes.length - 1];
                    const indicators = calculateIndicators(closes);

                    const signal = getSignal(
                        currentPrice,
                        indicators.rsi,
                        indicators.ema
                    );

                    results.scanned++;

                    if (signal) {
                        const message = formatSignalMessage(symbol, signal, currentPrice);
                        await sendTelegramMessage(message);
                        results.signals.push({ symbol, signal });
                        console.log(`✅ [${symbol}] ${signal}`);
                    }
                } catch (err) {
                    results.errors++;
                    // Silently log errors for individual coins to keep the scanner running
                }
            }));
            
            // Optional: Small delay between batches to respect rate limits
            // await new Promise(r => setTimeout(r, 100)); 
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Scan complete. Scanned: ${results.scanned}, Signals: ${results.signals.length}, Errors: ${results.errors}, Time: ${duration}s`);

        return res.status(200).json({
            success: true,
            duration: `${duration}s`,
            summary: results
        });

    } catch (error) {
        console.error("Critical Scanner Error:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};