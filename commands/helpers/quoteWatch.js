// TODO: Make embeded for watcher interval.

const fetch = require('node-fetch');

const watchHash = {};

async function getStockPrices(url) {
    const response = await fetch(url);
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

class QuoteInterval {
    constructor(url, ticker, message, spread) {
        this.quoteInterval = setInterval( () => {
             getStockPrices(url).then(response => {
                let json = response;
                let priceChange = (json.c - watchHash[ticker].currentPrice).toFixed(2);
                if(watchHash[ticker].currentPrice - json.c >= spread ) {
                    message.reply(`$${ticker} Down $${priceChange}. Current price is $${json.c}`);
                }
                if(watchHash[ticker].currentPrice - json.c <= -spread ) {
                    message.reply(`$${ticker} Up $${priceChange}. Current price is $${json.c}`);
                }

                // Set New Ticker Price
                watchHash[ticker].currentPrice = json.c;
                console.log(ticker + ' ' + watchHash[ticker].currentPrice)

            })
        }, 180000);
    }
};


const watchQuote = (message, ticker, json, url, args) => {
   message.reply('Watching ' + ticker);
   // Spread is custom but defaults to 1% of the open price
   let spread = args[2] ? args[2] : (json.o / 100);
   let watcher = new QuoteInterval(url, ticker, message, spread);
   watchHash[ticker] = { watch: watcher, currentPrice: json.c };
}


module.exports = { watchQuote, watchHash };