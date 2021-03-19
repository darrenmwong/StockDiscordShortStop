// TODO: Make embeded for watcher interval.
// TODO: Set own stopper limit on notification with price adjustment.

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
    constructor(url, ticker, message) {
        this.quoteInterval = setInterval( () => {
             getStockPrices(url).then(response => {
                let json = response;
                if(watchHash[ticker].currentPrice - json.c >= 10 ) {
                    message.reply('LOSS. ' + stockHash.get(ticker) + '. Difference: $' + (json.c - watchHash[ticker].currentPrice));
                }
                if(watchHash[ticker].currentPrice - json.c <= -10 ) {
                    message.reply('GAIN. ' + 'Difference: +$' + (json.c - watchHash[ticker].currentPrice));
                }
            })
        }, 10000);
    }
};


const watchQuote = (message, ticker, json, url) => {
   message.reply('Watching ' + ticker);
   let watcher = new QuoteInterval(url, ticker, message);
   watchHash[ticker] = { watch: watcher, currentPrice: json.c };
}


module.exports = { watchQuote, watchHash };