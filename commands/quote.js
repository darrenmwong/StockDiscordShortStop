const fetch = require('node-fetch');
const config = require('../config.json');

let stockHash = new Map();

// Need last ticker priced so if we quote it doesnt set values. Maybe a hashmap or we can store in a db.
// TODO: If args has watch, we need to check if the symbol is returning true so we can add in a hash map and watch.

module.exports = {
    name: 'quote',
    description: 'Gets quote of stock back',
    execute(message, args) {
        let ticker = args[0].toUpperCase();
        let url = config.payload_url + ticker + "&token=" + config.finnhub_token; 

        async function getStockPrices() {
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }

        getStockPrices().then(response => {
            let json = response;

            if(json.o === 0) {
                message.reply('Symbol does not exist');
                return;
            }

            let percentSpread = (100 / json.pc * json.c) - 100;
            percentSpread = percentSpread.toFixed(2);

            if(stockHash.has(ticker)) {
                if((stockHash.get(ticker) - json.c) >= 10 ) {
                    message.reply('LOSS. ' + stockHash.get(ticker) + '. Difference: $' + (json.c - stockHash.get(ticker)));
                }
                if((stockHash.get(ticker) - json.c) <= -10 ) {
                    message.reply('GAIN. ' + 'Difference: +$' + (json.c - stockHash.get(ticker)));
                }
                stockHash.set(ticker, json.c);
            } else {
                message.channel.send('Current Price: ' + json.c + '. Open Price: ' + json.o + '. Prev Closing Price:' + json.pc);
                stockHash.set(ticker, json.c);
            }

        });

        let watch = false;
        if(args[1] === "watch") {
           watch = true; 
           message.reply('Watching ' + ticker);
           let watchQuote = setInterval(() => { getStockPrices(ticker) }, 120000);
        }
    }

}